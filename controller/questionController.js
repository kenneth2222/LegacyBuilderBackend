const axios = require('axios');

exports.getQuestions = async (req, res) => {
  try {
    const { year, subject } = req.params;  // Extract params from the request

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

       // Convert subjectName into an array if it's a comma-separated string
    const subjectName = subject.split(',');

    // console.log(`Fetching questions for Year: ${year}, Subject: ${subjectName}`);

    // Making the request to the external API
    const response = await axios.get(`https://questionapp-t8bu.onrender.com/questions/${year}/${subjectName}`);
    
    // Log the response status and data
    // console.log('API Response Status:', response.status);
    // console.log('API Response Data:', response.data);

    // Check if the response is successful
    if (response.status === 200) {
      return res.status(200).json(response.data);  // Send the data as response
    } else {
      throw new Error('Error fetching questions');
    }
  } catch (error) {
    console.error('Error in API call:', error.message);
    return res.status(500).json({
      success: false,
      message: `Could not fetch questions: ${error.message}`, // Include the actual error message
    });
  }
};


// exports.getQuestions = async (req, res) => {
//   try {
//     const { year, subjectName } = req.params;  // Extract params from the request

//     // Making the request to the external API
//     const response = await axios.get(`https://questionapp-t8bu.onrender.com/questions/${year}/${subjectName}`);
    
//     // Check if the response is successful
//     if (response.status === 200) {
//       return res.status(200).json(response.data);  // Send the data as response
//     } else {
//       throw new Error('Error fetching questions');
//     }
//   } catch (error) {
//     console.error('Error in API call:', error.message);
//     return res.status(500).json({
//       success: false,
//       message: 'Could not fetch questions', // Send error message as response
//     });
//   }
// };
