const jwt = require('jsonwebtoken');
const {registerAdmin, registerUser, verifyUser, loginUser, forgotUserPassword,
   resetUserPassword, changeUserPassword,logoutUser } = require('../controller/userController');

const { authenticate, adminAuth} = require('../middleware/authentication');
const passport = require("passport");
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


/**
 * @swagger
 * /user/login/:
 *   post:
 *     summary: User Login
 *     description: Authenticates a user and returns a JWT token upon successful login.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The unique username of the user
 *                 example: "akunwanne_kenneth"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *                 example: "StrongP@ssword123"
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

userRouter.post('/user/login/', loginUser);

/**
 * @swagger
 * /forgot_password/user:
 *   post:
 *     summary: Request a password reset link
 *     description: Sends a password reset link to the user's registered email.
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
 *                 description: Registered email address of the user
 *                 example: "aiengineer@gmail.com"
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

userRouter.post('/forgot_password/user', forgotUserPassword);

/**
 * @swagger
 * /reset_password/user/{token}:
 *   post:
 *     summary: Reset a user's password
 *     description: Allows users to reset their password using a valid token.
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
 *                 description: The new password for the user
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
 *         description: Not Found - Token or User Not Found
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

userRouter.post('/reset_password/user/:token', resetUserPassword);

/**
 * @swagger
 * /verify/user/{token}:
 *   get:
 *     summary: Verify user account
 *     description: Verifies a user's account using a provided token. If the token is valid, the user's account is marked as verified. If expired, a new verification link is sent.
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
 *         description: Not Found - Token or user not found
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
 *                   example: "Error verifying user"
 */
userRouter.get('/verify/user/:token', verifyUser);

/**
 * @swagger
 * /change/password/user/{id}:
 *   post:
 *     summary: Change User Password
 *     description: Allows an authenticated user to update their password.
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
 *         description: The ID of the user whose password is being changed.
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
 *                 description: The user's current password.
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Changing Password"
 */

userRouter.post('/change/password/user/:id', changeUserPassword);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout a user
 *     description: Logs out an authenticated user by updating their login status.
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
 *         description: Bad Request - User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
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

userRouter.post('/logout', authenticate,  logoutUser);

/**
 * @swagger
 * /googleAuthenticate:
 *   get:
 *     summary: Authenticate a user with Google
 *     description: Redirects the user to Google for authentication using OAuth.
 *     tags:
 *       - Google Authentication 
 *     security: [] # No authentication needed before redirecting to Google
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

userRouter.get("/googleAuthenticate", passport.authenticate("google", { scope: ["profile", "email"] }));



/**
 * @swagger
 * /auth/google/login:
 *   get:
 *     summary: Login a user using Google OAuth
 *     description: Authenticates a user via Google and returns a JWT token upon successful login.
 *     tags:
 *       - Google Authentication
 *     security: [] # No Authentication Required
 *     responses:
 *       200:
 *         description: Google authentication successful, JWT token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "GoogleAuth Login Successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: "605c72b1f1a3c619946b57da"
 *                     fullName:
 *                       type: string
 *                       description: User's full name
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: User's email address
 *                       example: "johndoe@example.com"
 *                     username:
 *                       type: string
 *                       description: Unique username
 *                       example: "johndoe123"
 *                     isVerified:
 *                       type: boolean
 *                       description: Whether the user's email is verified
 *                       example: true
 *                     roles:
 *                       type: string
 *                       enum: ["admin", "user"]
 *                       description: User role
 *                       example: "user"
 *                     isLoggedIn:
 *                       type: boolean
 *                       description: Indicates if the user is currently logged in
 *                       example: true
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad Request - Google authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Google authentication failed"
 *       401:
 *         description: Unauthorized - Token not provided or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied, token must be provided"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

userRouter.get("/auth/google/login", passport.authenticate("google",  { failureRedirect: "/login" }), async(req, res) => {
    try {
    const token = await jwt.sign({ userId: req.user._id, isVerified: req.user.isVerified}, process.env.JWT_SECRET, {expiresIn: "1d"});
    res.status(200).json({
        message: "GoogleAuth Login Successful",
        data: req.user,
        token
    });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
}
});


/**
 * @swagger
 * /facebookAuthenticate:
 *   get:
 *     summary: Authenticate a user with Facebook
 *     description: Redirects the user to Facebook for authentication using OAuth.
 *     tags:
 *       - Facebook Authentication 
 *     security: [] # No authentication needed before redirecting to Facebook
 *     responses:
 *       302:
 *         description: Redirects to Facebook for authentication
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
userRouter.get("/facebookAuthenticate", passport.authenticate("facebook", { scope: ["email"] }));


/**
 * @swagger
 * /auth/facebook/login:
 *   get:
 *     summary: Login a user using Facebook OAuth
 *     description: Authenticates a user via Facebook and returns a JWT token upon successful login.
 *     tags:
 *       - Facebook Authentication
 *     security: [] # No Authentication Required
 *     responses:
 *       200:
 *         description: Facebook authentication successful, JWT token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "FacebookAuth Login Successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: "605c72b1f1a3c619946b57da"
 *                     fullName:
 *                       type: string
 *                       description: User's full name
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: User's email address
 *                       example: "johndoe@example.com"
 *                     username:
 *                       type: string
 *                       description: Unique username
 *                       example: "johndoe123"
 *                     isVerified:
 *                       type: boolean
 *                       description: Whether the user's email is verified
 *                       example: true
 *                     roles:
 *                       type: string
 *                       enum: ["admin", "user"]
 *                       description: User role
 *                       example: "user"
 *                     isLoggedIn:
 *                       type: boolean
 *                       description: Indicates if the user is currently logged in
 *                       example: true
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad Request - Facebook authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Facebook authentication failed"
 *       401:
 *         description: Unauthorized - Token not provided or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied, token must be provided"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

userRouter.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }),
    async (req, res) => {
      const token = await jwt.sign(
        { userId: req.user._id, isVerified: req.user.isVerified },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        message: "Facebook Login Successful",
        data: req.user,
        token,
      });
    }
  );




module.exports = userRouter;