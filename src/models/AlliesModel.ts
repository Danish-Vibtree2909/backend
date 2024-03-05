import { model , Schema } from 'mongoose';
import AlliesTypes from '../types/alliesType';

const AlliesModel = new Schema({
    partner : {
        type : String,
        required : true
    },
    data : { 
        type : Schema.Types.Mixed,
        required : false,
    }
})

export default model<AlliesTypes>('allies', AlliesModel)