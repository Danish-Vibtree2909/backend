import { model, Schema } from 'mongoose'
import ICallFlows from '../types/callFlows'
const schema : Schema = new Schema({
  authId: {
    type: Schema.Types.ObjectId,
    ref: 'users-permissions_user'
  },
  title: {
    type: String,
    required: true,
    default: null
  },
  flowObject: {
    elements: {
      type: Array,
      required: false,
      default: []
    },
    position: {
      type: Array,
      required: false,
      default: [0, 0]
    },
    zoom: {
      type: Number,
      required: false,
      default: 1
    }
  },
  cloudNumber: {
    number: {
      type: String,
      required: false,
      default: null
    },
    countryCode: {
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
    }
  },
  callInitiate: {
    number: {
      type: String,
      required: false,
      default: null
    },
    record: {
      type: Boolean,
      required: false,
      default: false
    },
    countryCode: {
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
    }
  },
  audio: {
    type: {
      type: String,
      required: false,
      default: null
    },
    file: {
      type: String,
      required: false,
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })
export default model<ICallFlows>('call_flows', schema)
