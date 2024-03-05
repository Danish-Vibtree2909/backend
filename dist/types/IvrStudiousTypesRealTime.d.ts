import { Document } from 'mongoose';
export default interface allRecords extends Document {
    Digits?: string;
    DtmfInputType?: string;
    Receiver?: string;
    AccountSid: string;
    AnswerTime?: string;
    ApiVersion?: string;
    CallDuration?: string;
    CallSid?: string;
    CallStatus?: string;
    CallbackSource?: string;
    Called?: string;
    Caller?: string;
    Direction?: string;
    From?: string;
    HangupTime?: string;
    InitiationTime?: string;
    ParentCallSid: string;
    ParentCallIdTransferCall: string;
    RecordingUrl?: string;
    RingTime?: string;
    SequenceNumber?: string;
    Timestamp?: string;
    To?: string;
    subscribeDate: Date;
    variables?: [
        {
            key: string;
            value: string;
        }
    ];
}
//# sourceMappingURL=IvrStudiousTypesRealTime.d.ts.map