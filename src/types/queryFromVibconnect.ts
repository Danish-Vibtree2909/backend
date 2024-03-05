import { Document } from 'mongoose'
export default interface QueryFromVibconnectInterface extends Document{
    AccountSid : string;
    ApiVersion : string;
    CallSid : string;
    CallStatus : string;
    CallbackSource : string;
    Called : string;
    Direction : string;
    From : string;
    InitiationTime : string;
    ParentCallSid : string;
    SequenceNumber : string;
    Timestamp   : string;
    To : string;
    DialCallDuration : string;
    DialCallSid : string;
    DialCallStatus : string;
}
