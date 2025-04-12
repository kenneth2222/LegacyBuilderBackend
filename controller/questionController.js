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


exports.getMockQuestions = async (req, res) => {
  try {
    const { subject } = req.params;

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: 'Subject name is required',
      });
    }

    const subjectName = subject.split(',');
    const possibleYears = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];

    let availableYears = [];

    // Step 1: Check which years have questions
    for (const year of possibleYears) {
      try {
        const response = await axios.get(`https://questionapp-t8bu.onrender.com/questions/${year}/${subjectName}`);
        if (response.status === 200 && response.data.data.question.length > 0) {
          availableYears.push(year);
        }
      } catch (err) {
        console.log(`Year ${year} skipped: ${err.message}`);
      }
    }

    if (!availableYears.length) {
      return res.status(404).json({
        success: false,
        message: 'No available years found for this subject',
      });
    }

    let selectedYears = [];
    if (availableYears.length >= 5) {
      selectedYears = availableYears.sort(() => 0.5 - Math.random()).slice(0, 5);
    } else {
      selectedYears = availableYears;
    }

    let allQuestions = [];

    for (const year of selectedYears) {
      const response = await axios.get(`https://questionapp-t8bu.onrender.com/questions/${year}/${subjectName}`);
      const rawData = response.data.data;

      const transformedData = rawData.question.map((q) => {
        const cleanQuestion = q.replace(/[\n\t\r]/g, ' ').trim();
        const [questionPart, ...optionsPart] = cleanQuestion.split(/A\.|B\.|C\.|D\./);

        const options = optionsPart.map(opt => opt.trim()).filter(opt => opt);

        return {
          question: questionPart.trim(),
          options: options,
          answer: options[2] || "Option not provided",
        };
      });

      // Pick 10 random questions from this year
      const selectedQuestions = transformedData.sort(() => 0.5 - Math.random()).slice(0, 10);

      allQuestions.push(...selectedQuestions);
    }

    // Shuffle the questions before returning the response
    allQuestions = allQuestions.sort(() => 0.5 - Math.random());

    // If total questions exceed 50, trim
    if (allQuestions.length > 50) {
      allQuestions = allQuestions.slice(0, 50);
    }

    // Number the questions properly and strip out any existing numbers
    allQuestions = allQuestions.map((q, index) => {
      const cleanedQuestion = q.question.replace(/^\d+\.\s*/, ''); // Remove any existing number at the start
      return {
        ...q,
        question: `${index + 1}. ${cleanedQuestion}`, // Adding new numbering to each question
      };
    });

    return res.status(200).json({
      success: true,
      data: allQuestions,
    });
  } catch (error) {
    console.error('Error in getMockQuestions:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

