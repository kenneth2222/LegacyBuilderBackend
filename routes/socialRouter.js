const jwt = require('jsonwebtoken');

const passport = require("passport");
const socialRouter = require('express').Router();




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

socialRouter.get("/googleAuthenticate", passport.authenticate("google", { scope: ["profile", "email"] }));



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

socialRouter.get("/auth/google/login", passport.authenticate("google",  { failureRedirect: "/login" }), async(req, res) => {
    try {
    const token = await jwt.sign({ userId: req.user._id, isVerified: req.user.isVerified}, process.env.JWT_SECRET, {expiresIn: "1d"});
    res.status(200).json({
        message: "GoogleAuth Login Successful",
        data: req.user,
        token
    });
} catch (error) {
    console.error(error);
    res.status(500).json({ 
        message: "Internal Server Error" 
    });
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
socialRouter.get("/facebookAuthenticate", passport.authenticate("facebook", { scope: ["email"] }));


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

socialRouter.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }),
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

  module.exports = socialRouter;