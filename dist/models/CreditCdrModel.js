"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CreditCdrModel = new mongoose_1.Schema({
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    companyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'companies',
        required: false
    },
    smsId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'sms_message',
        required: false
    },
    callId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ivr_flow',
        required: false
    },
    source: {
        type: String,
        required: false
    },
    amount: {
        type: Number,
        required: false
    },
    numberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'number',
        required: false
    }
});
exports.default = (0, mongoose_1.model)('credit_cdr', CreditCdrModel);
//# sourceMappingURL=CreditCdrModel.js.map