"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//import moment from 'moment'
const AllRecordsModel = new mongoose_1.Schema({
    AccountSid: {
        type: String,
        required: false
    },
    source: {
        type: String,
        required: false
    },
    TransferType: {
        type: String,
        required: false
    },
    Notes: {
        type: String,
        required: false,
        default: " "
    },
    // Tags:{
    //     type : String,
    //     required : false,
    // },
    Tags: [
        {
            type: String,
            required: false,
            default: " "
        },
    ],
    DialCallStatus: {
        type: String,
        required: false
    },
    DialCallSid: {
        type: String,
        required: false
    },
    DialCallDuration: {
        type: String,
        required: false
    },
    Digits: {
        type: String,
        required: false
    },
    DtmfInputType: {
        type: String,
        required: false
    },
    AnswerTime: {
        type: String,
        required: false
    },
    CampaignId: {
        type: String,
        required: false
    },
    TargetId: {
        type: String,
        required: false
    },
    ApiVersion: {
        type: String,
        required: false
    },
    CallDuration: {
        type: String,
        required: false
    },
    CallSid: {
        type: String,
        required: false
    },
    CallStatus: {
        type: String,
        required: false
    },
    CallbackSource: {
        type: String,
        required: false
    },
    Called: {
        type: String,
        required: false
    },
    Caller: {
        type: String,
        required: false
    },
    Direction: {
        type: String,
        required: false
    },
    From: {
        type: String,
        required: false
    },
    HangupTime: {
        type: String,
        required: false
    },
    InitiationTime: {
        type: String,
        required: false
    },
    ParentCallSid: {
        type: String,
        required: false
    },
    RecordingUrl: {
        type: String,
        required: false
    },
    RingTime: {
        type: String,
        required: false
    },
    SequenceNumber: {
        type: String,
        required: false
    },
    TimeStamp: {
        type: String,
        required: false
    },
    To: {
        type: String,
        required: false
    },
    subscribeDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    expireDate: {
        type: Date,
        required: false,
        // default : moment().add(3,'d').toDate() // data will automically delete after 3 days
    }
});
AllRecordsModel.index({ expireDate: 1 }, { expireAfterSeconds: 0 });
exports.default = (0, mongoose_1.model)('ivr_studios_cdr', AllRecordsModel);
//# sourceMappingURL=ivrStudiosModelCallBacks.js.map