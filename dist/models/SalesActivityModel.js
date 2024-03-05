"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = require('mongoose');
const SalesActivitySchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: false
    },
    contact_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'leads',
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    notes: {
        type: String,
        required: false
    }
});
exports.default = (0, mongoose_1.model)('sales_activity', SalesActivitySchema);
//# sourceMappingURL=SalesActivityModel.js.map