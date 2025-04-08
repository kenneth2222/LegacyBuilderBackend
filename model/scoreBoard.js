const mongoose = require('mongoose');

const scoreBoardSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student',
    required: true 
  },
  subject: {
    type: String,
    enum: [
      'English',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'Literature in English',
      'Economics',
      'Geography',
      'Government',
      'History'
    ],
    required: true
  },
  points: { 
    type: Number, 
    required: true,
    default: 0
  },
  result: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100,
    default: 0
  }, 
  createdAt: { type: Date, default: Date.now },
});

const ScoreBoard = mongoose.model('ScoreBoard', scoreBoardSchema);

module.exports = ScoreBoard;
