import {model , Schema} from 'mongoose';
import UserActivityTypes from '../types/UserActivityTypes';

const UserActivity = new Schema({
    auth_id : {
        type : String,
        required : false
    },
    user_id :{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required : false
    },
    type:{
        type : String,
        required : false
    },
    createdAt:{
        type: Date,
        default: ()=> Date.now(),
        immutable: true
    },
    updatedAt:{
        type: Date,
        default:()=> Date.now(),
    },
})

export default model<UserActivityTypes>('user_activities', UserActivity)