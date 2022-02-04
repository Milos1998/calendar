import mongoose from 'mongoose'

const participantSchema = {
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
}

export default mongoose.model('Participant', participantSchema)
