import { Document } from 'mongoose';
export default interface IConferenceCallBacks extends Document {
    AccountSid: string;
    ConferenceSid: string;
    FriendlyName: string;
    StatusCallbackEvent: string;
    Timestamp: string;
    CallSid?: string;
    EndConferenceOnExit?: string;
    Hold?: string;
    Muted?: string;
    SequenceNumber?: string;
    StartConferenceOnEnter?: string;
}
//# sourceMappingURL=ConferenceCallBacksTypes.d.ts.map