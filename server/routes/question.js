const express = require('express')
const validateTeacher = require('../middlewares/validateTeacher')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const Question = require('../models/Questions')
const QuestionPaper = require('../models/QuestionPapers')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

router.post('/save', validateTeacher, [
  body('question', 'Please enter your question').trim().isLength({ min: 1 }),
  body('opt_a', 'Please enter option A').trim().isLength({ min: 1 }),
  body('opt_b', 'Please enter option B').trim().isLength({ min: 1 }),
  body('opt_c', 'Please enter option C').trim().isLength({ min: 1 }),
  body('opt_d', 'Please enter option D').trim().isLength({ min: 1 }),
  body('correct_opt', 'Please choose correct option').trim().isLength({ min: 1 }),
  body('marks', 'Please enter marks of the question').trim().isLength({ min: 1 }),
  body('qp_id', 'Request processing error...').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    const requiredQp = await QuestionPaper.findOne({ uid: ObjectId(req.user.uid), _id: ObjectId(req.body.qp_id) })
    if (requiredQp) {
      // Save Question to database
      if (req.body.question_id !== '') {
        const updatedQuestion = await Question.findOneAndUpdate({ uid: ObjectId(req.user.uid), _id: ObjectId(req.body.question_id), qp_id: ObjectId(req.body.qp_id) }, {
          question: req.body.question.trim(),
          opt_a: req.body.opt_a.trim(),
          opt_b: req.body.opt_b.trim(),
          opt_c: req.body.opt_c.trim(),
          opt_d: req.body.opt_d.trim(),
          correct_opt: req.body.correct_opt.trim(),
          marks: parseFloat(req.body.marks.trim())
        })
        const all_questions_ids = await Question.find({ uid: ObjectId(req.user.uid), qp_id: ObjectId(req.body.qp_id) }).select({ _id: 1 })
        if (updatedQuestion) {
          return res.json({ success: 'Question saved!', total: all_questions_ids, question_id: updatedQuestion._id })
        }
        return res.status(400).json({ error: 'Error occurred while saving question.' })
      }
      const newQuestion = await Question.create({
        question: req.body.question.trim(),
        opt_a: req.body.opt_a.trim(),
        opt_b: req.body.opt_b.trim(),
        opt_c: req.body.opt_c.trim(),
        opt_d: req.body.opt_d.trim(),
        correct_opt: req.body.correct_opt.trim(),
        marks: parseFloat(req.body.marks.trim()),
        uid: req.user.uid,
        qp_id: req.body.qp_id.trim()
      })
      if (newQuestion) {
        await QuestionPaper.findOneAndUpdate({ uid: ObjectId(req.user.uid), _id: ObjectId(req.body.qp_id) }, { $inc: { total_questions: 1 } }, { new: true })
        const all_questions_ids = await Question.find({ uid: ObjectId(req.user.uid), qp_id: ObjectId(req.body.qp_id) }).select({ _id: 1 })
        return res.json({ success: 'Question saved!', total: all_questions_ids, question_id: newQuestion._id })
      }
      return res.status(400).json({ error: 'Error occurred while saving question.' })
    }
    return res.status(400).json({ error: 'Cannot find question paper.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/get', validateTeacher, [
  body('qp_id', 'Request processing error...').trim().isLength({ min: 1 }),
  body('question_id', 'Request processing error...').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    const q = await Question.findOne({ uid: ObjectId(req.user.uid), qp_id: ObjectId(req.body.qp_id), _id: ObjectId(req.body.question_id) })
    if (q) {
      return res.json({ data: q })
    }
    return res.status(400).json({ error: 'Error occurred. Cannot find question.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

// router.post('/delete', validateTeacher, [
//   body('qp_id', 'Request processing error...').trim().isLength({ min: 1 })
// ], async (req, res) => {
//   try {
//     // Finds error in validation and return bad request
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() })
//     }
//     // Proceed further
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: 'Internal Server Error' })
//   }
// })

module.exports = router