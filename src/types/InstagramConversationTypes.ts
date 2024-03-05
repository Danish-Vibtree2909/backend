import {Document} from 'mongoose';
import WhatsappRecordFormatted from './WhatsappFormattedTypes';


export default interface InstagramConversation extends Document {
    conversation_id : any;
    assignedToBot :  boolean,
    doWeAskForCoupon : boolean,
    receiver_id : string,
    participants : [
        {
            user_id : string;
            user_name : string;
            user_image : string;
            number : string;
            meta_id : string;
        }
    ];
    type : string;
    messages : [
        WhatsappRecordFormatted
    ];
    unreadCount : number;
}