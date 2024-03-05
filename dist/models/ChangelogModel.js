"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChangelogModel = new mongoose_1.Schema({
    version: {
        type: String,
        required: true,
        default: false
    },
    type_of_changes: {
        type: String,
        required: true,
        default: false
    },
    description: {
        type: String,
        required: true,
        default: false
    },
    date_of_changes: {
        type: String,
        required: true,
        default: false
    },
    product: {
        type: String,
        required: true,
        default: false
    },
    teast: {
        type: String,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: false,
    },
});
exports.default = (0, mongoose_1.model)('changelogs', ChangelogModel);
//# sourceMappingURL=ChangelogModel.js.map