import express from 'express'
import Participant from '../models/participant.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const participants = await Participant.find()
    res.send(participants).status(200)
  } catch (error) {
    res.send(error)
  }
})

router.post('/', async (req, res) => {
  const participantData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }

  const exists = await findParticipant(participantData)
  if (exists) {
    res.send('participant already exists in database').status(200)
    return
  }

  try {
    const participant = new Participant(participantData)
    const participantLog = await participant.save()
    res.send(participantLog).status(201)
  } catch (error) {
    res.json({ message: error.message }).status(418)
  }
})

router.delete('/', async (req, res) => {
  const participantData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }

  const exists = await findParticipant(participantData)
  if (!exists) {
    res.send('participant not in database!').status(400)
    return
  }

  try {
    const removed = await Participant.deleteMany(participantData)
    res.send(removed).status(200)
  } catch (error) {
    res.json({ message: error.message }).status(418)
  }
})

async function findParticipant (participant) {
  try {
    const tmp = await Participant.find({
      firstName: participant.firstName,
      lastName: participant.lastName
    })
    return !!tmp.length
  } catch (error) {
    return error
  }
}

export default router
