import { model, Schema } from 'mongoose'
import IVoip from '../types/voip'

const VoipModel : Schema = new Schema({

  user_id: {
    type: String,
    required: true,
    default: null
  },
  say: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessSaygreater
    options: Schema.Types.ObjectId,
    value: {
      type: String,
      required: false,
      default: null
    }
  },
  play: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessPlaygreater
    options: Schema.Types.ObjectId,
    value: {
      type: String,
      required: false,
      default: null
    }
  },
  dial: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessDialgreater
    options: { type: Schema.Types.ObjectId, ref: 'dial' },
    value: {
      type: String,
      required: false,
      default: null
    }
  },
  record: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessRecordgreater
    value: {
      type: String,
      required: false,
      default: null
    },
    options: Schema.Types.ObjectId
  },
  gather: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessGathergreater
    value: {
      type: String,
      required: false,
      default: null
    },
    options: Schema.Types.ObjectId
  },
  hangup: {
    type: Boolean,
    required: false,
    default: null
  }, // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessHangupgreater
  pause: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessPausegreater
    options: Schema.Types.ObjectId,
    value: {
      type: String,
      required: false,
      default: null
    }
  },
  redirect: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessRedirectgreater
    options: Schema.Types.ObjectId,
    value: {
      type: String,
      required: false,
      default: null
    }
  },
  reject: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessRejectgreater
    value: Schema.Types.ObjectId,
    options: {
      type: String,
      required: false,
      default: null
    }
  },
  number: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessNumbergreater
    options: Schema.Types.ObjectId,
    value: {
      type: String,
      required: false,
      default: null
    }
  },
  sip: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessSipgreater
    options: Schema.Types.ObjectId
  }
})

export default model<IVoip>('xmlGenerate', VoipModel)
