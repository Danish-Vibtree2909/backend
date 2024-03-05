"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SMSMessageModel = new mongoose_1.Schema({
    conversationId: {
        type: String,
        required: false,
        immutable: true
    },
    messageId: {
        type: String,
        required: false
    },
    provider: {
        type: String,
        required: false
    },
    contactNumber: {
        type: String,
        required: false
    },
    cloudNumber: {
        type: String,
        required: false
    },
    tempId: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    direction: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    messageType: {
        type: String,
        required: false
    },
    conversationType: {
        type: String,
        required: false
    },
    messageBody: {
        type: String,
        required: false
    },
    isTemplate: {
        type: Boolean,
        required: false,
        default: false
    },
    peId: {
        type: String,
        required: false
    },
    senderId: {
        type: String,
        required: false
    },
    templateId: {
        type: String,
        required: false
    }
});
exports.default = (0, mongoose_1.model)('sms_message', SMSMessageModel);
//# sourceMappingURL=SMSMessageModel.js.map