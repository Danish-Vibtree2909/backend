import { Document } from 'mongoose'
export default interface GlobalObject extends Document{
    CallSid : string;
    CallStatus : string;
    To : string;
    Timestamp : string ;
    AccountSid : string;
    
}