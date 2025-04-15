const questionRouter = require("express").Router();
const {getQuestions, getMockQuestions} = require("../controller/questionController");


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
 *         description: The year for which questions are to be fetched (e.g., 2002)
 *       - in: path
 *         name: subject
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject name (e.g., Biology)
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
 *                         example: What is the function of chlorophyll in photosynthesis?
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["To absorb light", "To release energy", "To produce oxygen", "To conduct heat"]
 *                       answer:
 *                         type: string
 *                         example: To absorb light
 *                       subheading:
 *                         type: string
 *                         nullable: true
 *                         example: Use the diagram below to answer questions 1 and 2
 *                 totalQuestions:
 *                   type: integer
 *                   example: 50
 *                 year:
 *                   type: integer
 *                   example: 2015
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
 *                   example: Subject and year are required
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
 *                   example: "Could not fetch questions: External API error or invalid format"
 */


questionRouter.get('/fetch-questions/:year/:subject', getQuestions);

/**
 * @swagger
 * /api/v1/mock-questions/{subject}:
 *   get:
 *     summary: Fetch mock questions for a subject
 *     tags: [Questions]
 *     description: >
 *       Retrieves a set of mock questions for a specific subject.
 *       It randomly selects up to 5 available years (if fewer than 5, it uses all available years),
 *       and fetches 10 questions from each year to make up a total of 50 questions.
 *       If there is only one year available, it fetches 50 questions from that year.
 *     parameters:
 *       - in: path
 *         name: subject
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject name (e.g., Biology).
 *     responses:
 *       200:
 *         description: Mock questions retrieved successfully
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
 *       404:
 *         description: No available years found for the subject
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
 *                   example: No available years found for this subject
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
 *                   example: Internal server error
 */

questionRouter.get('/mock-questions/:subject', getMockQuestions);

module.exports = questionRouter

