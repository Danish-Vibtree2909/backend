import { model, Schema } from 'mongoose'
import LeadInterface from '../types/leads'

const LeadModel: Schema = new Schema({
  name: {
    type: String,
    required: false,
    default: false
  },
  password:{
    type: String,
    required: false,
    default: "$2a$10$MsUUZrN.z6aQ5PJOWH/9z.U5BBwwzSgTNLC4eym4ZsOLKT/KFn2li" //Danish@2909
  },
  firstName:{
    type: String,
    required: false,
    default: ""
  },
  lastName:{
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false,
    default: false,
    unique: true
  },
  phone: {
    type: String,
    required: false,
    default: " "
  },
  category: {
    type: String,
    required: false,
    default: "website"
  },
  country: {
    type: String,
    required: false,
    default: " "
  },
  state: {
    type: String,
    required: false,
    default: " "
  },
  city: {
    type: String,
    required: false,
    default: false
  },
  zipcode: {
    type: String,
    required: false,
    default: " "
  },
  channel: {
    type: String,
    required: false,
    default: "Inbound"
  }
  ,
  type: {
    type: String,
    required: false,
    default: "New"
  }
  ,
  status: {
    type: String,
    required: false,
    default: "Hot"
  }
  ,
  notes: {
    type: String,
    required: false,
    default: " "
  },
  activities_id: [{
    id: {
      type: Schema.Types.ObjectId,
      ref: 'sales_activity',
    }
}],
})

export default model<LeadInterface>('leads', LeadModel)
