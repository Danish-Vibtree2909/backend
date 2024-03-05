import { model, Schema } from 'mongoose'
import INumbersUsedFor from '../types/INumbersUsedFor'
const NumbersUsedFor : Schema = new Schema({
  number: {
    type: Schema.Types.String,
    default: null,
    required: true
  },
  auth_id:{
    type: Schema.Types.String,
    default: null,
    required: true
  },
  usedFor: {
    type: Schema.Types.String,
    enum: ['line_forward', 'call_flows', 'cloud_phone' , 'call_tracking' ],
    default: 'line_forward',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users-permissions_user'
  }
})
export default model<INumbersUsedFor>('number_used_for', NumbersUsedFor, 'numbers_used_for')
