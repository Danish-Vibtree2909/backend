import {model , Schema} from 'mongoose';
import CallRecordingsCallbacks from '../types/CallRecordingCallbacksTypes';

const CallRecordingModel = new Schema({
    AccountSid : {
        type : String,
        required : false
    },
    CallSid : {
        type : String,
        required : false
    },
    RecordingSid : {
        type : String,
        required : false
    },
    RecordingStartTime : {
        type : String,
        required : false
    },
    RecordingStatus : {
        type : String,
        required : false
    },
    RecordingUrl : {
        type : String,
        required : false
    },
    Timestamp : {
        type : String,
        required : false
    },
    createdAt : {
        type : Date,
        required : false,
        default : Date.now,
    }
})

export default model<CallRecordingsCallbacks>('call_recordings', CallRecordingModel )