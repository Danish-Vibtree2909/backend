"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CallRecordingModel = new mongoose_1.Schema({
    AccountSid: {
        type: String,
        required: false
    },
    CallSid: {
        type: String,
        required: false
    },
    RecordingSid: {
        type: String,
        required: false
    },
    RecordingStartTime: {
        type: String,
        required: false
    },
    RecordingStatus: {
        type: String,
        required: false
    },
    RecordingUrl: {
        type: String,
        required: false
    },
    Timestamp: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now,
    }
});
exports.default = (0, mongoose_1.model)('call_recordings', CallRecordingModel);
//# sourceMappingURL=CallRecordingsCallbacksModel.js.map