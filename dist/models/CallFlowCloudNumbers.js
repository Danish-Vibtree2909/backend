"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    number: {
        type: String,
        required: true,
        default: null
    },
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
    nodeId: {
        type: String,
        required: true,
        default: null
    },
    callFlow: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'call_flows'
    }
});
exports.default = (0, mongoose_1.model)('call_flows_cloud_numbers', schema);
//# sourceMappingURL=CallFlowCloudNumbers.js.map