"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CouponModel = new mongoose_1.Schema({
    value: {
        type: String,
        required: true
    },
    is_used: {
        type: Boolean,
        required: false,
        default: true
    },
    used_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'user',
    },
    used_at: {
        type: Date,
        required: false,
    },
    used_time: {
        type: String,
        required: false
    }
});
exports.default = (0, mongoose_1.model)('coupon', CouponModel);
//# sourceMappingURL=CouponModel.js.map