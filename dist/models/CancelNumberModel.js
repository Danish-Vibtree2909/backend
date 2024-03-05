"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CancelNumberModel = new mongoose_1.Schema({
    auth_id: {
        type: String,
        required: false
    },
    number: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    purchasedDate: {
        type: Date,
        required: false
    },
    canceledNumber: {
        type: Date,
        required: true,
        default: Date.now
    },
});
exports.default = (0, mongoose_1.model)('canceled_number', CancelNumberModel);
//# sourceMappingURL=CancelNumberModel.js.map