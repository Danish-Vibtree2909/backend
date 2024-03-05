import { model, Schema } from 'mongoose'
import KycDocumentInterface from '../types/kycDocumentType'

const KycDocumentModel: Schema = new Schema({
  user_id: {
    type: String,
    required: true,
    default: false
  },
  company_type: {
    type: String,
    required: true,
    default: false
  },
  documents: [{
    fileLocation:{
      type:String,
      required: false
  
    },
    document_type:{
      type:String,
      required: false
    },
    status:{
      type:String,
      required: false
  
    },
    rejected_reason:{
      type:String,
      required: false
  
    }
  }],
  createdAt: {
    type: String,
    required: false
  },
  updatedAt: {
    type: String,
    required: false
  }
})

export default model<KycDocumentInterface>('kycdocuments', KycDocumentModel)
