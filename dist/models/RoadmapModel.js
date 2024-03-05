"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RoadmapModel = new mongoose_1.Schema({
    date: {
        type: String,
        required: true,
        default: false
    },
    title: {
        type: String,
        required: true,
        default: false
    },
    description: {
        type: String,
        required: true,
        default: false,
    },
    product: {
        type: String,
        required: true,
        default: false,
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
exports.default = (0, mongoose_1.model)('roadmaps', RoadmapModel);
//# sourceMappingURL=RoadmapModel.js.map