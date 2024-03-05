"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VoipModel = new mongoose_1.Schema({
    user_id: {
        type: String,
        required: true,
        default: null
    },
    say: {
        options: mongoose_1.Schema.Types.ObjectId,
        value: {
            type: String,
            required: false,
            default: null
        }
    },
    play: {
        options: mongoose_1.Schema.Types.ObjectId,
        value: {
            type: String,
            required: false,
            default: null
        }
    },
    dial: {
        options: { type: mongoose_1.Schema.Types.ObjectId, ref: 'dial' },
        value: {
            type: String,
            required: false,
            default: null
        }
    },
    record: {
        value: {
            type: String,
            required: false,
            default: null
        },
        options: mongoose_1.Schema.Types.ObjectId
    },
    gather: {
        value: {
            type: String,
            required: false,
            default: null
        },
        options: mongoose_1.Schema.Types.ObjectId
    },
    hangup: {
        type: Boolean,
        required: false,
        default: null
    },
    pause: {
        options: mongoose_1.Schema.Types.ObjectId,
        value: {
            type: String,
            required: false,
            default: null
        }
    },
    redirect: {
        options: mongoose_1.Schema.Types.ObjectId,
        value: {
            type: String,
            required: false,
            default: null
        }
    },
    reject: {
        value: mongoose_1.Schema.Types.ObjectId,
        options: {
            type: String,
            required: false,
            default: null
        }
    },
    number: {
        options: mongoose_1.Schema.Types.ObjectId,
        value: {
            type: String,
            required: false,
            default: null
        }
    },
    sip: {
        options: mongoose_1.Schema.Types.ObjectId
    }
});
exports.default = (0, mongoose_1.model)('xmlGenerate', VoipModel);
//# sourceMappingURL=xmlModel.js.map