"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ConferenceCallBacksSchema = new mongoose_1.Schema({
    AccountSid: {
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
    StatusCallbackEvent: {
        type: String,
        required: false
    },
    Timestamp: {
        type: String,
        required: false
    },
    CallSid: {
        type: String,
        required: false
    },
    EndConferenceOnExit: {
        type: String,
        required: false
    },
    Hold: {
        type: String,
        required: false
    },
    Muted: {
        type: String,
        required: false
    },
    SequenceNumber: {
        type: String,
        required: false
    },
    StartConferenceOnEnter: {
        type: String,
        required: false
    },
    expireAt: {
        type: Date,
        required: false
    },
});
ConferenceCallBacksSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
exports.default = (0, mongoose_1.model)("ConferenceCallBacks", ConferenceCallBacksSchema);
//# sourceMappingURL=ConferenceCallBacksModel.js.map