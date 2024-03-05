"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CampaignModel = new mongoose_1.Schema({
    AccountId: {
        type: String,
        required: false
    },
    call_distribution_algo: {
        type: String,
        required: false
    },
    country: {
        code: {
            type: String,
            required: false,
            default: null
        },
        label: {
            type: String,
            required: false,
            default: null
        },
        phone: {
            type: String,
            required: false,
            default: null
        }
    },
    inbound_call_did: {
        type: String,
        required: false
    },
    is_played: {
        type: Boolean,
        required: false,
        default: false,
    },
    campaign_name: {
        type: String,
        required: false
    },
    target_group_id: {
        type: String,
        required: false
    },
    campaign_id: {
        type: String,
        required: false
    },
    target_id: {
        type: String,
        required: false
    },
    action: {
        type: String,
        required: false
    },
});
exports.default = (0, mongoose_1.model)('campaigns', CampaignModel);
//# sourceMappingURL=campaigns.js.map