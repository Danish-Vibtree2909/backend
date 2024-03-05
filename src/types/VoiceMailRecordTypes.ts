import {Document} from 'mongoose';

export default interface VoiceMailRecordTypes extends Document {
    Caller : string;
    CallSid : string;
    TimeStamp : string;
    Duration : string;
    VoiceMailBoxId : string;
    VoiceMailBoxName : string;
    RecordingUrl : string;
}