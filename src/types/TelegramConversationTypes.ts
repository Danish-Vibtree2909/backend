import {Document} from 'mongoose';
import TelegramRecordFormatted from './TelegramFormattedTypes';

export default interface TelegramConversation extends Document {
    token : any;
    conversation_id : any;
    assignedToBot : boolean;
    chat_id : any;
    participants : [
        {
            user_id : string;
            user_name : string;
            user_image : string;
            number : string;
        }
    ];
    type : string ;
    messages : [
        TelegramRecordFormatted
    ];
    unreadCount : number;
}