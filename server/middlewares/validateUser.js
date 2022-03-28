const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const User = require('../models/Users')

const validateUser = async (req, res, next) => {
  // Getting user from client
  const token = req.header('x-access-token')
  if (!token) {
    return res.status(401).json({ error: 'Session expired. Please refresh the page.' })
  }
  if (token) {
    try {
      const userData = jwt.verify(token, JWT_SECRET)
      const user = await User.findById(userData.uid)
      if (user && (user.passwordLegacy === userData.legacy)) {
        req.user = userData
        return next()
      }
      return res.status(401).json({ error: 'Session expired. Please refresh the page.' })
    } catch (error) {
      console.error(error)
      return res.status(401).json({ error: 'Session expired. Please refresh the page.' })
    }
  }
}

module.exports = validateUser