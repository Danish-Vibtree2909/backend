"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VoiceMailBoxSchema = new mongoose_1.Schema({
    Name: {
        type: String,
        required: false,
    },
    AuthId: {
        type: String,
        required: false,
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
exports.default = (0, mongoose_1.model)('VoiceMailBox', VoiceMailBoxSchema);
//# sourceMappingURL=VoiceMailBoxModel.js.map