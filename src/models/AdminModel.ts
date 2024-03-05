import { model, Schema } from 'mongoose'
import Admin from '../types/admin'

const admin : Schema = new Schema({
 
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  Status: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    required: false
  },
  updatedAt: {
    type: Date,
    required: false
  }
 
})

export default model<Admin>('admin_details',admin)
