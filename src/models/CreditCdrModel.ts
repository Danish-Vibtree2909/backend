import { model , Schema } from 'mongoose';
import CreditCdrInterface from '../types/CreditCdrType';

const CreditCdrModel : Schema = new Schema({
    createdAt : {
        type: Date,
        default: ()=> Date.now(),
        immutable: true
    },
    companyId : {
        type : Schema.Types.ObjectId,
        ref : 'companies',
        required : false
    },
    smsId : {
        type : Schema.Types.ObjectId,
        ref : 'sms_message',
        required : false
    },
    callId : {
        type : Schema.Types.ObjectId,
        ref : 'ivr_flow',
        required : false
    },
    source : { 
        type : String,
        required : false
    },
    amount : {
        type : Number,
        required : false
    },
    numberId : {
        type : Schema.Types.ObjectId,
        ref : 'number',
        required : false
    }
})

export default model<CreditCdrInterface>('credit_cdr', CreditCdrModel)