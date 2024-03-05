"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const IDEModel = new mongoose_1.Schema({
    sid: {
        type: String,
        required: true,
        default: false
    },
    username: {
        type: String,
        required: true,
        default: false
    },
    notes: {
        type: String,
        required: true,
        default: false
    },
    tags: {
        type: String,
        required: true,
        default: false
    },
    dialedNo: {
        type: String,
        required: true,
        default: false
    },
    cloudNumber: {
        type: String,
        required: true,
        default: false
    }
});
exports.default = (0, mongoose_1.model)('ide', IDEModel, 'inbox_details_extendeds');
//# sourceMappingURL=inboxDetailExtended.js.map