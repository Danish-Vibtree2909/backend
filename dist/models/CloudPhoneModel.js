"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CloudPhoneModel = new mongoose_1.Schema({
    AccountId: {
        type: String,
        required: false
    },
    AccountSecretId: {
        type: String,
        required: false
    },
    ConferenceSid: {
        type: String,
        required: false
    },
    FriendlyName: {
        type: String,
        required: false
    },
    Source: {
        type: String,
        required: false
    },
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user'
    },
    ParentCallId: {
        type: String,
        required: false
    },
    ConferenceStatus: {
        type: String,
        required: false
    },
    ConferenceTimeStampArray: [
        {
            type: mongoose_1.Schema.Types.Mixed,
            required: false
        }
    ],
    ChildCallId: {
        type: String,
        required: false
    },
    CallType: {
        type: String,
        required: false
    },
    CloudNumber: {
        type: String,
        required: false
    },
    CallUsing: {
        type: String,
        required: false
    },
    User: {
        type: String,
        required: false
    },
    UserType: {
        type: String,
        required: false
    },
    Caller: {
        type: String,
        required: false
    },
    Receiver: {
        type: String,
        required: false
    },
    StartTime: {
        type: String,
        required: false
    },
    Notes: {
        type: String,
        required: false
    },
    Tags: {
        type: String,
        required: false
    },
    Recording: {
        type: String,
        required: false
    },
    Duration: {
        type: String,
        required: false
    },
    CallStatus: {
        type: String,
        required: false
    },
    CC_intiated: {
        type: String,
        required: false
    },
    CC_ringing: {
        type: String,
        required: false
    },
    CC_in_progress: {
        type: String,
        required: false
    },
    CC_completed: {
        type: String,
        required: false
    },
    CC_busy: {
        type: String,
        required: false
    },
    CC_failed: {
        type: String,
        required: false
    },
    CC_canceled: {
        type: String,
        required: false
    },
    PC_intiated: {
        type: String,
        required: false
    },
    PC_ringing: {
        type: String,
        required: false
    },
    PC_in_progress: {
        type: String,
        required: false
    },
    PC_completed: {
        type: String,
        required: false
    },
    PC_busy: {
        type: String,
        required: false
    },
    PC_failed: {
        type: String,
        required: false
    },
    PC_canceled: {
        type: String,
        required: false
    },
    subscribeDate: {
        type: Date,
        required: true,
        default: Date.now
    },
});
exports.default = (0, mongoose_1.model)('cloudphones', CloudPhoneModel);
//# sourceMappingURL=CloudPhoneModel.js.map