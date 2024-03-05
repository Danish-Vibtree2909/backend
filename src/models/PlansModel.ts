import {model , Schema} from 'mongoose';
import PlansType from '../types/PlanTypes';

const PlansModel : Schema = new Schema({
    package : {
        type : String,
        required : true,
        unique : true,
        uppercase : true
    },
    name : {
        type : String,
        required : false,
        uppercase : true
    },
    price : {
        type : Number,
        required: true
    },
    price_unit : {
        type : String,
        required : false,
        default : "USD"
    },
    is_active : {
        type : Boolean,
        required : false,
        default : true
    },
    is_number_allowed : {
        type : Boolean,
        required : false,
        default : true
    },
    total_number : {
        type : Number,
        required: false,
        default : 1
    },
    credits : {
        type : Number,
        required: true
    },
    users_allowed : {
        type : Number,
        required: true
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
        }
    }],
    days : {
        type : Number,
        required: true
    },
    coupons_required : {
        type : Number,
        required : false,
        default : 0
    }
})

export default model<PlansType>('plan', PlansModel)