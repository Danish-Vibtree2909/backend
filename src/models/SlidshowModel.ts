import { model, Schema } from 'mongoose'
import SlideshowInterface from '../types/slidshowType'

const Slid: Schema = new Schema({
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
  },
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

export default model<SlideshowInterface>('slidshows', Slid)

