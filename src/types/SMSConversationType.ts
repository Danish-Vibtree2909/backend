import {Document} from 'mongoose';

export default interface SMSConversationType extends Document {
    conversationId : string;
    lastMessageId : any ;
    contactId : any ;
    senderId : any ; //user id who is sending message 
    contactNumber : string ;
    cloudNumber : string ;
    companyId : any ;
    createdAt : any ;
    lastMessageAt : any ;
    conversationType : string ; //One-on-One / group
}