const express = require('express')
const app = express()
const helmet = require('helmet')
const PORT = 5000
const connectToMongo = require('./mongodb.connect')
require('dotenv').config({ path: './.env.local' })
const cors = require('cors')

const corsOptions = {
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200
}

// Middlewares
app.use(express.json())
app.use(cors(corsOptions))
app.use(helmet())

// Connecting To Mongo DB
connectToMongo()

// Routes
app.use('/auth', require('./routes/auth'))
app.use('/question_paper', require('./routes/question_paper'))

app.listen(PORT, () => {
  console.log(`Server up at ${PORT}`)
})