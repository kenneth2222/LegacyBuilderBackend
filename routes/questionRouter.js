const questionRouter = require("express").Router();
const {getQuestions} = require("../controller/questionController");


/**
 * @swagger
 * /api/v1/fetch-questions/{year}/{subject}:
 *   get:
 *     summary: Fetch questions by year and subject
 *     tags: [Questions]
 *     description: Retrieves questions for a specific year and subject from the external API.
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: The year for which questions are to be fetched (e.g., 2015)
 *       - in: path
 *         name: subject
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject name (e.g., Biology). 
 *     responses:
 *       200:
 *         description: Questions retrieved successfully
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
 *                       question:
 *                         type: string
 *                         example: "What is photosynthesis?"
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Option A", "Option B", "Option C", "Option D"]
 *                       answer:
 *                         type: string
 *                         example: "Option C"
 *       400:
 *         description: Bad request, missing parameters
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
 *                   example: Subject name is required
 *       500:
 *         description: Internal server error
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
 *                   example: "Could not fetch questions: Error message"
 */

questionRouter.get('/fetch-questions/:year/:subject', getQuestions);

module.exports = questionRouter
