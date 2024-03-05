import { Schema, model } from 'mongoose'
const Numbers : Schema = new Schema({
  name:{
    type: String,
    required: false,
    default: '',
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  country_code: {
    type: String,
    required: false,
    default: null
  },
  country_iso: {
    type: String,
    required: false,
    default: null
  },
  type: {
    type: String,
    required: false,
    default: null
  },
  capability: {
    type: String,
    required: false,
    default: null
  },
  mrc: {
    type: Schema.Types.Decimal128,
    required: false,
    default: null
  },
  nrc: {
    type: Schema.Types.Decimal128,
    required: false,
    default: null
  },
  rps: {
    type: Schema.Types.Decimal128,
    required: false,
    default: null
  },
  initial_pulse: {
    type: Schema.Types.Decimal128,
    required: false,
    default: null
  },
  sub_pulse: {
    type: Schema.Types.Decimal128,
    required: false,
    default: null
  },
  acc_id: {
    type: String,
    required: false,
    default: null
  },
  application_id: {
    type: String,
    required: false,
    default: null
  },
  status: {
    type: String,
    required: false,
    default: null
  },
  carrier_id: {
    type: String,
    required: false,
    default: null
  },
  purchased_time: {
    type: Schema.Types.Date,
    required: false,
    default: null
  }
})

export default model('number', Numbers, 'numbers')
