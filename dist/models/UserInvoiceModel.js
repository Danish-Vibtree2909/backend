"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserInvoiceModel = new mongoose_1.Schema({
    referenceId: {
        type: String,
        required: true,
        default: false,
    },
    invoiceId: {
        type: String,
        required: true,
        default: false,
    },
    invoiceUrl: {
        type: String,
        required: true,
        default: false,
    },
    mode: {
        type: String,
        required: true,
        default: false,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user'
    },
});
exports.default = (0, mongoose_1.model)('user_invoices', UserInvoiceModel);
//# sourceMappingURL=UserInvoiceModel.js.map