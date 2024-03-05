"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PowerDialerModel = new mongoose_1.Schema({
    authId: {
        type: String,
        required: false,
    },
    authSecret: {
        type: String,
        required: false
    },
    contactId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'contact'
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    callStatus: {
        type: String,
        required: true,
        default: "New"
    },
    callSid: {
        type: String,
        required: false
    },
    contactNumber: {
        type: String,
        required: false
    }
});
exports.default = (0, mongoose_1.model)('power_dialer', PowerDialerModel);
//# sourceMappingURL=powerDialerModel.js.map