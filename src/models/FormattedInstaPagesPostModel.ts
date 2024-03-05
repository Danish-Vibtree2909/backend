import {model , Schema} from 'mongoose';
import FormattedPagesPostTypes from '../types/FormattedPagesPostTypes';

const FormattedPagesPostModel = new Schema({
    AccountSid : {
        type : String,
        required : false,
    },
    ig_businness_account_id : {
        type : String,
        required : false,
    },
    postId :{
        type : String,
        required : false
    },
    description :{
        type: Schema.Types.Mixed,
        required: false,
    },
    reactions :{
        type: Schema.Types.Mixed,
        required: false,
    },
    comments :{
        type: Schema.Types.Mixed,
        required: false,
    },
    createdAt :{
        type : Date,
        required : false,
        default : new Date()
    },
    updatedAt :{
        type : Date,
        required : false,
        default : new Date()
    }
})

export default model<FormattedPagesPostTypes>('formatted_insta_pages_post',FormattedPagesPostModel )