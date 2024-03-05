import {Schema , model } from 'mongoose';
import UserStatusInterface from '../types/userStatusTypes'; 

const UserStatusModel = new Schema({
    authId : {
        type : String,
        required : false
    },
    userId :{
        type : Schema.Types.ObjectId,
        required : false,
        ref: 'user',
        unique : true
    },
    status :{
        type: String,
        required : false,
        lowercase : true,
        default : 'available'
    }
})

export default model<UserStatusInterface>('user_status', UserStatusModel)