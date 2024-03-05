import {model , Schema} from 'mongoose';
import allMetaDataTypes from '../types/AllMetaDataTypes';

const AllMetaDataModel: Schema = new Schema({
    object : {
        type: String,
        required: true,
    },
    entry : [
        {
            type : Schema.Types.Mixed,
            required: false,
        }
    ]
});

export default model<allMetaDataTypes>('allMetaDataModel', AllMetaDataModel);