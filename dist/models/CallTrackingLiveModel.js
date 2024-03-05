"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CallTrackingLiveModel = new mongoose_1.Schema({
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
    Tags: {
        type: String,
        required: false
    },
    CallCost: {
        type: String,
        required: false
    },
    CC_in_progress: {
        type: String,
        required: false
    },
    subscribeDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});
exports.default = (0, mongoose_1.model)('realtime_callTracking', CallTrackingLiveModel);
//# sourceMappingURL=CallTrackingLiveModel.js.map