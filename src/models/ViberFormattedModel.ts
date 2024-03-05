import {model , Schema} from 'mongoose';
import ViberRecordFormatted from '../types/ViberFormattedTypes';

const ViberFormattedModel = new Schema({
    WaSid :{
        type : String,
        required : false
    },
    Direction : {
        type : String,
        required : false,
    },
    To : {
        type : String,
        required : false,

    },
    From : {
        type : String,
        required : false,
    },
    message :{
        type : Schema.Types.Mixed,
        required: false,
    },
    messageBody :{
        type : String,
        required : false,
    },
    chat_hostname  :{
        type : String,
        required : false,
    },
    message_token  :{
        type : String,
        required : false,
    },
    sender  :{
        type : Schema.Types.Mixed,
        required: false,
    },
    status  :{
        type : Schema.Types.Mixed,
        required: false,
    },
    createdAt : {
        type : Date,
        required : false,
        default : Date.now,
    },
    updatedAt : {
        type : Date,
        required : false,
        default : Date.now,
    }
})

export default model<ViberRecordFormatted>('viber_records',ViberFormattedModel)