import {model , Schema} from 'mongoose';
import appTypes from '../types/appTypes';

const AppModel = new Schema ({
    auth_id : {
        type : String,
        required : false
    },
    app_id :{
            type : Schema.Types.ObjectId,
            required : false,
            ref : 'app_config',
    },
    active_on : {
        type: Date,
        default: ()=> Date.now(),
        immutable: true
    },
    active_by : {
        type : Schema.Types.ObjectId,
        required : false,
        ref : 'user',
    },
    createdAt:{
        type: Date,
        default: ()=> Date.now(),
        immutable: true
    },
    updatedAt:{
        type: Date,
        default:()=> Date.now(),
    },
})

export default model<appTypes>('app', AppModel)