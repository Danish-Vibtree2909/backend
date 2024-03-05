import { Document } from 'mongoose'
export default interface IConference extends Document{
    AccountSid : String,
    ParentCallSid: String,
    CallSid: string,
    ConferenceId: string, //same as ConferenceSid
    CallStatus: string, // call Status of child
    ChildCallStatus : string,
    ConferenceSid: String,
    FriendlyName: string,
    StatusCallbackEvent: string,
    Timestamp : string,
    ChildCallSid ?: string,
    EndConferenceOnExit ?: string,
    Hold ?: string,
    Muted ?: string,
    SequenceNumber ?: string,
    StartConferenceOnEnter ?: string,
    source ?: string,
    id?: string,
    listOfChildCallSid? : [string],
    whispherUrl ?: string,
}
