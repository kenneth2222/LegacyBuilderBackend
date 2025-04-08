const transactionPaystackModel = require("../model/transactionPaystack");
const studySessionModel = require("../model/studySession");
const studentModel = require('../model/student');



exports.startSession = async (req, res) => {
    
    try {
    const { studentId } = req.body;
      const session = new studySessionModel({ 
        studentId, 
        startTime: new Date() });
      await session.save();

      return res.status(201).json({ 
        sessionId: session._id 
    });
    } catch (error) {
        console.log(error.message);
      res.status(500).json({ 
        message: 'Error starting session' 
    });
    }
  };



  exports.endSession = async (req, res) => {
      try {
        const { sessionId, studyTime } = req.body;
      const session = await studySessionModel.findById(sessionId);

      if (!session) 
        return res.status(404).json({ 
        message: 'Session not found' 
        });
  
      session.endTime = new Date();
      session.activeDuration = studyTime; // Save actual active study time
      await session.save();
  
      res.json({ 
        message: 'Session ended', 
        activeTime: studyTime });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ 
            error: 'Error ending session' 
        });
    }
  };


exports.getStudentWithSessions = async (studentId) => {
  try {
    const student = await studentModel.findById(studentId).populate('studySessions');

    console.log(student);
    res.status(200).json({
        message: `Student Session Fetched Successfully`,
        data: student,

    })
  } catch (error) {
    console.error('Error fetching student:', error);
  }
};

  
