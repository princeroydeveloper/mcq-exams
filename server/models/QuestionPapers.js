const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

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
    default: 0,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  paper_id: {
    type: String,
    required: true,
    unique: true,
    default: nanoid(10)
  }
}, { collection: 'question-papers' })

const model = mongoose.model('question-papers', QuestionPaperSchema)
module.exports = model