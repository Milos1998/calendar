import express from 'express'
import Meeting from '../models/meeting.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find()
    res.send(meetings).status(200)
  } catch (error) {
    res.send({ message: error.message })
  }
})

// I'm identifying meetings by their time - epoch time
router.post('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id)
  if (id === null) { return res.status(400).send('invalid param') }

  const exists = await findMeeting(id)
  if (exists.error) return res.send(exists.error.message).status(418)
  if (exists.length > 0) return res.send('conflicting meeting id').status(400)

  try {
    const meetingData = {
      title: req.body.title,
      description: req.body.description,
      time: id,
      participants: req.body.participants
    }
    const meeting = new Meeting(meetingData)
    const meetingLog = await meeting.save()
    res.send(meetingLog).status(200)
  } catch (error) {
    res.send({ message: error.message }).status(418)
  }
})

router.delete('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id)
  if (id === null) { return res.status(400).send('invalid param') }

  const exists = await findMeeting(id)
  if (exists.error) return res.send(exists.error.message).status(418)
  if (exists.length === 0) return res.send('incorrect meeting id').status(400)

  try {
    const meetingLog = await Meeting.deleteMany({ time: id })
    res.send(meetingLog).status(200)
  } catch (error) {
    res.send({ message: error.message }).status(418)
  }
})

router.put('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id)
  if (id === null) { return res.status(400).send('invalid param') }

  const exists = await findMeeting(id)
  if (exists.error) return res.send(exists.error.message).status(418)
  if (exists.length === 0) return res.send('incorrect meeting id').status(400)

  const existsNew = await findMeeting(req.body.newId)
  if (existsNew.error) return res.send(exists.error.message).status(418)
  if (existsNew.length > 0) return res.send('New meeting id is taken').status(400)

  try {
    const meetingLog = await Meeting.deleteMany({ time: id })
    if (meetingLog.deletedCount < 1) return res.send('didn\'t delete meeting for some reason :/').status(418)
  } catch (error) {
    res.send({ message: error.message }).status(418)
  }

  try {
    const meetingData = {
      title: req.body.title,
      description: req.body.description,
      time: req.body.newId,
      participants: req.body.participants
    }
    const meeting = new Meeting(meetingData)
    const meetingLog = await meeting.save()
    res.send(meetingLog).status(200)
  } catch (error) {
    res.send({ message: error.message }).status(418)
  }
})

router.get('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id)
  if (id === null) { return res.status(400).send('invalid param') }

  const formatedDay = new Date(id)
  const dayBegin = new Date(formatedDay.getFullYear(), formatedDay.getMonth(), formatedDay.getDate()).getTime()
  const dayEnd = new Date(formatedDay.getFullYear(), formatedDay.getMonth(), formatedDay.getDate() + 1).getTime()

  try {
    const meetingsLog = await Meeting.find({ time: { $gte: dayBegin, $lt: dayEnd } })
    res.send(meetingsLog).status(200)
  } catch (error) {
    res.send({ message: error.message }).status(418)
  }
})

async function findMeeting (meetingId) {
  let exists
  try {
    exists = Meeting.find({ time: meetingId })
  } catch (error) {
    exists.error = error
  }
  return exists
}

export default router
