"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VoiceMailRecordSchema = new mongoose_1.Schema({
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
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
});
exports.default = (0, mongoose_1.model)('VoiceMailRecord', VoiceMailRecordSchema);
//# sourceMappingURL=VoiceMailRecordModel.js.map