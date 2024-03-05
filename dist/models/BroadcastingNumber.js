"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BroadcastingSchema = new mongoose_1.Schema({
    number: {
        type: String,
        required: false
    },
    count: {
        type: Number,
        required: false
    }
});
exports.default = (0, mongoose_1.model)('broadcasting_number', BroadcastingSchema);
//# sourceMappingURL=BroadcastingNumber.js.map