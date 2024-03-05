import {model , Schema} from 'mongoose';
import PowerDialer from '../types/powerDialerTypes';

const PowerDialerModel = new Schema({
    authId : {
        type : String,
        required : false,
    },
    authSecret : {
        type : String,
        required : false
    },
    contactId : {
        type : Schema.Types.ObjectId,
        required : false,
        ref : 'contact'
    },
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required : false
    },
    callStatus : {
        type : String,
        required : true,
        default : "New"
    },
    callSid : {
        type : String,
        required : false
    },
    contactNumber : {
        type : String,
        required : false
    }
})

export default model<PowerDialer>('power_dialer',PowerDialerModel )