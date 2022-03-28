const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  passwordLegacy: {
    type: String,
    required: true
  }
}, { collection: 'users' })

const model = mongoose.model('users', UserSchema)
module.exports = model