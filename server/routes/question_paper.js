const express = require('express')
const validateTeacher = require('../middlewares/validateTeacher')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const QuestionPaper = require('../models/QuestionPapers')
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
    const qps = await QuestionPaper.find({ uid: ObjectId(req.user.uid) })
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
    const deleltedQp = await QuestionPaper.findOneAndDelete({ _id: ObjectId(req.body.qpId), uid: ObjectId(req.user.uid) })
    if (deleltedQp) {
      return res.json({ success: 'Question paper deleted!' })
    }
    return res.status(400).json({ error: 'Error occurred while deleting paper.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router