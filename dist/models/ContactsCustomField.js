"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
const ContactsCustomField = new mongoose_1.Schema({
    name: {
        type: String,
        required: false,
    },
    value: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
    selected_value: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    AccountSid: {
        type: String,
        required: false,
    },
    modules: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },
    key: {
        type: String,
        required: false
    }
});
exports.default = (0, mongoose_1.model)('contact_custom_field', ContactsCustomField);
//# sourceMappingURL=ContactsCustomField.js.map