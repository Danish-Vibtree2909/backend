import { model , Schema } from 'mongoose'
import sms from '../types/smsTypes'

const smsModel : Schema = new Schema({
    sid :{
        type: String,
        required: false
    },
    date_created :{
        type: String,
        required: false
    },
    date_updated :{
        type: String,
        required: false
    },
    date_sent :{
        type: String,
        required: false
    },
    account_sid :{
        type: String,
        required: false
    },
    to :{
        type: String,
        required: false
    },
    from :{
        type: String,
        required: false
    },
    messaging_service_sid :{
        type: String,
        required: false
    },
    body :{
        type: String,
        required: false
    },
    status :{
        type: String,
        required: false
    },
    num_segments :{
        type: String,
        required: false
    },
    num_media :{
        type: String,
        required: false
    },
    direction :{
        type: String,
        required: false
    },
    api_version :{
        type: String,
        required: false
    },
    price :{
        type: String,
        required: false
    },
    price_unit :{
        type: String,
        required: false
    },
    error_code :{
        type: String,
        required: false
    },
    error_message :{
        type: String,
        required: false
    },
    uri :{
        type: String,
        required: false
    },
    subresource_uris :{
        media :{
            type: String,
            required: false
        }
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
});

export default model<sms>('sms', smsModel)