"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserActivity = new mongoose_1.Schema({
    auth_id: {
        type: String,
        required: false
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    type: {
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
exports.default = (0, mongoose_1.model)('user_activities', UserActivity);
//# sourceMappingURL=UserActivityModel.js.map