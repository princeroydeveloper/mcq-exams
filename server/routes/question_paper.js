const express = require('express')
const validateTeacher = require('../middlewares/validateTeacher')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const QuestionPaper = require('../models/QuestionPapers')
const Question = require('../models/Questions')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

router.post('/create', validateTeacher, [
  body('name', 'Name of question paper must contain at least 5 characters').trim().isLength({ min: 5 })
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    const qpExists = await QuestionPaper.findOne({ name: req.body.name.trim(), uid: ObjectId(req.user.uid) })
    if (!qpExists) {
      const qp = await QuestionPaper.create({
        name: req.body.name.trim(),
        uid: req.user.uid
      })
      if (qp) {
        return res.json({ success: 'Question Paper created!' })
      }
      return res.status(400).json({ error: 'Error occurred while creating your paper.' })
    }
    return res.status(400).json({ error: 'A question paper exists of the same name.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/get_all', validateTeacher, async (req, res) => {
  try {
    const qps = await QuestionPaper.find({ uid: ObjectId(req.user.uid) }).select({ questions: 0 })
    if (qps) {
      if (qps.length > 0) {
        return res.json(qps)
      }
      return res.json([])
    }
    return res.status(400).json({ error: 'Error occurred while getting all papers.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/delete', validateTeacher, [
  body('qpId', 'Request processing error...').isLength({ min: 1 })
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    const deletedQp = await QuestionPaper.findOneAndDelete({ _id: ObjectId(req.body.qpId), uid: ObjectId(req.user.uid) })
    const deletedQuestions = await Question.deleteMany({ uid: ObjectId(req.user.uid), qp_id: deletedQp._id })
    if (deletedQp && deletedQuestions) {
      return res.json({ success: 'Question paper deleted!' })
    }
    return res.status(400).json({ error: 'Error occurred while deleting paper.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/get_total_no_questions', validateTeacher, [
  body('qp_id', 'Request processing error...').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    const requiredQP = await QuestionPaper.findOne({ uid: ObjectId(req.user.uid), _id: ObjectId(req.body.qp_id) })
    if (requiredQP) {
      const all_questions_ids = await Question.find({ uid: ObjectId(req.user.uid), qp_id: ObjectId(req.body.qp_id) }).select({ _id: 1, marks: 1 })
      if (all_questions_ids) {
        return res.json({ total: all_questions_ids, paper_id: requiredQP.paper_id, duration: requiredQP.duration })
      }
      return res.status(400).json({ error: 'Cannot find question paper.' })
    }
    return res.status(400).json({ error: 'Cannot find question paper.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/set_duration', validateTeacher, [
  body('qp_id', 'Request processing error...').isLength({ min: 1 }),
  body('duration', 'Duration must be of 5 minutes (minimum)').isInt({ min: 5 })
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    let d = 0
    if (!isNaN(parseInt(req.body.duration))) {
      d = parseInt(req.body.duration)
    }
    const updatedPaper = await QuestionPaper.findOneAndUpdate({ uid: ObjectId(req.user.uid), _id: ObjectId(req.body.qp_id) }, { duration: d }, { new: true })
    if (updatedPaper) {
      return res.json({ success: 'Exam duration saved!', db_value: updatedPaper.duration })
    }
    return res.status(400).json({ error: 'Error occurred while saving exam duration.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router