import { Document } from 'mongoose';
export default interface CloudPhoneTypes extends Document {
    AccountId: string;
    ParentCallId: string;
    ChildCallId: string;
    CallType: string;
    CloudNumber: string;
    CallUsing: string;
    User: string;
    Caller: string;
    StartTime: string;
    Notes: string;
    Tags: string;
    Recordings: string;
    Duration: string;
    CallStatus: string;
    Receiver: string;
    PC_initiated: Date | string;
    PC_ringing: Date | string;
    PC_in_progress: Date | string;
    PC_completed: Date | string;
    PC_busy: Date | string;
    PC_failed: Date | string;
    PC_canceled: Date | string;
    CC_initiated: Date | string;
    CC_ringing: Date | string;
    CC_in_progress: Date | string;
    CC_completed: Date | string;
    CC_busy: Date | string;
    CC_failed: Date | string;
    CC_canceled: Date | string;
}
//# sourceMappingURL=CloudPhoneType.d.ts.map