import {model , Schema } from 'mongoose';
import CancelNumberInterface from '../types/CancelNumberType';

const CancelNumberModel : Schema = new Schema({
    auth_id :{
        type : String,
        required : false
    },
    number : {
        type : String,
        required : false,
    },
    type : {
        type : String,
        required : false,
    },
    country : {
        type : String,
        required : false,
    },
    purchasedDate : {
        type : Date,
        required : false
    },
    canceledNumber :{
        type: Date,
        required : true,
        default : Date.now
    },
})

export default model<CancelNumberInterface>('canceled_number', CancelNumberModel)