const mongoose = require('mongoose')

const QuestionPaperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  uid: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  total_questions: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
}, { collection: 'question-papers' })

const model = mongoose.model('question-papers', QuestionPaperSchema)
module.exports = model