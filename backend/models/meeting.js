import mongoose from 'mongoose'

const meetingSchema = {
  title: {
    required: true,
    type: String
  },
  description: {
    type: String
  },
  time: { // saved as epoch time
    required: true,
    type: Number
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant'
  }]
}

export default mongoose.model('Meeting', meetingSchema)
