"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SMSConversationModel = new mongoose_1.Schema({
    lastMessageId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'sms_message',
        required: false
    },
    contactId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contact',
        required: false
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    companyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'companies',
        required: false
    },
    contactNumber: {
        type: String,
        required: false
    },
    contactName: {
        type: String,
        required: false
    },
    cloudNumber: {
        type: String,
        required: false
    },
    conversationType: {
        type: String,
        required: false
    },
    conversationId: {
        type: String,
        required: true,
        immutable: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    lastMessageAt: {
        type: Date,
        default: () => Date.now()
    }
});
exports.default = (0, mongoose_1.model)('sms_conversation', SMSConversationModel);
//# sourceMappingURL=SMSConversationModel.js.map