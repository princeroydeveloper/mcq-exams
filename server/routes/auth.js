const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const User = require('../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME
const stringGenerator = require('string-generator-js')
const sgMail = require('@sendgrid/mail')
const crypto = require('crypto')
const APP_NAME = process.env.APP_NAME
const validateUser = require('../middlewares/validateUser')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.post('/signin', [
  body('email', 'Enter a valid email address').toLowerCase().trim().isEmail(),
  body('password', 'Enter your password').isLength({ min: 1 })
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    const requiredUser = await User.findOne({ email: req.body.email.toLowerCase().trim() })
    if (requiredUser) {
      // Compare Password
      const passResult = await bcrypt.compare(req.body.password, requiredUser.password)
      if (passResult) {
        // Sign a JWT and send it to client
        const payload = {
          uid: requiredUser._id,
          email: requiredUser.email,
          fname: requiredUser.fname,
          lname: requiredUser.lname,
          legacy: requiredUser.passwordLegacy,
          role: requiredUser.role
        }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME })
        return res.json({ success: token })
      }
      return res.status(400).json({ error: 'Please enter valid credentials' })
    }
    return res.status(400).json({ error: 'Please enter valid credentials' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/forgot_password', [
  body('email', 'Enter a valid email address').toLowerCase().trim().isEmail()
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    const requiredUser = await User.findOne({ email: req.body.email.toLowerCase().trim() })
    if (requiredUser) {
      const randomPasswordString = stringGenerator.generate({ length: 10 })
      const salt = await bcrypt.genSalt(10)
      const NewPassword = await bcrypt.hash(randomPasswordString, salt)
      const randomBytes = await crypto.randomBytes(50)
      const newLegacy = await randomBytes.toString('hex')
      const updatedUser = await User.findByIdAndUpdate(requiredUser._id, {
        password: NewPassword,
        passwordLegacy: newLegacy
      })
      if (updatedUser) {
        const message = {
          to: updatedUser.email,
          from: 'arindamroy0256@gmail.com',
          subject: 'Password reset request | ' + APP_NAME,
          text: `Hi! Your temporary password is: ${randomPasswordString}. Make sure to change it through profile page after signing in. Team ${APP_NAME}`,
          html: `<span>Hi! Your temporary password is: <strong>${randomPasswordString}</strong></span><br><span>Make sure to change it through profile page after signing in.</span><br><br><span style="color: #888888;">Team ${APP_NAME}</span>`
        }
        await sgMail.send(message)
        return res.json({ success: 'Follow the email sent to your registered email address!' })
      }
      return res.status(400).json({ error: 'Error occurred while resetting password' })
    }
    return res.status(400).json({ error: 'Cannot find your account' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/change_password', validateUser, [
  body('old', 'Please enter your old password').isLength({ min: 1 }),
  body('new', 'Your new password must be of at least 8 characters').isLength({ min: 8 }),
  body('cnew', 'Please confirm your new password').isLength({ min: 1 })
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    if (req.body.new === req.body.cnew) {
      const requiredUser = await User.findById(req.user.uid)
      if (requiredUser) {
        const passResult = await bcrypt.compare(req.body.old, requiredUser.password)
        if (passResult) {
          const salt = await bcrypt.genSalt(10)
          const NewPassword = await bcrypt.hash(req.body.new, salt)
          const randomBytes = await crypto.randomBytes(50)
          const newLegacy = await randomBytes.toString('hex')
          const updatedUser = await User.findByIdAndUpdate(requiredUser._id, {
            password: NewPassword,
            passwordLegacy: newLegacy
          })
          if (updatedUser) {
            return res.json({ success: 'Password changed successfully!' })
          }
          return res.status(400).json({ error: 'Error occurred while changing your account password' })
        }
        return res.status(400).json({ error: 'Please enter your password correctly' })
      }
      return res.status(401).json({ error: 'Session expired. Please refresh the page.' })
    }
    return res.status(400).json({ error: 'Passwords not matching.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/signup', [
  body('fname', 'Enter your first name').trim().isLength({ min: 1 }),
  body('lname', 'Enter your last name').trim().isLength({ min: 1 }),
  body('email', 'Enter a valid email address').toLowerCase().trim().isEmail(),
  body('password', 'Your account password must be of 8 characters').isLength({ min: 8 }),
  body('role', 'Select your role').isLength({ min: 1 })
], async (req, res) => {
  try {
    // Finds error in validation and return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // Proceed further
    if (req.body.role.toLowerCase().trim() === 'teacher' || req.body.role.toLowerCase().trim() === 'student') {
      const userExists = await User.findOne({ email: req.body.email.toLowerCase().trim() })
      if (!userExists) {
        const salt = await bcrypt.genSalt(10)
        const NewPassword = await bcrypt.hash(req.body.password, salt)
        const randomBytes = await crypto.randomBytes(50)
        const newLegacy = await randomBytes.toString('hex')
        const user = await User.create({
          fname: req.body.fname.trim(),
          lname: req.body.lname.trim(),
          email: req.body.email.toLowerCase().trim(),
          password: NewPassword,
          passwordLegacy: newLegacy,
          role: req.body.role.toLowerCase().trim()
        })
        if (user) {
          // Issue a jwt
          const payload = {
            uid: user._id,
            email: user.email,
            fname: user.fname,
            lname: user.lname,
            legacy: user.passwordLegacy,
            role: user.role
          }
          const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME })
          return res.json({ success: token, message: 'Account created successfully!' })
        }
        return res.status(400).json({ error: 'Error occurred while creating your account.' })
      }
      return res.status(400).json({ error: 'This email is not available. Try another.' })
    }
    return res.status(400).json({ error: 'Please select your role to proceed.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router