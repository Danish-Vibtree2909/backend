import {model , Schema} from 'mongoose';
import InboxType from '../types/InboxType';

const TableModel = new Schema({
    AccountSid : {
        type : String ,
        required : false
    },
    UserId : [
    {
         type: Schema.Types.ObjectId,
        ref: 'user',
        required : false
    }
    ],
    companyId : {
        type : Schema.Types.ObjectId,
        ref : 'companies',
        required : false
    },
    InboxName : {
        type : String ,
        required : false
    },
    InboxIcon : {
        type : String ,
        required : false
    },
    InboxType : {
        type : String ,
        required : false
    },
    Status : {
        type : String ,
        required : false,
        default : "active"
    },
    created_by : {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required : false
    },
    view_type : {
        type : String ,
        required : false,
        default : "All"
    },
    allowed_permission :{
        type: Schema.Types.Mixed,
        required: false,
    },
    data :[
        {
          type: Schema.Types.Mixed,
          required: false,
        }
      ],
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

export default model<InboxType>('inbox_view',TableModel )