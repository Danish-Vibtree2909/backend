"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MetaPagesPostModel = new mongoose_1.Schema({
    data: [{
            created_time: {
                type: Date,
                required: false
            },
            story: {
                type: String,
                required: false
            },
            id: {
                type: String,
                required: false
            },
            message: {
                type: String,
                required: false
            }
        }
    ],
    paging: {
        cursors: {
            before: {
                type: String,
                required: false
            },
            after: {
                type: String,
                required: false
            }
        },
        next: {
            type: String,
            required: false
        }
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
exports.default = (0, mongoose_1.model)('meta_page_posts', MetaPagesPostModel);
//# sourceMappingURL=MetaPagesPostModel.js.map