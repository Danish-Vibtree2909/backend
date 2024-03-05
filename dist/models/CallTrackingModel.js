"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CallTrackingModel = new mongoose_1.Schema({
    AccountId: {
        type: String,
        required: false
    },
    ParentCallId: {
        type: String,
        required: false
    },
    CallType: {
        type: String,
        required: false
    },
    //from of parent call
    Caller: {
        type: String,
        required: false
    },
    CampaignId: {
        type: String,
        required: false
    },
    CampaignName: {
        type: String,
        required: false
    },
    //to of initiated parent call
    TrackingNumber: {
        type: String,
        required: false
    },
    //time stamp of initiated of parent call
    StartTime: {
        type: String,
        required: false
    },
    //to of last call back of child belongs to that parent call
    Route: {
        type: String,
        required: false
    },
    RouteName: {
        type: String,
        required: false
    },
    RouteId: {
        type: String,
        required: false
    },
    //CallStatus of last callback of child call related to parent call
    CallStatus: {
        type: String,
        required: false
    },
    CallDuration: {
        type: String,
        required: false
    },
    Notes: {
        type: String,
        required: false
    },
    // Tags : {
    //     type : String,
    //     required : false 
    // },
    Tags: [{
            name: {
                type: String,
                required: false,
            },
            checked: {
                type: Boolean,
                required: false
            },
            backgroundColor: {
                type: String,
                required: false
            }
        }],
    CallCost: {
        type: String,
        required: false
    },
    subscribeDate: {
        type: Date,
        required: true,
        default: Date.now
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
});
exports.default = (0, mongoose_1.model)('callTracking', CallTrackingModel);
//# sourceMappingURL=CallTrackingModel.js.map