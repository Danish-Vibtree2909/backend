import IFileSave from '../types/fileSave'
import { model, Schema } from 'mongoose'

const fileModel : Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  saved_as: {
    type: String,
    required: true
  }
})

export default model<IFileSave>('file', fileModel)
