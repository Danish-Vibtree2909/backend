import {model , Schema} from 'mongoose';
import CouponTypes from '../types/CouponTypes';

const CouponModel : Schema = new Schema({
    value : {
        type : String,
        required : true
    },
    is_used : {
        type : Boolean,
        required : false,
        default : true
    },
    used_by :{
        type : Schema.Types.ObjectId,
        required : false,
        ref : 'user',
    },
    used_at : {
        type: Date,
        required : false,
    },
    used_time : {
        type : String,
        required : false
    }
})

export default model<CouponTypes>('coupon', CouponModel)