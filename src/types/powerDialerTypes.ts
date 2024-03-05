import {Document} from 'mongoose';

export default interface PowerDialer extends Document {
    authId : string;
    authSecret : string;
    userId : any;
    contactId ?: any;
    contactNumber : string;
    callStatus : string;
    callSid : string;
}