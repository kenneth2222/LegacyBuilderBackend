const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verify, reset } = require('../utils/html');
const { send_mail } = require('../middleware/nodemailer');
const { validate } = require('../utils/utilities');
<<<<<<< HEAD
const { registerAdminSchema,registerUserSchema, loginSchema, forgotPasswordSchema } = require('../middleware/validator');
=======
const { registerAdminSchema,registerUserSchema, loginSchema, forgotPasswordSchema, changeUserPasswordSchema} = require('../middleware/validator');
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e


exports.registerUser = async (req, res) => {
  try {
    const validatedData = await validate(req.body, registerUserSchema)
<<<<<<< HEAD
    const { fullName, email, username, password, } = validatedData;
   
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({
        message: 'Input required for all field'
      })
    };

    const existingEmail = await userModel.find({ email: email.toLowerCase() });

    if (existingEmail.length === 1) {
=======
    const { fullName, email, username, password } = validatedData;
   
    // if (!fullName || !email || !username || !password || !confirmPassword) {
    //   return res.status(400).json({
    //     message: 'Input required for all field'
    //   })
    // };

    const existingEmail = await userModel.findOne({ email: email.toLowerCase() });

    if (existingEmail) {
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
      return res.status(400).json({
        message: `${email.toLowerCase()} already exist`
      })
    };
    const existingUsername = await userModel.findOne({ username: username.toLowerCase() });

    if (existingUsername) 
      return res.status(400).json({
<<<<<<< HEAD
       message: `username is already taken`
=======
       message: `${username.toLowerCase()} is already taken`
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
    
    });

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);

    const user = new userModel({
      fullName,
<<<<<<< HEAD
      email,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1day' });
=======
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
    });

    //  // Save user to DB
    //  await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
    const link = `${req.protocol}://${req.get('host')}/api/v1/verify/user/${token}`;
    const firstName = user.fullName.split(' ')[0];

    const mailOptions = {
      email: user.email,
      subject: 'Account Verification',
      html: verify(link, firstName)
    };

    await send_mail(mailOptions);
    await user.save();
<<<<<<< HEAD
    res.status(201).json({
      message: 'Account registered successfully',
=======

    res.status(201).json({
      message: 'User registered successfully',
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
      data: user
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
<<<<<<< HEAD
      message: 'Error registering user',data: error.message
=======
      message: 'Error registering user', data: error.message
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
    })
  }
};


exports.verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        message: 'Token not found'
      })
    };

    jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
      if (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          const { userId } = jwt.decode(token);
          const user = await userModel.findById(userId);

          if (!user) {
            return res.status(404).json({
              message: 'Account not found'
            })
          };

          if (user.isVerified === true) {
            return res.status(400).json({
              message: 'Account is verified already'
            })
          };

          const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5mins' });
          const link = `${req.protocol}://${req.get('host')}/api/v1/verify/user/${newToken}`;
          const firstName = user.fullName.split(' ')[0];

          const mailOptions = {
            email: user.email,
            subject: 'Resend: Account Verification',
            html: verify(link, firstName)
          };

          await send_mail(mailOptions);
          res.status(200).json({
            message: 'Session expired: Link has been sent to email address'
          })
        }
      } else {
        const user = await userModel.findById(payload.userId);

        if (!user) {
          return res.status(404).json({
            message: 'Account not found'
          })
        };

        if (user.isVerified === true) {
          return res.status(400).json({
            message: 'Account is verified already'
          })
        };

        user.isVerified = true;
        await user.save();

        res.status(200).json({
          message: 'Account verified successfully'
        })
      }
    });
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired: link has been sent to email address'
      })
    }
    res.status(500).json({
      message: 'Error Verifying user'
    })
  }
};


exports.loginUser = async (req, res) => {
  try {
    const validatedData = await validate(req.body, loginSchema)

    const { username, password } = validatedData;
   
    if (!username) {
      return res.status(400).json({
        message: 'Please enter your userName correctly'
      })
    };


    if (!password) {
      return res.status(400).json({
        message: 'Please your password'
      })
    };

    const user = await userModel.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(400).json({
<<<<<<< HEAD
        message: 'User not find with that username'
=======
        message: 'User not found with that username'
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
      })
    };

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return res.status(400).json({
        message: 'Incorrect password'
      })
    };

    if (user.isVerified === false) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1day' });
      const link = `${req.protocol}://${req.get('host')}/api/v1/verify/user/${token}`;
      const firstName = user.fullName.split(' ')[0];

      const mailOptions = {
        email: user.email,
        subject: 'Account Verification',
        html: verify(link, firstName)
      };

      await send_mail(mailOptions);
      return res.status(400).json({
        message: 'Account is not verified, link has been sent to email address'
      })
    }
    user.isLoggedIn = true
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1day' });

    await user.save()

    res.status(200).json({
      message: 'Account login successfull',
      token
    })
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired. Please login again'
      })
    }
    res.status(500).json({
      message: 'Error Logging user In',data: error.message
    })
  }
};


exports.forgotUserPassword = async (req, res) => {
  try {
    const validatedData = await validate(req.body, forgotPasswordSchema)
    const { email } = validatedData;
    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

<<<<<<< HEAD
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10mins' });
    const link = `${req.protocol}://${req.get('host')}/api/v1/reset=password/user/${token}`; // consumed post link
=======
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15mins' });
    const link = `${req.protocol}://${req.get('host')}/api/v1/reset_password/user/${token}`; // consumed post link
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
    const firstName = user.fullName.split(' ')[0];

    const mailOptions = {
      email: user.email,
      subject: 'Reset Password',
      html: reset(link, firstName)
    };

    await send_mail(mailOptions);
    return res.status(200).json({
      message: 'Link has been sent to email address'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Forgot password failed',data: error.message
    })
  }
};


exports.resetUserPassword = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        message: 'Token not found'
      })
    };

    const { newPassword, confirmPassword } = req.body;

<<<<<<< HEAD
=======
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Both password fields are required" });
    }

>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      })
    };

<<<<<<< HEAD
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
=======
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
<<<<<<< HEAD
=======
    
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired. Please enter your email to resend link'
      })
    };
    res.status(500).json({
      message: 'Error resetting password'
    })
  }
};


exports.changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
<<<<<<< HEAD
    const { currentPassword, newPassword, confirmPassword } = req.body;
=======

    const validatedData = await validate(req.body, changeUserPasswordSchema)
    const { currentPassword, newPassword} = validatedData;
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
<<<<<<< HEAD
        message: 'Account not found'
=======
        message: 'User not found'
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
      })
    };

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: 'Incorrect password'
      })
    };

<<<<<<< HEAD
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      })
    };
=======
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({ 
        message: "New password cannot be the same as the current password" 
      });
    }
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
<<<<<<< HEAD
      message: 'Password change successfully'
=======
      message: 'Password changed successfully'
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error Changing Password'
    })
  }
};


<<<<<<< HEAD
exports.logoutUser = async (req, res) => {
  try {
    const validatedData = await validate(req.body, logoutSchema)
   
    const { email, username, password } = validatedData;
    const user = await userModel.findById(req.user.userId)
    if(!user){
      return res.status(400).json({
        message: 'User not found',
    })
    
  }
  user.isLoggedIn = false
  await user.save()

  res.status(200).json({ message: 'Logged out successfully' });

  } catch (error) {
    console.log(error.message)
     res.status(500).json({
      message: "Error Logout failed",error: error.message
    }) 
=======
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


exports.logoutUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);

    if (!user) {
      return res.status(400).json({ 
        message: "User not found" 
      });
    }

    user.isLoggedIn = false;
    await user.save();

    res.status(200).json({ 
      message: "Logged out successfully" 
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error: Logout failed" + error.message
    });
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
  }
};



