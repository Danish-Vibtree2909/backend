import {model , Schema} from "mongoose";
import voiceMailType from "../types/voiceMailTypes";

const voiceMailModel: Schema = new Schema({
    usedFor : {
        type: String,
        required: true,
        default: false,
    },
    audioUrlBeforeRecording: {
        type: String,
        required: true,
        default: false,
    },
    audioUrlAfterRecording: {
        type: String,
        required: true,
        default: false,
    },
    voicemailMaxLength: {
        type: String,
        required: false,
    },
    voicemailBox: {
        type: String,
        required: false,
    },
    voicemailFinishOnKey: {
        type: String,
        required: false,
    },
    application_id: {
        type: String,
        required: false,
    },
    audioSourceFrom : {
        type: String,
        required: false,
    },
    connected:{
        code: {
            type: Number,
            required: false,
        },
        phone: {
            type: Number,
            required: false,
        },
    },
    isSendSms : {
        type: Boolean,
        required: false,
        default: false,
    },
    smmDetails:{
        toType : {
            type: String,
            required: false,
        },
        senderID : {
            type: String,
            required: false,
        },
        message : {
            type: String,
            required: false,
        },
        carrier : {
            type: String,
            required: false,
        },
        toNumber: [{
            number : {
                type: String,
                required: false,
            }
        }],
    }
})

export default model<voiceMailType>('voiceMailSettings', voiceMailModel)
