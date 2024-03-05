import {model , Schema} from 'mongoose';
import SubscriptionTypes from '../types/SubscriptionType';

const SubscriptionModel : Schema = new Schema({
    isActive : {
        type : Boolean,
        required : true,
        default : true
    },
    package :{
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number ,
        required : false
    },
    credits : {
        type : Number ,
        required : false,
        min :[ 0 , 'No -ve numbers']
    },
    total_number : {
        type : Number ,
        required : false ,
        default : 1
    },
    users_allowed : {
        type : Number ,
        required : false ,
        default : 1
    },
    features : [{
        name : {
            type : String,
            required : true
        },
        allowed : {
            type : Boolean,
            required : false,
            default : false
        },
        total_consumed : {
            type : Number,
            required : false
        },
        total_allowed : {
            type : Number ,
            required : false
        }
    }],
    userId : {
        type : Schema.Types.ObjectId,
        required : false,
        ref : 'user',
    },
    companyId : {
        type : Schema.Types.ObjectId,
        required : false,
        ref : 'companies',
    },
    createdAt:{
        type: Date,
        default: ()=> Date.now(),
        immutable: true
    },
    startDate:{
        type: Date,
        default: ()=> Date.now()
    },
    endDate:{
        type: Date,
        default: ()=> Date.now()
    },
    isExpired : {
        type : Boolean,
        required : false,
        default : false
    },
    paymentId : {
        type : String,
        required : false
    },
    isFuturePlan : {
        type : Boolean,
        required : false,
        default : false
    }
})


export default model<SubscriptionTypes>('subscription', SubscriptionModel)