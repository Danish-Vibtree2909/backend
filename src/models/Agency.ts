import { model, Schema } from 'mongoose'
import AgencyInterface from '../types/agency'

const AgencyModel: Schema = new Schema({
  email: {
    type: String,
    required: true,
    default: false
  },
  phone: {
    type: String,
    required: true,
    default: false
  },
  firstname: {
    type: String,
    required: true,
    default: false
  },
  lastname: {
    type: String,
    required: true,
    default: false
  },
  agencyname: {
    type: String,
    required: true,
    default: false
  },
  state: {
    type: String,
    required: true,
    default: false
  },
  city: {
    type: String,
    required: true,
    default: false
  },
  zipcode: {
    type: String,
    required: true,
    default: false
  },
  country: {
    type: String,
    required: true,
    default: false
  }
})


export default model<AgencyInterface>('agencies', AgencyModel)
