import { model, Schema } from 'mongoose'
import ICloudNumbers from '../types/callFlows'

const schema : Schema = new Schema({
  number: {
    type: String,
    required: true,
    default: null
  },
  countryCode: {
    code: {
      type: String,
      required: true,
      default: null
    },
    label: {
      type: String,
      required: true,
      default: null
    },
    phone: {
      type: Number,
      required: true,
      default: null
    }
  },
  nodeId: {
    type: String,
    required: true,
    default: null
  },
  callFlow: {
    type: Schema.Types.ObjectId,
    ref: 'call_flows'
  }
})

export default model<ICloudNumbers>('call_flows_cloud_numbers', schema)
