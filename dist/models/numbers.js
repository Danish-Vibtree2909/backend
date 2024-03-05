"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Numbers = new mongoose_1.Schema({
    name: {
        type: String,
        required: false,
        default: '',
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
    },
    country_code: {
        type: String,
        required: false,
        default: null
    },
    country_iso: {
        type: String,
        required: false,
        default: null
    },
    type: {
        type: String,
        required: false,
        default: null
    },
    capability: {
        type: String,
        required: false,
        default: null
    },
    mrc: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: false,
        default: null
    },
    nrc: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: false,
        default: null
    },
    rps: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: false,
        default: null
    },
    initial_pulse: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: false,
        default: null
    },
    sub_pulse: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: false,
        default: null
    },
    acc_id: {
        type: String,
        required: false,
        default: null
    },
    application_id: {
        type: String,
        required: false,
        default: null
    },
    status: {
        type: String,
        required: false,
        default: null
    },
    carrier_id: {
        type: String,
        required: false,
        default: null
    },
    purchased_time: {
        type: mongoose_1.Schema.Types.Date,
        required: false,
        default: null
    }
});
exports.default = (0, mongoose_1.model)('number', Numbers, 'numbers');
//# sourceMappingURL=numbers.js.map