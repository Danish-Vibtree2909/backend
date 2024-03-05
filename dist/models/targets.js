"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TargetModel = new mongoose_1.Schema({
    AccountId: {
        type: String,
        required: false
    },
    campaign_ids: [{
            type: String,
            required: false
        }],
    sip_password: {
        type: String,
        required: false
    },
    monthly_cap: {
        type: Number,
        required: false
    },
    hourly_cap: {
        type: Number,
        required: false
    },
    yearly_cap: {
        type: Number,
        required: false
    },
    is_daily: {
        type: Boolean,
        default: false,
        required: true
    },
    is_hourly: {
        type: Boolean,
        default: false,
        required: true
    },
    call_number: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    daily_cap: {
        type: Number,
        required: false
    },
    capon: {
        type: String,
        required: false
    },
    max_concurrency: {
        type: Number,
        required: false
    },
    is_monthly: {
        type: Boolean,
        default: false,
        required: true
    },
    sip_endpoint: {
        type: String,
        required: false
    },
    call_type: {
        type: String,
        required: true
    },
    sip_username: {
        type: String,
        required: false
    },
    is_yearly: {
        type: Boolean,
        default: false,
        required: true
    },
    auth_id: {
        type: String,
        required: false
    },
    authSecret_id: {
        type: String,
        required: false
    },
    target_id: {
        type: String,
        required: false
    }
});
exports.default = (0, mongoose_1.model)('targets', TargetModel);
//# sourceMappingURL=targets.js.map