const axios = require('axios');



exports.getQuestions = async (req, res) => {
  try {
    const { year, subject } = req.params;

    if (!subject || !year) {
      return res.status(400).json({
        success: false,
        message: 'Subject and year are required',
      });
    }

    const subjectName = subject.split(',');

    const response = await axios.get(`https://questionapp-t8bu.onrender.com/questions/${year}/${subjectName}`);

    if (response.status === 200) {
      const rawData = response.data.data;
      // console.log('Full API response:', rawData);
      const doc = Array.isArray(rawData) ? rawData[0] : rawData;

      if (!doc || !Array.isArray(doc.questions)) {
        return res.status(500).json({
          success: false,
          message: 'Invalid data format from external API',
        });
      }

      const transformedData = doc.questions.map((q) => ({
        subheading: q.subheading || null,
        question: q.question,
        options: q.options,
        answer: q.answer || "Answer not provided",
      }));

      return res.status(200).json({
        success: true,
        data: transformedData,
        totalQuestions: transformedData.length,
        year: doc.year, 
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
    const possibleYears = [2002, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
    let availableYears = [];

    for (const year of possibleYears) {
      try {
        const response = await axios.get(`https://questionapp-t8bu.onrender.com/questions/${year}/${subjectName}`);
        const rawData = response.data.data;
        const doc = Array.isArray(rawData) ? rawData[0] : rawData;

        if (doc && Array.isArray(doc.questions) && doc.questions.length > 0) {
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

    let selectedYears = availableYears.length >= 5
      ? availableYears.sort(() => 0.5 - Math.random()).slice(0, 5)
      : availableYears;

    let allQuestions = [];

    for (const year of selectedYears) {
      const response = await axios.get(`https://questionapp-t8bu.onrender.com/questions/${year}/${subjectName}`);
      const rawData = response.data.data;
      const doc = Array.isArray(rawData) ? rawData[0] : rawData;

      if (!doc || !Array.isArray(doc.questions)) continue;

      const transformedData = doc.questions.map((q) => ({
        question: q.question.replace(/^\d+\.\s*/, '').trim(),
        options: q.options,
        answer: q.answer || "Answer not provided",
        subheading: q.subheading || null,
      }));

      // Pick 10 random questions from this year
      const selectedQuestions = transformedData.sort(() => 0.5 - Math.random()).slice(0, 10);
      allQuestions.push(...selectedQuestions);
    }

    // Shuffle all questions
    allQuestions = allQuestions.sort(() => 0.5 - Math.random());

    // Limit to 50 and re-number
    allQuestions = allQuestions.slice(0, 50).map((q, index) => ({
      ...q,
      question: `${index + 1}. ${q.question}`,
    }));

    return res.status(200).json({
      success: true,
      data: allQuestions,
      totalQuestions: allQuestions.length,
      years: selectedYears
    });
  } catch (error) {
    console.error('Error in getMockQuestions:', error.message);
    return res.status(500).json({
      success: false,
      message: `Could not fetch mock questions: ${error.message}`,
    });
  }
};





// exports.getMockQuestions = async (req, res) => {
//   try {
//     const { subject } = req.params;

//     if (!subject) {
//       return res.status(400).json({
//         success: false,
//         message: 'Subject name is required',
//       });
//     }

//     const subjectName = subject.split(',');
//     const possibleYears = [2002, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];

//     let availableYears = [];

    
//     for (const year of possibleYears) {
//       try {
//         const response = await axios.get(`https://questionapp-t8bu.onrender.com/questions/${year}/${subjectName}`);
//         if (response.status === 200 && response.data.data.question.length > 0) {
//           availableYears.push(year);
//         }
//       } catch (err) {
//         console.log(`Year ${year} skipped: ${err.message}`);
//       }
//     }

//     if (!availableYears.length) {
//       return res.status(404).json({
//         success: false,
//         message: 'No available years found for this subject',
//       });
//     }

//     let selectedYears = [];
//     if (availableYears.length >= 5) {
//       selectedYears = availableYears.sort(() => 0.5 - Math.random()).slice(0, 5);
//     } else {
//       selectedYears = availableYears;
//     }

//     let allQuestions = [];

//     for (const year of selectedYears) {
//       const response = await axios.get(`https://questionapp-t8bu.onrender.com/questions/${year}/${subjectName}`);
//       const rawData = response.data.data;

//       const transformedData = rawData.question.map((q) => {
//         const cleanQuestion = q.replace(/[\n\t\r]/g, ' ').trim();
//         const [questionPart, ...optionsPart] = cleanQuestion.split(/A\.|B\.|C\.|D\./);

//         const options = optionsPart.map(opt => opt.trim()).filter(opt => opt);

//         return {
//           question: questionPart.trim(),
//           options: options,
//           answer: options[2] || "Option not provided",
//         };
//       });

//       // Pick 10 random questions from this year
//       const selectedQuestions = transformedData.sort(() => 0.5 - Math.random()).slice(0, 10);

//       allQuestions.push(...selectedQuestions);
//     }

    
//     allQuestions = allQuestions.sort(() => 0.5 - Math.random());

    
//     if (allQuestions.length > 50) {
//       allQuestions = allQuestions.slice(0, 50);
//     }

//     // Number the questions properly and strip out any existing numbers
//     allQuestions = allQuestions.map((q, index) => {
//       const cleanedQuestion = q.question.replace(/^\d+\.\s*/, ''); // Remove any existing number at the start
//       return {
//         ...q,
//         question: `${index + 1}. ${cleanedQuestion}`, // Adding new numbering to each question
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       data: allQuestions,
//     });
//   } catch (error) {
//     console.error('Error in getMockQuestions:', error.message);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

