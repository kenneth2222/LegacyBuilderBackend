const transactionKoraRouter = require("express").Router();
const {initializePaymentKora, verifyPaymentKora, initialPaymentPaystack, verifyPaymentPaystack} = require("../controller/transactionController");


/**
 * @swagger
 * /api/v1/initializeKoraPay:
 *   post:
 *     summary: Initialize Kora Payment
 *     tags: [Kora Payment]
 *     description: Initiates a payment using the Kora API, validates user input, and stores the transaction. Returns the checkout and redirect URLs.
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
 *                 enum: [Freemium, Premium, Lifetime Access]
 *                 example: Premium
 *                 description: Plan the student is subscribing to
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: LB-C5-ABC123XYZ789
 *                       description: Unique payment reference
 *                     checkout_url:
 *                       type: string
 *                       example: https://checkout.korapay.com/abc123
 *                       description: Kora checkout URL
 *                     redirect_url:
 *                       type: string
 *                       example: https://legacy-builder.vercel.app/verifyingPayment/LB-C5-ABC123XYZ789
 *                       description: Frontend redirect URL for verifying the payment
 *       400:
 *         description: Missing required fields
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


transactionKoraRouter.post("/initializeKoraPay", initializePaymentKora);


/**
 * @swagger
 * /api/v1/verifyKoraPay:
 *   get:
 *     summary: Verify Kora Payment
 *     tags: [Kora Payment]
 *     description: |
 *       Verifies the status of a Kora payment transaction using the provided reference. If the payment is successful, it updates the payment status and the student's plan.
 *     parameters:
 *       - in: query
 *         name: reference
 *         schema:
 *           type: string
 *         required: true
 *         description: The reference ID of the transaction to verify.
 *     responses:
 *       200:
 *         description: Payment verified successfully and student plan updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment verification successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: John Doe
 *                         email:
 *                           type: string
 *                           example: johndoe@example.com
 *                         amount:
 *                           type: number
 *                           example: 5000
 *                         reference:
 *                           type: string
 *                           example: LB-C5-ABC123XYZ789
 *                         plan:
 *                           type: string
 *                           example: Premium
 *                         status:
 *                           type: string
 *                           example: Success
 *                     student:
 *                       type: object
 *                       properties:
 *                         fullName:
 *                           type: string
 *                           example: John Doe
 *                         email:
 *                           type: string
 *                           example: johndoe@example.com
 *                         plan:
 *                           type: string
 *                           example: Premium
 *       400:
 *         description: Payment verification failed or no data returned from Kora
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment verification failed
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       type: object
 *                       properties:
 *                         reference:
 *                           type: string
 *                           example: LB-C5-ABC123XYZ789
 *                         status:
 *                           type: string
 *                           example: Failed
 *       404:
 *         description: Payment or Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error: <error details"
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