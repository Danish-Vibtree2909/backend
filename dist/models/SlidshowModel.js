"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Slid = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        default: false
    },
    description: {
        type: String,
        required: true,
        default: false
    },
    product: {
        type: String,
        required: true,
        default: false,
    },
    url: {
        type: mongoose_1.Schema.Types.Array,
        required: false,
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
exports.default = (0, mongoose_1.model)('slidshows', Slid);
//# sourceMappingURL=SlidshowModel.js.map