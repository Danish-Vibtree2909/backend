import { model, Schema } from 'mongoose'
import ChangelogInterface from '../types/changeLogType'

const ChangelogModel : Schema = new Schema({
  version: {
    type: String,
    required: true,
    default: false
  },
  type_of_changes: {
    type: String,
    required: true,
    default: false
  },
  description: {
    type: String,
    required: true,
    default: false
  },
  date_of_changes: {
    type: String,
    required: true,
    default: false
  },
  product: {
    type: String,
    required: true,
    default: false
  },
  teast: {
    type: String,
    required: true,
    default: false
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

export default model<ChangelogInterface>('changelogs', ChangelogModel)
