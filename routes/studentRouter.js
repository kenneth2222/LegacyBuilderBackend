const jwt = require('jsonwebtoken');
const {registerAdmin, registerStudent, verifyStudent, loginStudent, forgotStudentPassword,
   resetStudentPassword, changeStudentPassword,logoutStudent, getStudentsWithPointsAndResults,
   filterStudentsWithPointsAndResultsBySubject } = require('../controller/studentController');

const { authenticate, adminAuth} = require('../middleware/authentication');
const passport = require("passport");
const studentRouter = require('express').Router();



/**
 * @swagger
 * /student:
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
 *                 example: "yourpassword123"
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
 * /student/login:
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
 *                 example: "yourpassword123"
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
 * /forgot_password/student:
 *   post:
 *     summary: Request a password reset link
 *     description: Sends a password reset link to the student's registered email.
 *     tags:
 *       - Authentication
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
 * /reset_password/student/{token}:
 *   post:
 *     summary: Reset a student's password
 *     description: Allows students to reset their password using a valid token.
 *     tags:
 *       - Users
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
 * /verify/student/{token}:
 *   get:
 *     summary: Verify student account
 *     description: Verifies a student's account using the provided token. If valid, the student's account is marked as verified. If expired, a new verification link is sent.
 *     tags:
 *       - Users
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
 * /change/password/student/{id}:
 *   post:
 *     summary: Change student password
 *     description: Allows an authenticated student to update their password.
 *     tags:
 *       - Users
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
 *                 example: "OldP@ssword123"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password.
 *                 example: "NewP@ssword123"
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
 * /logout:
 *   post:
 *     summary: Logout a student
 *     description: Logs out an authenticated student by updating their login status.
 *     tags:
 *       - Users
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
 * /student:
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
 * /student/{subject}:
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

module.exports = studentRouter;