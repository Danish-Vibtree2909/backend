import {Document} from 'mongoose';

export default interface SMSMessageType extends Document {
    conversationId : any;
    messageId : any ; // message id we got from thinq 
    // contactId : any ;
    contactNumber : string ;
    cloudNumber : string ;
    // companyId : any ;
    createdAt : any ;
    direction : string ;
    status : string ; // delivered / undelivered
    messageType : string ; // text / mms
    conversationType : string ; //one-on-one / group
    messageBody : string ;
    isTemplate : boolean ;
    peId? : string ;
    senderId? : string ;
    templateId?: string ;
    tempId? : string ;
    provider : string ; // Carrier from where we are sending or receiving messages.
}