const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
},
  email: { 
    type: String, 
    required: true, 
    unique: true 
},
  password: { 
    type: String, 
    required: true 
}, 
enrolledSubjects: {
  type: [String],
  enum: ['English',
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
  default: ['Mathematics', 'English'],
},
 isVerified: {
       type: Boolean,
       default: false,
     },
 
     roles: {
       type: String,
       enum: ["admin", "user"],
       default: "user",
     },
 
     isLoggedIn: {
       type: Boolean,
       default: false,
     },
 
    studySessions: [{ 
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'StudySession' 
     }],
     leadershipBoard: [{ 
       type: mongoose.Schema.Types.ObjectId, 
       ref: 'LeadershipBoard' 
     }],
 
     createdAt: { type: Date, default: Date.now },
   },
   { timestamps: true }
 );
 
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
