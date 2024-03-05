"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WhatsappConversationModel = new mongoose_1.Schema({
    conversation_id: {
        type: String,
        required: false,
    },
    assignedToBot: {
        type: Boolean,
        required: false,
        default: true
    },
    doWeAskForCoupon: {
        type: Boolean,
        required: false,
        default: false
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
exports.default = (0, mongoose_1.model)('whatsapp_conversation', WhatsappConversationModel);
//# sourceMappingURL=WhatsappConversationModel.js.map