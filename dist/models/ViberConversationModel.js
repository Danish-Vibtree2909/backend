"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ViberConversationModel = new mongoose_1.Schema({
    conversation_id: {
        type: String,
        required: false,
    },
    assignedToBot: {
        type: Boolean,
        required: true,
        default: true
    },
    user_id: {
        type: String,
        required: false,
    },
    chat_hostname: {
        type: String,
        required: false,
    },
    participants: [
        {
            user_id: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'contacts',
            },
            user_name: {
                type: String,
                required: false,
            },
            user_image: {
                type: String,
                required: false,
            },
            number: {
                type: String,
                required: false,
            }
        }
    ],
    type: {
        type: String,
        required: false,
    },
    messages: [
        {
            type: mongoose_1.Schema.Types.Mixed,
            required: false,
        }
    ],
    unreadCount: {
        type: Number,
        required: false,
        default: 0,
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
    ticketId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'tickets_list',
        required: false
    }
});
exports.default = (0, mongoose_1.model)('viber_conversation', ViberConversationModel);
//# sourceMappingURL=ViberConversationModel.js.map