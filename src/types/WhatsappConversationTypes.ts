import {Document} from 'mongoose';
import WhatsappRecordFormatted from './WhatsappFormattedTypes';


export default interface WhatsappConversation extends Document {
    conversation_id : any;
    assignedToBot :  boolean,
    doWeAskForCoupon : boolean,
    participants : [
        {
            user_id : string;
            user_name : string;
            user_image : string;
            number : string;
        }
    ];
    type : string;
    messages : [
        WhatsappRecordFormatted
    ];
    unreadCount : number;
}