import {model , Schema} from 'mongoose';
import ViberConversation from '../types/ViberConversationTypes';

const ViberConversationModel = new Schema({
    conversation_id : {
        type : String,
        required : false,
    },
    assignedToBot : {
        type : Boolean,
        required : true,
        default : true
    },
    user_id : {
        type : String,
        required : false,
    },
    chat_hostname:{ // it is unique for every user like whatsapp-number
        type : String,
        required : false, 
    },
    participants : [
        {
            user_id : {
                type : Schema.Types.ObjectId,
                required : false,
                ref : 'contacts',
            },
            user_name : {
                type : String,
                required : false,
            },
            user_image : {
                type : String,
                required : false,
            },
            number : {
                type : String,
                required : false,
            }
        }
    ],
    type : {
        type : String,
        required : false,
    },
    messages : [
        {
            type : Schema.Types.Mixed,
            required : false,
        }
    ],
    unreadCount : {
        type : Number,
        required : false,
        default : 0,
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
    ticketId :{
        type: Schema.Types.ObjectId,
        ref: 'tickets_list',
        required : false
    }
})

export default model<ViberConversation>('viber_conversation', ViberConversationModel )