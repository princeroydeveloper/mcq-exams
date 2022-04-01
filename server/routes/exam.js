const express = require('express')
const validateStudent = require('../middlewares/validateStudent')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const QuestionPaper = require('../models/QuestionPapers')
const Question = require('../models/Questions')

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

router.post('')

module.exports = router