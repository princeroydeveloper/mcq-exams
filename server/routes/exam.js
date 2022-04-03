const express = require('express')
const validateStudent = require('../middlewares/validateStudent')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const QuestionPaper = require('../models/QuestionPapers')
const Question = require('../models/Questions')
const Answer = require('../models/Answers')
const differenceInMinutes = require('date-fns/differenceInMinutes')

router.post('/check', validateStudent, [
  body('qp_id', 'Please enter question paper Id').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    const qp = await QuestionPaper.findOne({ paper_id: req.body.qp_id })
    if (qp) {
      if (qp.total_questions > 0) {
        return res.json({ success: true })
      }
      return res.status(400).json({ error: 'Your teacher has not added any questions yet. Try again later.' })
    }
    return res.status(400).json({ error: 'Question paper not found!' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/join', validateStudent, [
  body('qp_id', 'Please enter question paper Id').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    const requiredQP = await QuestionPaper.findOne({ paper_id: req.body.qp_id })
    if (requiredQP) {
      if (requiredQP.total_questions > 0) {
        const alreadyAttempted = await Answer.findOne({ paper_id: requiredQP.paper_id, studentId: req.user.uid })
        if (!alreadyAttempted) {
          const questionsToSend = await Question.find({ qp_id: requiredQP._id }).select({ correct_opt: 0, uid: 0 })
          if (questionsToSend) {
            const addAnswerRecord = await Answer.create({
              studentId: req.user.uid,
              studentName: `${req.user.fname} ${req.user.lname}`,
              studentEmail: `${req.user.email}`,
              paper_id: requiredQP.paper_id
            })
            if (addAnswerRecord) {
              return res.json(questionsToSend)
            }
            return res.status(400).json({ error: 'Error occurred while joining exam.' })
          }
          return res.status(400).json({ error: 'Error occurred while joining exam.' })
        }
        return res.status(400).json({ error: 'You have already joined the exam.' })
      }
      return res.status(400).json({ error: 'Your teacher has not added any questions yet. Try again later.' })
    }
    return res.status(400).json({ error: 'Question paper not found!' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

// router.post('/submit', validateStudent, [

// ], async (req, res) => {

// })

module.exports = router