"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CustomerModel = new mongoose_1.Schema({
    company_name: {
        type: String,
        required: true,
        default: false
    },
    type_of_customer: {
        type: String,
        required: true,
        default: false
    },
    customer: {
        type: String,
        required: true,
        default: false,
    }
});
exports.default = (0, mongoose_1.model)('customers', CustomerModel);
//# sourceMappingURL=CustomerModel.js.map