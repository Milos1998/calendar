import express from 'express'
import cors from 'cors'
import meeting from './routes/meetings.js'
import participants from './routes/participants.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const port = 8000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/meeting', meeting)
app.use('/participants', participants)

app.get('/', (req, res) => {
  res.status(200).json('asdasdsa').end()
})

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
mongoose.connection
  .on('error', error => console.log(error))
  .once('open', () => console.log('Connected to database'))

app.listen(port, () => console.log(`App is running on  http://localhost:${port}`))
