"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TelegramFormattedModel = new mongoose_1.Schema({
    token: {
        type: String,
        required: false
    },
    WaSid: {
        type: String,
        required: false
    },
    update_id: {
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
    chat: {
        id: {
            type: String,
            required: false
        },
        first_name: {
            type: String,
            required: false
        },
        type: {
            type: String,
            required: false
        }
    },
    entities: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    date: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    text: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now,
    }
});
exports.default = (0, mongoose_1.model)('telegram_records', TelegramFormattedModel);
//# sourceMappingURL=TelegramFormattedModel.js.map