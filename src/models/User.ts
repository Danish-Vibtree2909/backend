import { model, Schema } from 'mongoose'
import { IRegister } from '../types/register'

const User : Schema = new Schema({
  first_name: {
    type: String,
    required: true,
    default: null
  },
  last_name: {
    type: String,
    required: true,
    default: null
  },
  company_name: {
    type: String,
    required: true,
    default: null
  },
  company_id: {
    type: String,
    required: false,
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
      type: String,
      required: false,
      default: null
    }
  },
  phone_number: {
    type: String,
    required: false,
    default: null
  },
  password: {
    type: String,
    required: true,
    default: null
  },
  api_token: {
    type: String,
    required: false,
    default: null
  },
  sip_user:{
    type: String,
    required : false
  },
  sip_password:{
    type: String,
    required : false
  }
})

export default model<IRegister>('User', User)
// users-permissions_user
