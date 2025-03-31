const {registerAdmin, registerUser, verifyUser, loginUser, forgotUserPassword,
   resetUserPassword, changeUserPassword,logoutUser } = require('../controller/userController');

const { authenticate, adminAuth} = require('../middleware/authentication');
const userRouter = require('express').Router();



/**
 * @swagger
 * /user:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account in the system with email verification.
 *     tags:
 *       - Users
 *     security: [] # No Authentication Needed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the user
 *                 example: "Akunwanne Kenneth"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                 example: "aiengineer@gmail.com"
 *               username:
 *                 type: string
 *                 description: Unique username
 *                 example: "ken_tech"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (hashed before storing)
 *                 example: "StrongP@ssword123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: "67c9e9fe16af37fc64fc25f6"
 *                     fullName:
 *                       type: string
 *                       description: Full name of the user
 *                       example: "Akunwanne Kenneth"
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: User's email address
 *                       example: "obusco4lyfe@gmail.com"
 *                     username:
 *                       type: string
 *                       description: Unique username
 *                       example: "ken_tech"
 *                     isVerified:
 *                       type: boolean
 *                       description: Whether the user's email is verified
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date and time when the user was created
 *                       example: "2025-03-06T18:31:26.298Z"
 *       400:
 *         description: Bad Request - Invalid Input or Email/Username already exists
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
 *                   example: "Error registering user"
 */
userRouter.post('/user', registerUser);

userRouter.post('/user/login/', loginUser);
userRouter.post('/forgot_password/user', forgotUserPassword);
userRouter.post('/reset_password/user/:token', resetUserPassword);
userRouter.get('/verify/user/:token', verifyUser);
userRouter.post('/change/password/user/:id', changeUserPassword);
userRouter.post('/logout', authenticate,  logoutUser);


module.exports = userRouter;