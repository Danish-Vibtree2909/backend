"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SaveModel = new mongoose_1.Schema({
    connected: {
        code: {
            type: Number,
            required: true,
            default: null
        },
        phone: {
            type: Number,
            required: true,
            default: null
        }
    },
    joined: {
        type: String,
        required: true,
        default: null
    },
    forwardTo: {
        countryCode: {
            code: {
                type: String,
                required: true,
                default: null
            },
            label: {
                type: String,
                required: true,
                default: null
            },
            phone: {
                type: Number,
                required: true,
                default: null
            }
        },
        lineNumber: {
            type: Number,
            required: true,
            default: null
        },
        user_id: {
            type: String,
            required: false
        }
    },
    TextForwarding: {
        type: Boolean,
        required: true,
        default: null
    },
    CallRecording: {
        type: Boolean,
        required: true,
        default: null
    },
    ShowCallerId: {
        type: Boolean,
        required: true,
        default: null
    },
    url: {
        type: String,
        required: false,
    },
    greetings: {
        audio: {
            type: String,
            required: true,
            default: null
        },
        type: {
            type: String,
            required: true,
            default: null
        }
    },
    waitUrl: {
        type: String,
        required: false,
    },
    waitUrlText: {
        type: String,
        required: false,
    },
    waitUrlSource: {
        type: String,
        required: false,
    },
    pollyType: {
        type: String,
        required: false,
    }
});
exports.default = (0, mongoose_1.model)('SavedNumbers', SaveModel);
//# sourceMappingURL=saveModel.js.map