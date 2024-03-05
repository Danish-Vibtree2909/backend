"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AgencyModel = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        default: false
    },
    phone: {
        type: String,
        required: true,
        default: false
    },
    firstname: {
        type: String,
        required: true,
        default: false
    },
    lastname: {
        type: String,
        required: true,
        default: false
    },
    agencyname: {
        type: String,
        required: true,
        default: false
    },
    state: {
        type: String,
        required: true,
        default: false
    },
    city: {
        type: String,
        required: true,
        default: false
    },
    zipcode: {
        type: String,
        required: true,
        default: false
    },
    country: {
        type: String,
        required: true,
        default: false
    }
});
exports.default = (0, mongoose_1.model)('agencies', AgencyModel);
//# sourceMappingURL=Agency.js.map