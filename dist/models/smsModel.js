"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const smsModel = new mongoose_1.Schema({
    sid: {
        type: String,
        required: false
    },
    date_created: {
        type: String,
        required: false
    },
    date_updated: {
        type: String,
        required: false
    },
    date_sent: {
        type: String,
        required: false
    },
    account_sid: {
        type: String,
        required: false
    },
    to: {
        type: String,
        required: false
    },
    from: {
        type: String,
        required: false
    },
    messaging_service_sid: {
        type: String,
        required: false
    },
    body: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    num_segments: {
        type: String,
        required: false
    },
    num_media: {
        type: String,
        required: false
    },
    direction: {
        type: String,
        required: false
    },
    api_version: {
        type: String,
        required: false
    },
    price: {
        type: String,
        required: false
    },
    price_unit: {
        type: String,
        required: false
    },
    error_code: {
        type: String,
        required: false
    },
    error_message: {
        type: String,
        required: false
    },
    uri: {
        type: String,
        required: false
    },
    subresource_uris: {
        media: {
            type: String,
            required: false
        }
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
exports.default = (0, mongoose_1.model)('sms', smsModel);
//# sourceMappingURL=smsModel.js.map