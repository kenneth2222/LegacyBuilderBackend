const questionRouter = require("express").Router();
const {getQuestions} = require("../controller/questionController");

questionRouter.get('/fetch-questions/:year/:subject', getQuestions);

module.exports = questionRouter
// app.get('/fetch-questions/:year/:subject', async (req, res) => {
//     const { year, subject } = req.params;
    
//     try {
//       const questions = await getQuestions(year, subject);
//       res.status(200).json({
//         message: 'Questions fetched successfully',
//         data: questions
//       });
//     } catch (error) {
//       res.status(500).json({
//         message: 'Error fetching questions',
//         error: error.message
//       });
//     }
//   });