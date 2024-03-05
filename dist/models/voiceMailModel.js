"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const voiceMailModel = new mongoose_1.Schema({
    usedFor: {
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
    audioSourceFrom: {
        type: String,
        required: false,
    },
    connected: {
        code: {
            type: Number,
            required: false,
        },
        phone: {
            type: Number,
            required: false,
        },
    },
    isSendSms: {
        type: Boolean,
        required: false,
        default: false,
    },
    smmDetails: {
        toType: {
            type: String,
            required: false,
        },
        senderID: {
            type: String,
            required: false,
        },
        message: {
            type: String,
            required: false,
        },
        carrier: {
            type: String,
            required: false,
        },
        toNumber: [{
                number: {
                    type: String,
                    required: false,
                }
            }],
    }
});
exports.default = (0, mongoose_1.model)('voiceMailSettings', voiceMailModel);
//# sourceMappingURL=voiceMailModel.js.map