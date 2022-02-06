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
  if (exists.error) { return res.send({ message: exists.error.message }).status(418) }
  if (exists) { return res.send('participant already exists in database').status(400) }

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
  if (exists.error) { return res.json({ message: exists.error.message }).status(418) }
  if (!exists) { return res.send('participant not in database!').status(400) }

  try {
    const removed = await Participant.deleteMany(participantData)
    res.send(removed).status(200)
  } catch (error) {
    res.json({ message: error.message }).status(418)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id)
    res.send(participant).status(200)
  } catch (error) {
    res.json({ message: error.message }).status(418)
  }
})

async function findParticipant (participant) {
  let exists
  try {
    const tmp = await Participant.find(participant)
    exists = !!tmp.length
  } catch (error) {
    exists.error = error
  }
  return exists
}

export default router
