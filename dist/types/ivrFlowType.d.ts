import { Document } from 'mongoose';
export default interface allRecords extends Document {
    Digits: {
        [key: string]: any;
    };
    DtmfInputType: string;
    AccountSid: string;
    AnswerTime: string;
    ApiVersion: string;
    CallDuration: string;
    CallSid: string;
    CallStatusArray: string[];
    CallbackSource: string;
    Called: string;
    Caller: string;
    Direction: string;
    From: string;
    HangupTime: string;
    TimeStampFlow: {
        [key: string]: any;
    };
    ParentCallSid: string;
    RecordingUrl: string;
    RingTime: string;
    SequenceNumberArray: string[];
    TimestampArray: string[];
    To: string;
    createdAt: Date;
    Tags?: [{
        name: string;
        color: string;
        checked: boolean;
    }];
}
//# sourceMappingURL=ivrFlowType.d.ts.map