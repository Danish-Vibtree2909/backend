"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    authId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users-permissions_user'
    },
    number: {
        type: String,
        required: true,
        default: null
    },
    country: {
        code: {
            type: String,
            required: false,
            default: null
        },
        label: {
            type: String,
            required: false,
            default: null
        },
        phone: {
            type: Number,
            required: false,
            default: null
        }
    },
    status: {
        type: String,
        enum: ['verified', 'not-verified'],
        default: 'not-verified',
        required: false
    },
    cancel: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('my_numbers', schema);
//# sourceMappingURL=myNumbers.js.map