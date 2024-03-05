"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppModel = new mongoose_1.Schema({
    auth_id: {
        type: String,
        required: false
    },
    app_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'app_config',
    },
    active_on: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    active_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'user',
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
exports.default = (0, mongoose_1.model)('app', AppModel);
//# sourceMappingURL=AppModel.js.map