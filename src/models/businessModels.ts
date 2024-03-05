import {model , Schema} from 'mongoose';
import BusinessHourTypes from '../types/businesshourTypes';

const BusinessHourModel = new Schema({
    authId : {
        type : String,
        required : false
    },
    userId :{
        type : Schema.Types.ObjectId,
        required : false,
        ref: 'user'
    },
    data : {
        type : Schema.Types.Mixed,
        required : false
    }
})

export default model<BusinessHourTypes>('businesshour', BusinessHourModel )