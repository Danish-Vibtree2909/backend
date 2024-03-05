"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FormattedPagesPostModel = new mongoose_1.Schema({
    AccountSid: {
        type: String,
        required: false,
    },
    pageId: {
        type: String,
        required: false,
    },
    postId: {
        type: String,
        required: false
    },
    description: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    reactions: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    comments: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    createdAt: {
        type: Date,
        required: false,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        required: false,
        default: new Date()
    }
});
exports.default = (0, mongoose_1.model)('formatted_pages_post', FormattedPagesPostModel);
//# sourceMappingURL=FormattedPagesPostModel.js.map