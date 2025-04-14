const jwt = require('jsonwebtoken');
const upload = require('../utils/multer')
const {registerAdmin, registerStudent, verifyStudent, loginStudent, forgotStudentPassword,
   resetStudentPassword, changeStudentPassword,logoutStudent, getStudentsWithPointsAndResults,
   filterStudentsWithPointsAndResultsBySubject, uploadImage, updateImage, deleteImage, getAllStudents, addSubject, removeSubject, myRating, getStudentById,
   updateStudent} = require('../controller/studentController');

const { authenticate, adminAuth} = require('../middleware/authentication');
const passport = require("passport");
const studentRouter = require('express').Router();



/**
 * @swagger
 * /api/v1/student:
 *   post:
 *     summary: Register a new student
 *     description: Registers a new student with their details and subjects of study.
 *     tags:
 *       - Students
 *     security: [] # No Authentication Needed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the student
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the student
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the student account (hashed before storing)
 *                 example: "yourPassword123*"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Password for the student account (hashed before storing)
 *                 example: "yourPassword123*"
 *               enrolledSubjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - English
 *                     - Mathematics
 *                     - Physics
 *                     - Chemistry
 *                     - Biology
 *                     - Literature in English
 *                     - Economics
 *                     - Geography
 *                     - Government
 *                     - History
 *                 description: List of subjects the student is enrolled in
 *                 example:
 *                   - Mathematics
 *                   - English
 *     responses:
 *       201:
 *         description: Student registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique student ID
 *                       example: "607f1f77bcf86cd799439011"
 *                     fullName:
 *                       type: string
 *                       description: Full name of the student
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: Email address of the student
 *                       example: "johndoe@example.com"
 *                     enrolledSubjects:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of subjects the student is enrolled in
 *                       example:
 *                         - Mathematics
 *                         - English
 *                     isVerified:
 *                       type: boolean
 *                       description: Whether the student's email is verified
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date and time when the student account was created
 *                       example: "2025-04-08T11:10:52.537Z"
 *       400:
 *         description: Bad Request - Validation error or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email already exists"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error registering student"
 */

studentRouter.post('/student', registerStudent);

/**
 * @swagger
 * /api/v1/student/login:
 *   post:
 *     summary: Student Login
 *     description: Authenticates a student and returns a JWT token upon successful login.
 *     tags:
 *       - Students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The student's registered email
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The student's password
 *                 example: "yourPassword123*"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account login successful"
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad Request - Invalid Credentials or Missing Data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Incorrect password"
 *       401:
 *         description: Unauthorized - Account not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account is not verified, link has been sent to email address"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error logging user in"
 */

studentRouter.post('/student/login/', loginStudent);

/**
 * @swagger
 * /api/v1/forgot_password/student:
 *   post:
 *     summary: Request a password reset link
 *     description: Sends a password reset link to the student's registered email.
 *     tags:
 *       - Students
 *     security: [] # No Authentication Needed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Registered email address of the student
 *                 example: "johndoe@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Link has been sent to email address"
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forgot password failed"
 */


studentRouter.post('/forgot_password/student', forgotStudentPassword);

/**
 * @swagger
 * /api/v1/reset_password/student/{token}:
 *   post:
 *     summary: Reset a student's password
 *     description: Allows students to reset their password using a valid token.
 *     tags:
 *       - Students
 *     security: [] # No Authentication Needed
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The password reset token
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password for the student
 *                 example: "NewStrongP@ssword123"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Must match the new password
 *                 example: "NewStrongP@ssword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Bad Request - Invalid Input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Both password fields are required"
 *       404:
 *         description: Not Found - Token or Student Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error resetting password"
 */

studentRouter.post('/reset_password/student/:token', resetStudentPassword);

/**
 * @swagger
 * /api/v1/verify/student/{token}:
 *   get:
 *     summary: Verify student account
 *     description: Verifies a student's account using the provided token. If valid, the student's account is marked as verified. If expired, a new verification link is sent.
 *     tags:
 *       - Students
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: JWT token for account verification
 *         schema:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Account verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account verified successfully"
 *       400:
 *         description: Bad Request - Session expired or account already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session expired: link has been sent to email address"
 *       404:
 *         description: Not Found - Token or student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error verifying student"
 */

studentRouter.get('/verify/student/:token', verifyStudent);

/**
 * @swagger
 * /api/v1/change/password/student/{id}:
 *   post:
 *     summary: Change student password
 *     description: Allows an authenticated student to update their password.
 *     tags:
 *       - Students
 *     security:
 *       - BearerAuth: [] # Assumes authentication is required
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student whose password is being changed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: The student's current password.
 *                 example: "OldP@ssword123*"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password.
 *                 example: "NewP@ssword123*"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: The new confirmed password.
 *                 example: "NewP@ssword123*"
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Bad Request - Invalid Input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Incorrect password"
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error changing password"
 */


studentRouter.post('/change/password/student/:id', changeStudentPassword);

/**
 * @swagger
 * /api/v1/logout:
 *   post:
 *     summary: Logout a student
 *     description: Logs out an authenticated student by updating their login status.
 *     tags:
 *       - Students
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       400:
 *         description: Bad Request - Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error: Logout failed [error message]"
 */

studentRouter.post('/logout', authenticate, logoutStudent);

/**
 * @swagger
 * /api/v1/student:
 *   get:
 *     summary: Get all students with their points and results
 *     description: Retrieves a list of all students along with their enrolled subjects, points, and results for each subject.
 *     tags:
 *       - Students
 *     responses:
 *       200:
 *         description: Successfully retrieved list of students with points and results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6613a491f9e865550c8b4567"
 *                       studentId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "6613a3eec8c0c25f989f1234"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             example: "john@example.com"
 *                           enrolledSubjects:
 *                             type: array
 *                             items:
 *                               type: string
 *                               example: "English"
 *                       subject:
 *                         type: string
 *                         example: "Mathematics"
 *                       points:
 *                         type: number
 *                         example: 85
 *                       result:
 *                         type: number
 *                         example: 90
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */

studentRouter.get('/student', getStudentsWithPointsAndResults);


/**
 * @swagger
 * /api/v1/student/{subject}:
 *   get:
 *     summary: Get students' points and results by subject
 *     description: Retrieves a list of students filtered by the specified subject, including their enrolled subjects, points, and results.
 *     tags:
 *       - Students
 *     parameters:
 *       - in: path
 *         name: subject
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - English
 *             - Mathematics
 *             - Physics
 *             - Chemistry
 *             - Biology
 *             - Literature in English
 *             - Economics
 *             - Geography
 *             - Government
 *             - History
 *         description: The subject to filter students by.
 *     responses:
 *       200:
 *         description: Successfully retrieved list of students filtered by subject
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6613a491f9e865550c8b4567"
 *                       studentId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "6613a3eec8c0c25f989f1234"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             example: "john@example.com"
 *                           enrolledSubjects:
 *                             type: array
 *                             items:
 *                               type: string
 *                               example: "English"
 *                       subject:
 *                         type: string
 *                         example: "Mathematics"
 *                       points:
 *                         type: number
 *                         example: 85
 *                       result:
 *                         type: number
 *                         example: 90
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */

studentRouter.get('/student/:subject', filterStudentsWithPointsAndResultsBySubject);


/**
 * @swagger
 * /api/v1/upload-profileImage/{studentId}:
 *   post:
 *     summary: Upload profile image for a student
 *     description: Upload and compress a student's profile image, then save the image URL and public ID to the student profile.
 *     tags:
 *       - Students
 *     parameters:
 *       - name: studentId
 *         in: path
 *         description: ID of the student to upload the image for
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The profile image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded and student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image uploaded and student updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "604c1f1c25c8b242f0a3d5f1"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     image:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                           example: "sample_public_id"
 *                         imageUrl:
 *                           type: string
 *                           example: "https://res.cloudinary.com/demo/image/upload/v1615280309/sample.jpg"
 *       400:
 *         description: Bad request (e.g., missing student ID, no image uploaded, or invalid file type)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student ID is required"
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student not found"
 *       500:
 *         description: Server error during image upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image upload failed"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */

studentRouter.post('/upload-profileImage/:studentId', upload.single('image'), uploadImage);

/**
 * @swagger
 * /api/v1/update-profileImage/{studentId}:
 *   put:
 *     summary: Update profile image for a student
 *     description: Update and compress an existing student's profile image, then save the new image URL and public ID to the student profile.
 *     tags:
 *       - Students
 *     parameters:
 *       - name: studentId
 *         in: path
 *         description: ID of the student to update the image for
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The new profile image file to upload
 *     responses:
 *       200:
 *         description: Image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "604c1f1c25c8b242f0a3d5f1"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     image:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                           example: "sample_public_id"
 *                         imageUrl:
 *                           type: string
 *                           example: "https://res.cloudinary.com/demo/image/upload/v1615280309/sample.jpg"
 *       400:
 *         description: Bad request (e.g., missing student ID, no image uploaded, or invalid file type)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student ID is required"
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student not found"
 *       500:
 *         description: Server error during image update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image update failed"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */

studentRouter.put('/update-profileImage/:studentId', upload.single('image'), updateImage);

/**
 * @swagger
 * /api/v1/delete-profileImage/{studentId}:
 *   delete:
 *     summary: Delete profile image for a student
 *     description: Delete a student's profile image from Cloudinary and remove the reference from the student profile.
 *     tags:
 *       - Students
 *     parameters:
 *       - name: studentId
 *         in: path
 *         description: ID of the student whose profile image will be deleted
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "604c1f1c25c8b242f0a3d5f1"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     image:
 *                       type: object
 *                       example: null
 *       400:
 *         description: Bad request (e.g., no image to delete or invalid student ID)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No image to delete"
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student not found"
 *       500:
 *         description: Server error during image deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image deletion failed"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */

studentRouter.delete('/delete-profileImage/:studentId', deleteImage);

/**
 * @swagger
 * /api/v1/addSubject/{studentId}:
 *   post:
 *     summary: Add a subject to a student's enrolled subjects
 *     description: Add a single subject to the list of subjects a student is enrolled in.
 *     tags:
 *       - Students
 *     parameters:
 *       - name: studentId
 *         in: path
 *         description: ID of the student to add the subject to
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 example: "Mathematics"
 *     responses:
 *       200:
 *         description: Subject added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subject added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "604c1f1c25c8b242f0a3d5f1"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     enrolledSubjects:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["English", "Mathematics"]
 *       400:
 *         description: Bad request (e.g., missing studentId or subject, or invalid subject)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subject is required"
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student not found"
 */

studentRouter.post('/addSubject/:studentId', addSubject);


/**
 * @swagger
 * /api/v1/removeSubject/{studentId}:
 *   put:
 *     summary: Remove a subject from a student's enrolled subjects
 *     description: Remove a specific subject from the list of a student's enrolled subjects, except core subjects like Mathematics or English.
 *     tags:
 *       - Students
 *     parameters:
 *       - name: studentId
 *         in: path
 *         description: ID of the student whose subject will be removed
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 example: "Literature in English"
 *     responses:
 *       200:
 *         description: Subject removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subject removed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "604c1f1c25c8b242f0a3d5f1"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     enrolledSubjects:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["English", "Mathematics"]
 *       400:
 *         description: Bad request (e.g., missing studentId, subject, or invalid operation)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subject not found in enrolled subjects"
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subject removal failed"
 *                 error:
 *                   type: string
 *                   example: "Internal server error details"
 */

studentRouter.put('/removeSubject/:studentId', removeSubject);

/**
 * @swagger
 * /api/v1/myRating/{studentId}:
 *   put:
 *     summary: Update a student's rating for a subject
 *     description: Allows the student to update their rating for a specific subject, including performance, duration, and whether the subject is completed or not.
 *     tags:
 *       - Students
 *     parameters:
 *       - name: studentId
 *         in: path
 *         description: ID of the student whose rating will be updated
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 example: "Mathematics"
 *                 enum:
 *                   - "English"
 *                   - "Mathematics"
 *                   - "Physics"
 *                   - "Chemistry"
 *                   - "Biology"
 *                   - "Literature in English"
 *                   - "Economics"
 *                   - "Geography"
 *                   - "Government"
 *                   - "History"
 *               performance:
 *                 type: number
 *                 example: 85
 *                 description: The student's performance rating for the subject (0-100)
 *               duration:
 *                 type: number
 *                 example: 120
 *                 description: The duration of study or time spent on the subject in minutes
 *               completed:
 *                 type: string
 *                 example: "yes"
 *                 enum:
 *                   - "yes"
 *                   - "no"
 *                 description: Whether the student has completed the subject (yes or no)
 *     responses:
 *       200:
 *         description: Student rating updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student rating updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f9b1d8b4b9e6b8d8e"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     myRating:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           subject:
 *                             type: string
 *                             example: "Mathematics"
 *                           performance:
 *                             type: number
 *                             example: 85
 *                           duration:
 *                             type: number
 *                             example: 120
 *                           completed:
 *                             type: string
 *                             example: "yes"
 *                     totalRating:
 *                       type: number
 *                       example: 85
 *       400:
 *         description: Bad request (e.g., missing studentId, subject, performance, or invalid operation)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields are required"
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to update student rating"
 *                 error:
 *                   type: string
 *                   example: "Internal server error details"
 */

studentRouter.put('/myRating/:studentId', myRating);


/**
 * @swagger
 * /api/v1/studentInfo/{studentId}:
 *   get:
 *     summary: Retrieve student details by student ID
 *     description: Fetch a student's details using their unique student ID.
 *     tags:
 *       - Students
 *     parameters:
 *       - name: studentId
 *         in: path
 *         description: ID of the student to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f9b1d8b4b9e6b8d8e"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     enrolledSubjects:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["English", "Mathematics"]
 *                     myRating:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           subject:
 *                             type: string
 *                             example: "Mathematics"
 *                           performance:
 *                             type: number
 *                             example: 85
 *                           duration:
 *                             type: number
 *                             example: 120
 *                           completed:
 *                             type: string
 *                             example: "yes"
 *                     totalRating:
 *                       type: number
 *                       example: 85
 *       400:
 *         description: Bad request (e.g., missing studentId)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student ID is required"
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve student"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
studentRouter.get('/studentInfo/:studentId', getStudentById);

studentRouter.post('/student/update',updateStudent)


//This is just to keep the render active
studentRouter.get('/students', getAllStudents);

module.exports = studentRouter;