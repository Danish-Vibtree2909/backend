"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const fileModel = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    saved_as: {
        type: String,
        required: true
    }
});
exports.default = (0, mongoose_1.model)('file', fileModel);
//# sourceMappingURL=file.js.map