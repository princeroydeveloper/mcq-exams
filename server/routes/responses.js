const express = require('express')
const router = express.Router()
const validateTeacher = require('../middlewares/validateTeacher')
const Answer = require('../models/Answers')
const QuestionPaper = require('../models/QuestionPapers')
const Question = require('../models/Questions')
const ObjectId = require('mongoose').Types.ObjectId
const { body, validationResult } = require('express-validator')

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

router.post('/get_list', validateTeacher, [
  body('qp_id', 'Request processing error...').isLength({ min: 1 })
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    const requiredQP = await QuestionPaper.findOne({ _id: ObjectId(req.body.qp_id), uid: ObjectId(req.user.uid) })
    if (requiredQP) {
      const answers = await Answer.find({ paper_id: requiredQP.paper_id }).select({ paper_id: 0 })
      if (answers) {
        let newAnswersArr = []
        answers.forEach(ans => {
          let state = ''
          if (ans.submitTimestamp) {
            state = 'Answers were submitted successfully.'
          } else if (ans.ticked[0] === 'time_expired' && ans.submitTimestamp) {
            state = 'Answers were declined due to time factor.'
          } else if (!ans.submitTimestamp) {
            state = 'Not submitted answers yet.'
          }
          const obj = {
            _id: ans._id,
            studentId: ans.studentId,
            studentName: ans.studentName,
            studentEmail: ans.studentEmail,
            submitTimestamp: ans.submitTimestamp,
            state
          }
          newAnswersArr.push(obj)
        })
        return res.json(newAnswersArr)
      }
      return res.status(400).json({ error: 'Error occurred while finding responses.' })
    }
    return res.status(400).json({ error: 'Error occurred while finding paper.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/get_score', validateTeacher, [
  body('qp_id', 'Request processing error...').isLength({ min: 1 }),
  body('answer_id', 'Request processing error...').isLength({ min: 1 })
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
      const exam = await Answer.findOne({ _id: ObjectId(req.body.answer_id), paper_id: requiredQP.paper_id })
      if (exam) {
        let state = ''
        if (exam.submitTimestamp) {
          state = 'Answers were submitted successfully.'
        } else if (exam.ticked[0] === 'time_expired' && exam.submitTimestamp) {
          return res.status(400).json({ error: 'Answers were declined due to time factor.' })
        } else if (!exam.submitTimestamp) {
          return res.status(400).json({ error: 'Not submitted answers yet.' })
        }
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
                  name: 'Question was not answered by the student'
                },
                marks: q.marks,
                marksObtained: 0
              }
              out_of = out_of + obj.marks
              newArr.push(obj)
            }
          })
          return res.json({ state, total_score: `${exam.studentName} scored ${total_score} out of ${out_of}`, data: newArr, studentName: exam.studentName })
        }
        return res.status(400).json({ error: 'Error occurred while finding questions.' })
      }
      return res.status(400).json({ error: 'Error occurred while finding response.' })
    }
    return res.status(400).json({ error: 'Error occurred while finding paper.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/delete', validateTeacher, [
  body('qp_id', 'Request processing error...').isLength({ min: 1 }),
  body('answer_id', 'Request processing error...').isLength({ min: 1 })
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    const requiredQP = await QuestionPaper.findOne({ _id: ObjectId(req.body.qp_id), uid: ObjectId(req.user.uid) })
    if (requiredQP) {
      const exam = await Answer.findByIdAndDelete(req.body.answer_id)
      if (exam) {
        return res.json({ success: 'Response deleted successfully!' })
      }
      return res.json({ error: 'Error occurred while deleting response.' })
    }
    return res.status(400).json({ error: 'Error occurred while finding paper.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router