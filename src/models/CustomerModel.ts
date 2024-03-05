import { model, Schema } from 'mongoose'
import CustomerInterface from '../types/customerType'

const CustomerModel: Schema = new Schema({
  company_name: {
    type: String,
    required: true,
    default: false
  },
  type_of_customer: {
    type: String,
    required: true,
    default: false
  },
  customer: {
    type: String,
    required: true,
    default: false,
  }
})

export default model<CustomerInterface>('customers', CustomerModel)

