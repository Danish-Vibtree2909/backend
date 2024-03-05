import {model , Schema} from 'mongoose';
import TicketTypes from '../types/TicketTypes';

const TicketsModel  = new Schema ({
    AccountSid : {
        type : String,
        required : false
    },
    user_id : [
        {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required : false
        }
        ],
    ticket_id : {
        type: String,
        required : false
    },
    ticket_details : {
        type: String,
        required : false
    },
    status : {
        type : Schema.Types.Mixed,
        required : false,
    },
    created_by : {
        type: Schema.Types.ObjectId,
        ref: 'contact',
        required : false
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
    conversations : {
        voice :[{
            type: Schema.Types.ObjectId,
            ref: 'ivr_flow',
            required : false
        }],
        telegram:[{
            type: Schema.Types.ObjectId,
            ref: 'telegram_conversation',
            required : false
        }],
        messenger:[{
            type: Schema.Types.ObjectId,
            ref: 'formatted_pages_post',
            required : false
        }],
        viber:[{
            type: Schema.Types.ObjectId,
            ref: 'viber_conversation',
            required : false
        }],
        comments:[{
            type: Schema.Types.ObjectId,
            ref: 'formatted_pages_post',
            required : false
        }],
        instagram:[{
            type: Schema.Types.ObjectId,
            ref: 'formatted_insta_pages_post',
            required : false
        }],
        whatsapp :[{
            type: Schema.Types.ObjectId,
            ref: 'whatsapp_conversation',
            required : false
        }],
        sms:[{
            type: Schema.Types.ObjectId,
            ref: 'sms',
            required : false
        }],
    },
    CustomVariables: [
        {
            name : {
                type: String,
                required: false,
            },
            value : {
                type: Schema.Types.Mixed,
                required: false,
            },
            type : {
                type: String,
                required: false,
            },
            selected_value : {
                type: String,
                required: false,
            }
        }
    ],
    TicketFor :{
        type: String,
        required : false
    },
    ParentCallSid:{
        type: String,
        required : false
    },
    TimeLine : [
        {
            text : {
                type : String,
                required : false
            },
            created_by :{
                type : String,
                required : false
            },
            updated_at :{
                type: Date,
                default:()=> Date.now(),
            }
        }
    ]
})

export default model<TicketTypes>('tickets_list', TicketsModel )