"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserStatusModel = new mongoose_1.Schema({
    authId: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'user',
        unique: true
    },
    status: {
        type: String,
        required: false,
        lowercase: true,
        default: 'available'
    }
});
exports.default = (0, mongoose_1.model)('user_status', UserStatusModel);
//# sourceMappingURL=userStatusModel.js.map