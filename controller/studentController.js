// const userModel = require('../model/userModel');
require("dotenv").config();
const studentModel = require("../model/student");
const scoreBoardModel = require("../model/scoreBoard");
const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get("host")}`;


const sharp = require("sharp");
const path = require("path");
// const fs = require("fs");
const fs = require('fs').promises;
const cloudinary = require("../config/cloudinary");
// const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verify, reset } = require("../utils/html");
const { send_mail } = require("../middleware/nodemailer");
const { validate } = require("../utils/utilities");
const {
  registerAdminSchema,
  registerStudentSchema,
  loginSchema,
  forgotPasswordSchema,
  changeStudentPasswordSchema,
  resetStudentPasswordSchema,
} = require("../middleware/validator");


exports.registerStudent = async (req, res) => {
  try {
    const validatedData = await validate(req.body, registerStudentSchema);
    const { fullName, email, password, enrolledSubjects } = validatedData;

    const existingEmail = await studentModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(400).json({
        message: `${email.toLowerCase()} already exist`,
      });
    }

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);

    const student = new studentModel({
      fullName,
      email: email.toLowerCase(),
      // username: username.toLowerCase(),
      password: hashedPassword,
      enrolledSubjects,
    });

    const scoreBoardEntries = student.enrolledSubjects.map((subject) => ({
      studentId: student._id,
      subject,
    }));

    await scoreBoardModel.insertMany(scoreBoardEntries);

    const token = jwt.sign({ studentId: student._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const link = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/verify/student/${token}`;
    const firstName = student.fullName.split(" ")[0];

    const mailOptions = {
      email: student.email,
      subject: "Account Verification",
      html: verify(link, firstName),
    };

    await send_mail(mailOptions);
    await student.save();

    res.status(201).json({
      message: "Student registered successfully",
      data: student,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

exports.verifyStudent = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
      if (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          const { studentId } = jwt.decode(token);
          const student = await studentModel.findById(studentId);

          if (!student) {
            return res.status(404).json({
              message: "Account not found",
            });
          }

          if (student.isVerified === true) {
            return res.status(200).json({
              message: "Account is verified already",
            });
          }

          const newToken = jwt.sign(
            { studentId: student._id },
            process.env.JWT_SECRET,
            { expiresIn: "10mins" }
          );
          const link = `${req.protocol}://${req.get(
            "host"
          )}/api/v1/verify/student/${newToken}`;
          // const link = `https://legacy-builder.vercel.app/verify/${newToken}`;
          const firstName = student.fullName.split(" ")[0];

          const mailOptions = {
            email: student.email,
            subject: "Resend: Account Verification",
            html: verify(link, firstName),
          };

          await send_mail(mailOptions);
          res.status(200).json({
            message: "Session expired: Link has been sent to email address",
          });
        }
      } else {
        const student = await studentModel.findById(payload.studentId);

        if (!student) {
          return res.status(404).json({
            message: "Account not found",
          });
        }

        if (student.isVerified === true) {
          return res.status(400).json({
            message: "Account is verified already",
          });
        }

        student.isVerified = true;
        await student.save();

        // res.status(200).json({
        //   message: "Account verified successfully",
        // });
        return res.redirect(`https://legacy-builder.vercel.app/verify/${newToken}`);
      }
    });
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: "Session expired: link has been sent to email address",
      });
    }
    res.status(500).json({
      message: "Error Verifying user",
    });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const validatedData = await validate(req.body, loginSchema);

    const { email, password } = validatedData;

    if (!email) {
      return res.status(400).json({
        message: "Please enter your email correctly",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Please enter your password correctly",
      });
    }

    const student = await studentModel.findOne({ email: email.toLowerCase() });

    if (!student) {
      return res.status(400).json({
        message: "User not found with that username",
      });
    }

    const isCorrectPassword = await bcrypt.compare(password, student.password);

    if (!isCorrectPassword) {
      return res.status(400).json({
        message: "invalid credentials",
      });
    }

    if (student.isVerified === false) {
      const token = jwt.sign(
        { studentId: student._id },
        process.env.JWT_SECRET,
        { expiresIn: "1day" }
      );
     
      // const link = `${req.protocol}://${req.get(
      //   "host"
      // )}/api/v1/verify/student/${token}`;
      const link = `${baseUrl}/api/v1/verify/student/${token}`;
      const firstName = student.fullName.split(" ")[0];

      const mailOptions = {
        email: student.email,
        subject: "Account Verification",
        html: verify(link, firstName),
      };

      await send_mail(mailOptions);
      return res.status(400).json({
        message: "Account is not verified, link has been sent to email address",
      });
    }
    student.isLoggedIn = true;
    const token = jwt.sign({ studentId: student._id }, process.env.JWT_SECRET, {
      expiresIn: "1day",
    });

    await student.save();

    res.status(200).json({
      message: "Account login successful",
      token,
    });
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: "Session expired. Please login again",
      });
    }
    res.status(500).json({
      message: "Error Logging user In",
      data: error.message,
    });
  }
};

exports.forgotStudentPassword = async (req, res) => {
  try {
    const validatedData = await validate(req.body, forgotPasswordSchema);
    const { email } = validatedData;
    const student = await studentModel.findOne({ email: email.toLowerCase() });

    if (!student) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const token = jwt.sign({ studentId: student._id }, process.env.JWT_SECRET, {
      expiresIn: "15mins",
    });
    const link = `${baseUrl}/api/v1/reset_password/student/${token}`; // consumed post link
    // const link = `${baseUrl}/api/v1/reset_password/student/${token}`; // consumed post link
    const firstName = student.fullName.split(" ")[0];

    const mailOptions = {
      email: student.email,
      subject: "Reset Password",
      html: reset(link, firstName),
    };

    await send_mail(mailOptions);
    return res.status(200).json({
      message: "Link has been sent to email address",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "invalid credentials",
      data: error.message,
    });
  }
};

exports.resetStudentPassword = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }

    const validatedData = await validate(req.body, resetStudentPasswordSchema);
    const { newPassword, confirmPassword } = validatedData;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Both password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Password does not match",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.studentId;

    const student = await studentModel.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltedRound);

    student.password = hashedPassword;
    await student.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: "Session expired. Please enter your email to resend link",
      });
    }
    res.status(500).json({
      message: "Error resetting password",
    });
  }
};

exports.changeStudentPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const validatedData = await validate(req.body, changeStudentPasswordSchema);
    const { currentPassword, newPassword } = validatedData;

    const student = await studentModel.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      student.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "invalid credentials",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, student.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the current password",
      });
    }

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
    student.password = hashedPassword;
    await student.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error Changing Password",
    });
  }
};

// exports.logoutUser = async (req, res) => {
//   try {
//     const validatedData = await validate(req.body, logoutSchema)

//     const { email, username, password } = validatedData;
//     const user = await userModel.findById(req.user.userId)
//     if(!user){
//       return res.status(400).json({
//         message: 'User not found',
//     })

//   }
//   user.isLoggedIn = false
//   await user.save()

//   res.status(200).json({ message: 'Logged out successfully' });

//   } catch (error) {
//     console.log(error.message)
//      res.status(500).json({
//       message: "Error Logout failed",error: error.message
//     })
//   }
// };

exports.logoutStudent = async (req, res) => {
  try {
    const student = await studentModel.findById(req.student.studentId);

    if (!student) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    student.isLoggedIn = false;
    await student.save();

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error: Logout failed" + error.message,
    });
  }
};

exports.getStudentsWithPointsAndResults = async (req, res) => {
  try {
    const scores = await scoreBoardModel
      .find()
      .populate({
        path: "studentId",
        select: "name email enrolledSubjects",
      })
      .select("studentId subject points result");

    res.status(200).json({
      success: true,
      data: scores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.filterStudentsWithPointsAndResultsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    const scores = await scoreBoardModel
      .find({ subject })
      .populate({
        path: "studentId",
        select: "name email enrolledSubjects",
      })
      .select("studentId subject points result");

    res.status(200).json({
      success: true,
      data: scores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID is required",
      });
    }

   // Handle multer validation errors here
   if (req.fileValidationError) {
    return res.status(400).json({
      message: req.fileValidationError,
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: "Image is required",
    });
  }
  console.log("File path to delete:", req.file.path);
    // Define compressed file path
    const compressedFilePath = path.join(
      __dirname,
      "../uploads/compressed-" + req.file.filename
    );

    let result; //

    try {
      // Compress the image using sharp
      await sharp(req.file.path)
      .resize(60, 60, { 
        fit: sharp.fit.inside,  // Ensures the image fits inside the specified dimensions while maintaining aspect ratio
        withoutEnlargement: true  // Prevents enlarging small images
      })
        .jpeg({ quality: 70 }) // Compress JPEG to 70% quality
        .toFile(compressedFilePath);

      result = await cloudinary.uploader.upload(compressedFilePath, {
        folder: "Image Folder",
        use_filename: true,
      });

      // Delete the original image after upload
      await fs.unlink(req.file.path);
      console.log("Original image deleted successfully");

      // Delete the compressed image after upload
      await fs.unlink(compressedFilePath);
      console.log("Compressed image deleted successfully");

    } catch (error) {
      console.log("Error uploading image to Cloudinary:", error.message);
      return res.status(500).json({
        message: "Image upload failed",
        error: error.message,
      });
    }

    const updatedStudent = await studentModel.findByIdAndUpdate(
      studentId,
      {
        image: {
          public_id: result.public_id,
          imageUrl: result.secure_url,
        },
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.status(200).json({
      message: "Image uploaded and student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.log("Error uploading image:", error);
    return res.status(500).json({
      message: "Image upload failed",
      error: error.message,
    });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID is required",
      });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    
    const student = await studentModel.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }


    // Delete the previous image from Cloudinary
    if (student.image && student.image.public_id) {
      await cloudinary.uploader.destroy(student.image.public_id);
    }

    // Define compressed file path
    const compressedFilePath = path.join(
      __dirname,
      "../uploads/compressed-" + req.file.filename
    );

    // Compress the image
    await sharp(req.file.path)
    .resize(60, 60, {
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .jpeg({ quality: 70 })
    .toFile(compressedFilePath);

   
      const result = await cloudinary.uploader.upload(compressedFilePath, {
        folder: 'Image Folder',
        use_filename: true,
      });
    
    fs.unlink(req.file.path)
    .then(() => {
      console.log("File deleted successfully");
    })
    .catch((err) => {
      console.error("Error deleting local image:", err.message);
    });

    fs.unlink(compressedFilePath)
    .then(() => {
      console.log("File deleted successfully");
    })
    .catch((err) => {
      console.error("Error deleting local image:", err.message);
    });

    // Update student image data in the database
    student.image = {
      public_id: result.public_id,
      imageUrl: result.secure_url,
    };

    await student.save();

    return res.status(200).json({
      message: "Image updated successfully",
      data: student,
    });
  } catch (error) {
    console.log("Error updating image:", error);
    return res.status(500).json({
      message: "Image update failed",
      error: error.message,
    });
  }
};


exports.deleteImage = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID is required",
      });
    }

    const student = await studentModel.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (student.image && student.image.public_id) {
      
      await cloudinary.uploader.destroy(student.image.public_id);


      // Remove the image reference from the student document
      student.image = undefined;

      await student.save();

      return res.status(200).json({
        message: "Image deleted successfully",
        data: student,
      });
    } else {
      return res.status(400).json({
        message: "No image to delete",
      });
    }
  } catch (error) {
    console.log("Error deleting image:", error);
    return res.status(500).json({
      message: "Image deletion failed",
      error: error.message,
    });
  }
};

//This is just for firing render and keeping it active
exports.getAllStudents = async (req, res) => {
  const students = await studentModel.find();

  if (!students) {
    return res.status(404).json({
      message: "No students found",
    });
  }else {
    return res.status(200).json({
      message: "Students retrieved successfully",
      data: students,
    });     
  };
};

//This is just for firing render and keeping it active
exports.getAllStudents = async (req, res) => {
  const students = await studentModel.find();

  if (!students) {
    return res.status(404).json({
      message: "No students found",
    });
  }else {
    return res.status(200).json({
      message: "Students retrieved successfully",
      data: students,
    });     
  };
};