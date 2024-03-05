import {model , Schema} from 'mongoose';
import TelegramRecordFormatted from '../types/TelegramFormattedTypes';

const TelegramFormattedModel = new Schema({
    token: {
        type : String,
        required : false
    },
    WaSid :{
        type : String,
        required : false
    },
    update_id : {
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
    chat : {
        id : {
            type : String,
            required : false
        },
        first_name : {
            type : String,
            required : false
        },
        type : {
            type : String,
            required : false
        }
    },
    entities :{
        type : Schema.Types.Mixed,
        required: false,
    },
    date : {
        type : Schema.Types.Mixed,
        required: false,
    },
    text : {
        type : String,
        required: false,
    },
    createdAt : {
        type : Date,
        required : false,
        default : Date.now,
    }
})

export default model<TelegramRecordFormatted>('telegram_records', TelegramFormattedModel)