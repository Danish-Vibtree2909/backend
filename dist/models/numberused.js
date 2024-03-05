"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NumbersUsedFor = new mongoose_1.Schema({
    number: {
        type: mongoose_1.Schema.Types.String,
        default: null,
        required: true
    },
    auth_id: {
        type: mongoose_1.Schema.Types.String,
        default: null,
        required: true
    },
    usedFor: {
        type: mongoose_1.Schema.Types.String,
        enum: ['line_forward', 'call_flows', 'cloud_phone', 'call_tracking'],
        default: 'line_forward',
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users-permissions_user'
    }
});
exports.default = (0, mongoose_1.model)('number_used_for', NumbersUsedFor, 'numbers_used_for');
//# sourceMappingURL=numberused.js.map