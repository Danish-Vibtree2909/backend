"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TicketsModel = new mongoose_1.Schema({
    AccountSid: {
        type: String,
        required: false
    },
    user_id: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'user',
            required: false
        }
    ],
    ticket_id: {
        type: String,
        required: false
    },
    ticket_details: {
        type: String,
        required: false
    },
    status: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    created_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contact',
        required: false
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
    conversations: {
        voice: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'ivr_flow',
                required: false
            }],
        telegram: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'telegram_conversation',
                required: false
            }],
        messenger: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'formatted_pages_post',
                required: false
            }],
        viber: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'viber_conversation',
                required: false
            }],
        comments: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'formatted_pages_post',
                required: false
            }],
        instagram: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'formatted_insta_pages_post',
                required: false
            }],
        whatsapp: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'whatsapp_conversation',
                required: false
            }],
        sms: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'sms',
                required: false
            }],
    },
    CustomVariables: [
        {
            name: {
                type: String,
                required: false,
            },
            value: {
                type: mongoose_1.Schema.Types.Mixed,
                required: false,
            },
            type: {
                type: String,
                required: false,
            },
            selected_value: {
                type: String,
                required: false,
            }
        }
    ],
    TicketFor: {
        type: String,
        required: false
    },
    ParentCallSid: {
        type: String,
        required: false
    },
    TimeLine: [
        {
            text: {
                type: String,
                required: false
            },
            created_by: {
                type: String,
                required: false
            },
            updated_at: {
                type: Date,
                default: () => Date.now(),
            }
        }
    ]
});
exports.default = (0, mongoose_1.model)('tickets_list', TicketsModel);
//# sourceMappingURL=TicketListModel.js.map