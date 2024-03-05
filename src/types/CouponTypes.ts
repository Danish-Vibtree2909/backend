import {Document} from 'mongoose'

export default interface CouponTypes extends Document{
    value : string;
    is_used : boolean;
    used_by : any;
    used_at : any;
    use_times : number;
}