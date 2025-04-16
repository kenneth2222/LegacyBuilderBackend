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
image: {
  public_id: {
      type: String,
      required: false
  },
  imageUrl: {
      type: String,
      required: false
  }
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

     plan: {
      type: String,
      enum: ["Freemium", "Premium", "Lifetime Access"],
      default: "Freemium",
    },

    myRating: [{
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
      },
      performance: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      duration: {
        type: Number,
        default: 0,
      },
      completed: {
        type: String,
       enum: ["yes", "no"],
       default: "no",
      },
    }],

    totalRating: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
 
     createdAt: { type: Date, default: Date.now },
   },
   { timestamps: true }
 );
 
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
