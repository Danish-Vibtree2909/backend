import {model , Schema} from 'mongoose';
import VoiceMailRecordTypes from '../types/VoiceMailRecordTypes';

const VoiceMailRecordSchema = new Schema({
    Caller: {
        type: String,
        required: false,
    },
    CallSid: {
        type: String,
        required: true,
    },
    TimeStamp: {
        type: String,
        required: false,
    },
    Duration: {
        type: String,
        required: false,
    },
    VoiceMailBoxId: {
        type: String,
        required: false,
    },
    VoiceMailBoxName: {
        type: String,
        required: false,
    },
    RecordingUrl: {
        type: String,
        required: false,
    },
    AccountSid: {
        type: String,
        required: false,
    },
    createdAt:{
        type: Date,
        default: ()=> Date.now(),
        immutable: true
    },
    updatedAt:{
        type: Date,
        default:()=> Date.now(),
    },
});

export default model<VoiceMailRecordTypes>('VoiceMailRecord', VoiceMailRecordSchema);