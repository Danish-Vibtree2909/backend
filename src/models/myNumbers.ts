import { Schema, model } from 'mongoose'
import IMyNumbers from '../types/IMyNumbers'
const schema : Schema = new Schema({
  authId: {
    type: Schema.Types.ObjectId,
    ref: 'users-permissions_user'
  },
  number: {
    type: String,
    required: true,
    default: null
  },
  country: {
    code: {
      type: String,
      required: false,
      default: null
    },
    label: {
      type: String,
      required: false,
      default: null
    },
    phone: {
      type: Number,
      required: false,
      default: null
    }
  },
  status: {
    type: String,
    enum: ['verified', 'not-verified'],
    default: 'not-verified',
    required: false
  },
  cancel: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true })
export default model<IMyNumbers>('my_numbers', schema)
