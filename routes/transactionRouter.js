const transactionKoraRouter = require("express").Router();
const {initializePaymentKora, verifyPaymentKora, initialPaymentPaystack, verifyPaymentPaystack} = require("../controller/transactionController");


/**
 * @swagger
 * /api/v1/initializeKoraPay/{studentId}:
 *   post:
 *     summary: Initialize Kora Payment for a student
 *     tags: [Kora Payment]
 *     description: Initiates a payment using the Kora API, stores transaction details, and redirects to a predefined frontend URL with query parameters.
 *     parameters:
 *       - name: studentId
 *         in: path
 *         required: true
 *         description: ID of the student making the payment
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - email
 *               - name
 *               - plan
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *                 description: Amount to be paid (in NGN)
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *                 description: Customer's email address
 *               name:
 *                 type: string
 *                 example: John Doe
 *                 description: Customer's full name
 *               plan:
 *                 type: string
 *                 enum: [Freemium, Premium, Lifetime Access Model]
 *                 example: Premium
 *                 description: The plan the user is subscribing to
 *     responses:
 *       302:
 *         description: Redirects to frontend with reference, checkout URL, and studentId
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             description: The URL to which the client is redirected
 *             example: https://legacy-builder.vercel.app/payment-status?reference=TCA-AF-ABC123&checkout_url=https%3A%2F%2Fcheckout.korapay.com%2Fabc123&studentId=60c72b2f9b1d8b4b9e6b8d8e
 *       400:
 *         description: Missing required fields or student ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields are required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to initialize payment
 */



transactionKoraRouter.post("/initializeKoraPay/:studentId", initializePaymentKora);

/**
 * @swagger
 * /api/v1/verifyKoraPay:
 *   get:
 *     summary: Verify Kora Payment
 *     tags: [Kora Payment]
 *     description: Verifies the status of a Kora payment transaction using the provided reference. After verification, updates the student's plan and redirects to a frontend URL (manually set in the server).
 *     parameters:
 *       - in: query
 *         name: reference
 *         schema:
 *           type: string
 *         required: true
 *         description: The reference ID of the transaction to verify.
 *     responses:
 *       302:
 *         description: Redirects to frontend with payment status and student ID
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             description: URL to which the user is redirected
 *             example: https://legacy-builder.vercel.app/payment-status?status=success&reference=ref_abc123&studentId=60c72b2f9b1d8b4b9e6b8d8e
 *       400:
 *         description: Missing reference in the query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reference is required
 *       404:
 *         description: Transaction or Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error: Something went wrong"
 */

transactionKoraRouter.get("/verifyKoraPay", verifyPaymentKora);

// /**
//  * @swagger
//  * /api/v1/initializePaystack:
//  *   post:
//  *     summary: Initialize Paystack Payment
//  *     tags: [Paystack Payment]
//  *     description: Initializes a payment transaction using Paystack.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - email
//  *               - amount
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 example: user@example.com
//  *               amount:
//  *                 type: number
//  *                 example: 5000
//  *     responses:
//  *       200:
//  *         description: Payment initialized successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Payment initialized successfully
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     authorization_url:
//  *                       type: string
//  *                       example: https://checkout.paystack.com/abc123xyz
//  *                     reference:
//  *                       type: string
//  *                       example: ref_abc123xyz
//  *       400:
//  *         description: Missing required fields.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: All fields are required
//  *       500:
//  *         description: Server error during payment initialization.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Initializing payment failed: Error message"
//  */

transactionKoraRouter.post("/initializePaystack", initialPaymentPaystack);

// /**
//  * @swagger
//  * /api/v1/verifyPaystack:
//  *   get:
//  *     summary: Verify Paystack Payment
//  *     tags: [Paystack Payment]
//  *     description: Verifies the status of a Paystack payment using the transaction reference.
//  *     parameters:
//  *       - in: query
//  *         name: reference
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Transaction reference to verify
//  *         example: ref_abc123xyz
//  *     responses:
//  *       200:
//  *         description: Payment verification successful.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Payment Verification Successfully
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     _id:
//  *                       type: string
//  *                       example: 607c35cfcf1b2c001c8e4d7b
//  *                     email:
//  *                       type: string
//  *                       example: user@example.com
//  *                     amount:
//  *                       type: number
//  *                       example: 5000
//  *                     reference:
//  *                       type: string
//  *                       example: ref_abc123xyz
//  *                     status:
//  *                       type: string
//  *                       example: Success
//  *                     paymentDate:
//  *                       type: string
//  *                       example: 2025-04-08
//  *       400:
//  *         description: Payment verification failed.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Payment Verification Failed
//  *                 data:
//  *                   type: object
//  *                   example: null
//  *       500:
//  *         description: Server error during payment verification.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Internal Server Error: Something went wrong"
//  */

transactionKoraRouter.get("/verifyPaystack", verifyPaymentPaystack);


module.exports = transactionKoraRouter;