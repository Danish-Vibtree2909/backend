import {model , Schema} from 'mongoose';
import MetaPagePostTypes from '../types/MetaPagesPostTypes';

const MetaPagesPostModel  = new Schema({
    data:[{
        created_time : {
            type : Date,
            required : false
        },
        story :{
            type : String,
            required : false
        },
        id : {
            type : String,
            required : false
        },
        message :{
            type : String,
            required : false
        }}
    ],
    paging : {
        cursors :{
            before : {
                type : String,
                required : false
            },
            after : {
                type : String,
                required : false
            }
        },
        next : {
            type : String,
            required : false
        }
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

export default model<MetaPagePostTypes>('meta_page_posts',MetaPagesPostModel )