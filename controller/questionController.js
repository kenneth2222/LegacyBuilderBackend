const axios = require('axios');

// exports.getQuestions = async (req, res) => {
//   try {

//     const { year, subject } = req.params;  

//     if (!subject) {
//         return res.status(400).json({
//           success: false,
//           message: 'Subject name is required',
//         });
//       }

//     if (!year) {
//         return res.status(400).json({
//           success: false,
//           message: 'Year is required',
//         });
//       }

//        // Convert subjectName into an array if it's a comma-separated string
//     const subjectName = subject.split(',');

//     const response = await axios.get(`https://questionapp-t8bu.onrender.com/questions/${year}/${subjectName}`);
    
//     if (response.status === 200) {
//       return res.status(200).json(response.data);  
//     } else {
//       throw new Error('Error fetching questions');
//     }
//   } catch (error) {
//     console.error('Error in API call:', error.message);
//     return res.status(500).json({
//       success: false,
//       message: `Could not fetch questions: ${error.message}`,
//     });
//   }
// };

exports.getQuestions = async (req, res) => {
  try {
    const { year, subject } = req.params;

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: 'Subject name is required',
      });
    }

    if (!year) {
      return res.status(400).json({
        success: false,
        message: 'Year is required',
      });
    }

    const subjectName = subject.split(',');

    const response = await axios.get(`https://questionapp-t8bu.onrender.com/questions/${year}/${subjectName}`);

    if (response.status === 200) {
      const rawData = response.data.data;

      // Transform the data
      const transformedData = rawData.question.map((q) => {
        // Clean the question string
        const cleanQuestion = q.replace(/[\n\t\r]/g, ' ').trim();

        // Split the question and options
        const [questionPart, ...optionsPart] = cleanQuestion.split(/A\.|B\.|C\.|D\./);

        const options = optionsPart.map(opt => opt.trim()).filter(opt => opt);

        return {
          question: questionPart.trim(),
          options: options,
          answer: options[2] || "Option not provided" // you can improve this!
        };
      });

      return res.status(200).json({
        success: true,
        data: transformedData,
      });
    } else {
      throw new Error('Error fetching questions');
    }
  } catch (error) {
    console.error('Error in API call:', error.message);
    return res.status(500).json({
      success: false,
      message: `Could not fetch questions: ${error.message}`,
    });
  }
};


// exports.getMockQuestions = async (req, res) => {
//   try {
//     const {subject} = req.params;

//     if (!subject) {
//       return res.status(400).json({
//         success: false,
//         message: 'Subject name is required',
//       });
//     }




