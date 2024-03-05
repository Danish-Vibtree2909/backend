"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const vibconnectModel = new mongoose_1.Schema({
    authId: {
        type: String,
        required: false
    },
    authSecret: {
        type: String,
        required: false
    },
    applicationId: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'user'
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'user'
    },
    companyId: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
});
exports.default = (0, mongoose_1.model)('vibconnect', vibconnectModel);
//# sourceMappingURL=vibconnectModel.js.map