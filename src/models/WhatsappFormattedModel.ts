import {model , Schema} from 'mongoose';
import WhatsappFormattedTypes from '../types/WhatsappFormattedTypes';

const WhatsappFormattedModel = new Schema({
    WaSid : {
        type : String,
        required : true,
    },
    origin : {
        type : {
            type : String,
            required : false,
        }
    },
    From : {
        type : String,
        required : false,
    },
    PhoneNumberId : {
        type : String,
        required : false,
    },
    WabId : {
        type : String,
        required : false,
    },
    To : {
        type : String,
        required : false,

    },
    status : [
        {
            type : Schema.Types.Mixed,
            required : false,
        }
    ],
    pricing : {
            billable : {
                type : Boolean,
                required : false,
            },
            pricing_model : {
                type : String,
                required : false,
            },
            category : {
                type : String,
                required : false,
            }
    },
    templateName : {
        type : String,
        required : false,
    },
    messageBody :{
        type : String,
        required : false,
    },
    messageType : {
        type : String,
        required : false,
    },
    contactName : {
        type : String,
        required : false,
    },
    Direction : {
        type : String,
        required : false,
    },
    timestamp : {
        type : String,
        required : false,
    },
    createdAt : {
        type : Date,
        required : false,
        default : Date.now,
    }
});

export default model<WhatsappFormattedTypes>('whatsapp_records', WhatsappFormattedModel);
