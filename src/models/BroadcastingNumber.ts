import {model , Schema} from 'mongoose';
import IBroadcastingNumber from '../types/BroadcastingNumberTypes';

const BroadcastingSchema = new Schema({
    number :{
        type : String,
        required : false
    },
    count :{
        type : Number,
        required : false
    }
})

export default model<IBroadcastingNumber>('broadcasting_number', BroadcastingSchema)