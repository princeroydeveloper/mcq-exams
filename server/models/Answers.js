const mongoose = require('mongoose')

const AnswerSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  paper_id: {
    type: String,
    required: true
  },
  ticked: {
    type: Array,
    default: [],
    required: true
  },
  joinTimestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  submitTimestamp: {
    type: Date
  }
}, { collection: 'answers' })

const model = mongoose.model('answers', AnswerSchema)
module.exports = model