import { Document } from 'mongoose';
export default interface CallRecordingsCallbacks extends Document {
    AccountSid: string;
    CallSid: string;
    RecordingSid: string;
    RecordingStartTime: string;
    RecordingStatus: string;
    RecordingUrl: string;
    Timestamp: string;
}
//# sourceMappingURL=CallRecordingCallbacksTypes.d.ts.map