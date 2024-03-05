import { model , Schema } from 'mongoose';
import SMSMessageType from '../types/SMSMessageType';

const SMSMessageModel : Schema = new Schema({
    conversationId : {
        type : String ,
        required : false,
        immutable : true
    },
    messageId : {
        type : String ,
        required : false
    },
    provider : {
        type : String ,
        required : false
    },
    contactNumber : {
        type : String ,
        required : false
    },
    cloudNumber : {
        type : String,
        required : false
    },
    tempId : {
        type : String,
        required : false
    },
    createdAt : {
        type: Date,
        default: ()=> Date.now(),
        immutable: true
    },
    direction : {
        type : String,
        required : false
    },
    status : {
        type : String,
        required : false
    },
    messageType :{
        type : String,
        required : false
    },
    conversationType : {
        type : String,
        required : false 
    },
    messageBody : {
        type : String,
        required : false 
    },
    isTemplate : {
        type : Boolean,
        required : false,
        default : false
    },
    peId : {
        type : String,
        required : false 
    },
    senderId : {
        type : String,
        required : false 
    },
    templateId : {
        type : String,
        required : false 
    }
})

export default model<SMSMessageType>('sms_message', SMSMessageModel)