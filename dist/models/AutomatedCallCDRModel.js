"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChildCallSchema = new mongoose_1.Schema({
    To: { type: String, required: false },
    From: { type: String, required: false },
    Status: { type: Map, of: String, required: false },
    CallDuration: { type: String, required: false },
    CreatedAt: { type: Date, default: Date.now() },
    CallSid: { type: String, required: false },
    StartTime: { type: Date, required: false },
    name: { type: String, required: false },
    userId: { type: String, required: false },
});
const AutomatedCallCDR = new mongoose_1.Schema({
    MainCallParentCallSid: {
        type: String,
        required: false
    },
    CallStatus: {
        type: String,
        required: false
    },
    MissedCallType: {
        type: String,
        required: false
    },
    TryCount: {
        type: Number,
        required: true,
        default: 3
    },
    AccountSid: {
        type: String,
        required: false
    },
    AgentCallSid: {
        type: String,
        required: false
    },
    CustomerCallSid: {
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
    AgentNumber: {
        type: String,
        required: false
    },
    CustomerNumber: {
        type: String,
        required: false
    },
    CloudNumber: {
        type: String,
        required: false
    },
    DetailsOfCall: [ChildCallSchema],
});
exports.default = (0, mongoose_1.model)('automated_call_cdr', AutomatedCallCDR);
//# sourceMappingURL=AutomatedCallCDRModel.js.map