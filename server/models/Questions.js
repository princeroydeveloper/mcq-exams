const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  opt_a: {
    type: String,
    required: true
  },
  opt_b: {
    type: String,
    required: true
  },
  opt_c: {
    type: String,
    required: true
  },
  opt_d: {
    type: String,
    required: true
  },
  correct_opt: {
    type: String,
    required: true
  },
  qp_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  uid: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  marks: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
}, { collection: 'questions' })

const model = mongoose.model('questions', QuestionSchema)
module.exports = model