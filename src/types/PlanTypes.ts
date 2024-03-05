import {Document} from 'mongoose';

export default interface PlansType extends Document {
    package : string;
    name : string;
    price : number; // purchase amount
    userId : any;
    features ?: [{
        name : string,
        allowed : boolean,
        total_consumed : number,
        total_allowed : number
    }]; 
    price_unit : string; // unit of currency which we giving like INR or USD
    credits :number;
    is_active : boolean; 
    days : number;
    coupons_required : number; // no of coupon required to purchase particular plan
    is_number_allowed : boolean; // Cloud numbers in that account
    total_number : number ; // Cloud number that a account have in it 
    users_allowed : number ; // no of user allowed in that package
}