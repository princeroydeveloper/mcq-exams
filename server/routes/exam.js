const express = require('express')
const validateStudent = require('../middlewares/validateStudent')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const QuestionPaper = require('../models/QuestionPapers')
const Question = require('../models/Questions')
const Answer = require('../models/Answers')
const differenceInMinutes = require('date-fns/differenceInMinutes')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

function giveOptionName(code_name) {
  if (code_name === 'opt_a') {
    return 'Option A'
  }
  if (code_name === 'opt_b') {
    return 'Option B'
  }
  if (code_name === 'opt_c') {
    return 'Option C'
  }
  if (code_name === 'opt_d') {
    return 'Option D'
  }
}

function giveQuestion(correct_opt, question, question_opt) {
  if (correct_opt === question_opt) {
    return `${question} (CORRECT)`
  }
  return question
}

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
              return res.json({ questions: questionsToSend, duration: requiredQP.duration })
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

router.post('/submit', validateStudent, [
  body('qp_id', 'Request processing error...').isLength({ min: 1 }),
  body('answers', 'Request processing error...').isArray()
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
      const requiredAnswer = await Answer.findOne({ studentId: ObjectId(req.user.uid), paper_id: req.body.qp_id })
      if (requiredAnswer && (requiredAnswer.ticked.length === 0)) {
        const duration = requiredQP.duration + 1
        const differenceTime = differenceInMinutes(new Date(requiredAnswer.joinTimestamp), new Date()).toString()
        const actualDifferenceTime = (differenceTime === "0") ? 0 : parseInt(differenceTime.split("-")[1])
        if (actualDifferenceTime <= duration) {
          requiredAnswer.ticked = req.body.answers
          requiredAnswer.submitTimestamp = new Date()
          await requiredAnswer.save()
          return res.json({ success: 'Thank you! Your answers have been recorded.' })
        }
        requiredAnswer.ticked[0] = 'time_expired'
        await requiredAnswer.save()
        return res.status(400).json({ error: 'You are too late to submit your answers. Your answers have been declined.' })
      }
      if (requiredAnswer.ticked.length > 0 && requiredAnswer.ticked[0] !== 'time_expired') {
        return res.status(400).json({ error: 'You have already submitted your answers.' })
      }
      return res.status(400).json({ error: 'Error occurred while submitting answers or Time expired.' })
    }
    return res.status(400).json({ error: 'Cannot find question paper.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/get_attempted_exams', validateStudent, async (req, res) => {
  try {
    const exams = await Answer.find({ studentId: ObjectId(req.user.uid) })
    if (exams) {
      let newExamArr = []
      exams.forEach(exam => {
        let state = ''
        if (exam.submitTimestamp) {
          state = 'Answers were submitted successfully.'
        } else if (exam.ticked[0] === 'time_expired' && exam.submitTimestamp) {
          state = 'Answers were declined due to time factor.'
        } else if (!exam.submitTimestamp) {
          state = 'Not submitted answers yet.'
        }
        newExamArr.push({ paperId: exam.paper_id, state })
      })
      return res.json(newExamArr)
    }
    return res.status(400).json({ error: 'Error occurred while getting attempted exams.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/get_score', validateStudent, [
  body('qp_id', 'Request processing error...').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    const exam = await Answer.findOne({ studentId: ObjectId(req.user.uid), paper_id: req.body.qp_id }).select({ ticked: 1, submitTimestamp: 1 })
    if (exam) {
      let state = ''
      if (exam.submitTimestamp) {
        state = 'Answers were submitted successfully.'
      } else if (exam.ticked[0] === 'time_expired' && exam.submitTimestamp) {
        return res.status(400).json({ error: 'Answers were declined due to time factor.' })
      } else if (!exam.submitTimestamp) {
        return res.status(400).json({ error: 'Not submitted answers yet.' })
      }
      const requiredQP = await QuestionPaper.findOne({ paper_id: req.body.qp_id })
      if (requiredQP) {
        const questions = await Question.find({ qp_id: ObjectId(requiredQP._id) }).select({ qp_id: 0, uid: 0, timestamp: 0 })
        if (questions) {
          let newArr = []
          let total_score = 0
          let out_of = 0
          questions.forEach(q => {
            const filteredAnswerArr = exam.ticked.filter(ans => ans.qId === q._id.toString())
            if (filteredAnswerArr.length > 0) {
              const obj = {
                question: q.question,
                opt_a: giveQuestion(q.correct_opt, q.opt_a, "opt_a"),
                opt_b: giveQuestion(q.correct_opt, q.opt_b, "opt_b"),
                opt_c: giveQuestion(q.correct_opt, q.opt_c, "opt_c"),
                opt_d: giveQuestion(q.correct_opt, q.opt_d, "opt_d"),
                correct_opt: {
                  code_name: q.correct_opt,
                  name: giveOptionName(q.correct_opt)
                },
                your_opt: {
                  code_name: filteredAnswerArr[0].opt,
                  name: giveOptionName(filteredAnswerArr[0].opt)
                },
                marks: q.marks,
                marksObtained: (q.correct_opt === filteredAnswerArr[0].opt) ? q.marks : 0,
              }
              out_of = out_of + obj.marks
              if (obj.correct_opt.code_name === obj.your_opt.code_name) {
                total_score = total_score + obj.marks
              }
              newArr.push(obj)
            } else {
              const obj = {
                question: q.question,
                opt_a: giveQuestion(q.correct_opt, q.opt_a, "opt_a"),
                opt_b: giveQuestion(q.correct_opt, q.opt_b, "opt_b"),
                opt_c: giveQuestion(q.correct_opt, q.opt_c, "opt_c"),
                opt_d: giveQuestion(q.correct_opt, q.opt_d, "opt_d"),
                correct_opt: {
                  code_name: q.correct_opt,
                  name: giveOptionName(q.correct_opt)
                },
                your_opt: {
                  code_name: 'not_attempted',
                  name: 'You have not answered this question'
                },
                marks: q.marks,
                marksObtained: 0
              }
              out_of = out_of + obj.marks
              newArr.push(obj)
            }
          })
          return res.json({ state, total_score: `You scored ${total_score} out of ${out_of}`, data: newArr })
        }
        return res.status(400).json({ error: 'Error occurred while finding questions.' })
      }
      return res.status(400).json({ error: 'Error occurred while finding question paper.' })
    }
    return res.status(400).json({ error: 'Error occurred while finding exam.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router