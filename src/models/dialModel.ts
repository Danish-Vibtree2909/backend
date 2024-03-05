import { Schema, model } from 'mongoose'
import IDial from '../types/Voip/dial'

const Dial : Schema = new Schema({
  action: {
    type: String,
    required: false,
    default: null
  },
  answerOnBridge: {
    type: Boolean,
    required: false,
    default: false
  },
  callerId: {
    type: String,
    required: false,
    default: null
  },
  hangupOnStar: {
    type: Boolean,
    required: false,
    default: false
  },
  method: {
    type: String,
    enum: ['GET', 'POST'],
    required: false,
    default: 'POST'
  },
  record: {
    type: Boolean,
    required: false,
    default: false
  },
  recordingStatusCallback: {
    type: String,
    required: false,
    default: false
  },
  recordingStatusCallbackMethod: {
    type: String,
    enum: ['GET', 'POST'],
    required: false,
    default: 'POST'
  },
  recordingStatusCallbackEvent: {
    type: String,
    enum: [
      'in-progress',
      'completed',
      'absent'
    ],
    required: false,
    default: 'completed'
  },
  recordingTrack: {
    type: String,
    enum: [
      'inbound',
      'outbound',
      'both'
    ],
    required: false,
    default: 'both'
  },
  ringTone: {
    type: String,
    required: false,
    default: null
  },
  timeLimit: {
    type: Number,
    required: false,
    default: 14400
  },
  timeout: {
    type: Number,
    required: false,
    default: 30
  },
  trim: {
    type: String,
    enum: [
      'trim-silence',
      'do-not-trim'
    ],
    required: false,
    default: 'do-not-trim'
  }
})

export default model<IDial>('dial', Dial)
