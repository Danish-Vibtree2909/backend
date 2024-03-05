"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TicketSettingsModel = new mongoose_1.Schema({
    AccountSid: {
        type: String,
        required: false
    },
    ticket_status: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    ticket_prefix: {
        type: String,
        required: false
    },
    ticket_last_created: {
        type: String,
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
});
exports.default = (0, mongoose_1.model)('ticket_settings', TicketSettingsModel);
//# sourceMappingURL=ticketSettingsModels.js.map