

const studySessionSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    },
    startTime: { 
        type: Date, 
        required: true 
    },
    endTime: { 
        type: Date 
    },
    activeDuration: { 
        type: Number, 
        default: 0 } // Time spent actively studying in seconds
  }, {
    timestamps: true});

    const studySessionModel = mongoose.model("studySession", studySessionSchema);
    
    module.exports = studySessionModel;
  