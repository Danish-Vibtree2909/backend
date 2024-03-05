import { model, Schema } from 'mongoose'
import TargetGroupModelInterface from '../types/targetGroup'

const TargetGroupModel : Schema = new Schema({
 

    name:{ 
        type: String,
        required: true
    },
    target_ids: [{
        type: String,
        required : false
    }],
    target_group_id :{
        type: String,
        required : false
    }
})

export default model<TargetGroupModelInterface>('targetGroup', TargetGroupModel)
