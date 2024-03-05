"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = require('mongoose');
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
    RecordingSid: { type: String, required: false },
    isTransfered: { type: Boolean, default: false },
    contactId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contact',
        required: false
    },
    CallType: {
        type: String,
        required: false,
        default: 'direct'
    },
    TransferType: {
        type: String,
        required: false
    }
});
const AllRecordsModel = new mongoose_1.Schema({
    CallStatus: { type: String, required: false },
    MissedCallType: { type: String, required: false },
    AccountSid: {
        type: String,
        required: false
    },
    Source: {
        type: String,
        required: false
    },
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    transferFrom: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    contactId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contact',
        required: false
    },
    Tags: [{
            name: {
                type: String,
                required: false,
                trim: true,
            },
            checked: {
                type: Boolean,
                default: false,
                required: false
            },
            backgroundColor: {
                type: String,
                default: '#FFE5B4',
                required: false
            }
        }],
    CloudNumber: {
        type: String,
        required: false
    },
    FlowId: {
        type: String,
        required: false
    },
    FlowName: {
        type: String,
        required: false
    },
    Notes: [
        {
            value: {
                type: String,
                required: false,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
                required: true
            },
            name: {
                type: String,
                required: false,
            }
        }
    ],
    ivrDetails: {
        type: Array,
        required: false
    },
    // Tags: {
    //     type: Array,
    //     required: false
    // },
    CallDuration: {
        type: String,
        required: false
    },
    ParentCallDuration: {
        type: String,
        required: false
    },
    SmsIds: {
        type: Array,
        required: false
    },
    // We are creating a nested schema which is primarily unrelational and denormalize.....
    ParentCall: {
        ParentCallSid: { type: String, required: false, unique: true },
        To: { type: String, required: false },
        From: { type: String, required: false },
        Direction: { type: String, required: false },
        IVR: { type: Map, required: false },
        CallStatus: { type: Map, of: String, required: false },
        ChildCall: [ChildCallSchema]
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    listOfChildCalls: [ChildCallSchema],
    ConnectedChildCallDuration: {
        type: String,
        required: false
    },
    Receiver: {
        type: String,
        required: false
    },
    CallerType: {
        type: String,
        required: false
    },
    QueueTime: {
        type: String,
        required: false
    },
    UnAttendedCallCdrList: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'automated_call_cdr',
        }],
    CallerName: {
        type: String,
        required: false
    },
    ReceiverName: {
        type: String,
        required: false
    },
    CloudNumberName: {
        type: String,
        required: false
    },
    Status: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    // inboxVoiceStatus: [
    //     {
    //       type: Schema.Types.Mixed,
    //       required: false,
    //     }
    //   ],
    ContactName: {
        type: String,
        required: false,
        default: "Unknown"
    },
    ContactNumber: {
        type: String,
        required: false
    },
    FinalCallStatus: {
        type: String,
        required: false
    },
    ticketId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'tickets_list',
        required: false
    }
});
exports.default = (0, mongoose_1.model)('ivr_flow', AllRecordsModel);
//# sourceMappingURL=ivrFlowModel.js.map