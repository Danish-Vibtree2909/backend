import { model, Schema } from 'mongoose'
import IDEModelInterface from '../types/IDEModelInterface'

const IDEModel : Schema = new Schema({
  sid: {
    type: String,
    required: true,
    default: false
  },
  username: {
    type: String,
    required: true,
    default: false
  },
  notes: {
    type: String,
    required: true,
    default: false
  },
  tags: {
    type: String,
    required: true,
    default: false
  },
  dialedNo: {
    type: String,
    required: true,
    default: false
  },
  cloudNumber: {
    type: String,
    required: true,
    default: false
  }
})

export default model<IDEModelInterface>('ide', IDEModel, 'inbox_details_extendeds')
