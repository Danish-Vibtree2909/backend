"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TableModel = new mongoose_1.Schema({
    AccountSid: {
        type: String,
        required: false
    },
    UserId: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'user',
            required: false
        }
    ],
    companyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'companies',
        required: false
    },
    InboxName: {
        type: String,
        required: false
    },
    InboxIcon: {
        type: String,
        required: false
    },
    InboxType: {
        type: String,
        required: false
    },
    Status: {
        type: String,
        required: false,
        default: "active"
    },
    created_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    view_type: {
        type: String,
        required: false,
        default: "All"
    },
    allowed_permission: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    data: [
        {
            type: mongoose_1.Schema.Types.Mixed,
            required: false,
        }
    ],
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
exports.default = (0, mongoose_1.model)('inbox_view', TableModel);
//# sourceMappingURL=InboxModel.js.map