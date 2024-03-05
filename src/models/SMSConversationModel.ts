import { model , Schema } from 'mongoose';
import SMSConversationType from '../types/SMSConversationType';

const SMSConversationModel : Schema = new Schema({

    lastMessageId : {
        type : Schema.Types.ObjectId,
        ref : 'sms_message',
        required : false
    },
    contactId : {
        type : Schema.Types.ObjectId,
        ref : 'contact',
        required : false
    },
    senderId : {
        type : Schema.Types.ObjectId,
        ref : 'user',
        required : false
    },
    companyId : {
        type : Schema.Types.ObjectId,
        ref : 'companies',
        required : false
    },
    contactNumber : {
        type : String,
        required : false
    },
    contactName :{
        type : String,
        required : false 
    },
    cloudNumber : {
        type : String,
        required : false
    },
    conversationType : {
        type : String,
        required : false
    },
    conversationId :{
        type : String,
        required : true,
        immutable: true
    },
    createdAt : {
        type: Date,
        default: ()=> Date.now(),
        immutable: true
    },
    lastMessageAt : {
        type: Date,
        default: ()=> Date.now()
    }
})

export default model<SMSConversationType>('sms_conversation', SMSConversationModel)