import {Schema , model} from 'mongoose';
import VibconnectInterface from '../types/vibconnectTypes';

const vibconnectModel = new Schema({
    authId : {
        type : String,
        required : false
    },
    authSecret : {
        type : String,
        required : false
    },
    applicationId : {
        type : String,
        required : false
    },
    userId :{
        type : Schema.Types.ObjectId,
        required : false,
        ref: 'user'
    },
    createdBy :{
        type : Schema.Types.ObjectId,
        required : false,
        ref: 'user'
    },
    companyId :{
        type: String,
        required : false
    },
    createdAt:{
        type: Date,
        default: ()=> Date.now(),
        immutable: true
    },
})

export default model<VibconnectInterface>('vibconnect', vibconnectModel)