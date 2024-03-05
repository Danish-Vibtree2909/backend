import {Document} from 'mongoose';

export default interface automatedCallCDR extends Document {
    MainCallParentCallSid: string;
    CallStatus: string;
    MissedCallType: string;
    AccountSid: string;
    AgentCallSid: string;
    CustomerCallSid: string;
    ConferenceSid: string;
    FriendlyName: string;
    StatusCallbackEvent: string;
    EndConferenceOnExit: string;
    Hold: string;
    Muted: string;
    SequenceNumber: string;
    StartConferenceOnEnter: string;
    AgentNumber: string;
    CustomerNumber: string; 
    CloudNumber: string;
}