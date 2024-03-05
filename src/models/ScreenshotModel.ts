import { model, Schema } from 'mongoose'
import ScreenshotInterface from '../types/screenshotType'

const ScreenshotModel: Schema = new Schema({
  title: {
    type: String,
    required: true,
    default: false
  },
  description: {
    type: String,
    required: true,
    default: false
  },
  product: {
    type: String,
    required: true,
    default: false,
  }
  ,
  url: {
    type: Schema.Types.Array,
    required: false,
  },
  createdAt :{
    type : Date,
    required : true,
    default : Date.now
},
updatedAt :{
  type : Date,
  required : false,
},
})

export default model<ScreenshotInterface>('screenshots', ScreenshotModel)

