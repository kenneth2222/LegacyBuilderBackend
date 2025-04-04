const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { 
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
  enrolledSubjects: [{ 
    type: String 
}], 
  studySessions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StudySession' 
}], // Link to study sessions
  createdAt: { type: Date, default: Date.now },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
