"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TicketModel = new mongoose_1.Schema({
    subject: {
        type: String,
        required: false
    },
    customer: {
        type: String,
        required: false
    },
    // project: {
    //   type: String,
    //   required: false
    // },
    application: {
        type: String,
        required: false
    },
    assigned_to: {
        type: String,
        required: false
    },
    assigned_user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user'
    },
    ticket_id: {
        type: String,
        required: false
    },
    messages: {
        type: mongoose_1.Schema.Types.Array,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    published_at: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        required: false
    },
    updatedAt: {
        type: Date,
        required: false
    },
    attachments: {
        type: String,
        required: false
    }
});
exports.default = (0, mongoose_1.model)('tickets', TicketModel);
//# sourceMappingURL=TicketModel.js.map