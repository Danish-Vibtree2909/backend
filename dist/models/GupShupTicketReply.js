"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GupShupTicketTypeModel = new mongoose_1.Schema({
    id: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    details: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    ticket_id: {
        type: String,
        required: false
    },
    tkt_obj_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'tickets_list',
    },
    cityHead: {
        type: String,
        required: false
    },
});
exports.default = (0, mongoose_1.model)('ticket_reply', GupShupTicketTypeModel);
//# sourceMappingURL=GupShupTicketReply.js.map