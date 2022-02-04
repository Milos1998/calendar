import mongoose from 'mongoose'

const meetingSchema = {
  title: {
    required: true,
    type: String
  },
  description: {
    type: String
  },
  time: {
    required: true,
    type: Date
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant'
  }]
}

export default mongoose.model('Meeting', meetingSchema)
