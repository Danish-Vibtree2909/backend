import { model, Schema } from 'mongoose'
import RoadMapInterface from '../types/roadMapType'

const RoadmapModel: Schema = new Schema({
  date: {
    type: String,
    required: true,
    default: false
  },
  title: {
    type: String,
    required: true,
    default: false
  },
  description: {
    type: String,
    required: true,
    default: false,
  },
  product: {
    type: String,
    required: true,
    default: false,
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

export default model<RoadMapInterface>('roadmaps', RoadmapModel)

