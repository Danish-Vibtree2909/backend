"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ViberFormattedModel = new mongoose_1.Schema({
    WaSid: {
        type: String,
        required: false
    },
    Direction: {
        type: String,
        required: false,
    },
    To: {
        type: String,
        required: false,
    },
    From: {
        type: String,
        required: false,
    },
    message: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    messageBody: {
        type: String,
        required: false,
    },
    chat_hostname: {
        type: String,
        required: false,
    },
    message_token: {
        type: String,
        required: false,
    },
    sender: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    status: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: false,
        default: Date.now,
    }
});
exports.default = (0, mongoose_1.model)('viber_records', ViberFormattedModel);
//# sourceMappingURL=ViberFormattedModel.js.map