"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CompanyModel = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    gst_number: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    pan_no: {
        type: String,
        required: false
    },
    industry: {
        type: String,
        required: false
    },
    company_size: {
        type: String,
        required: false
    },
    company_logo: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    linkedin: {
        type: String,
        required: false,
    },
    grade: {
        type: String,
        required: false,
    },
    isActive: {
        type: Boolean,
        required: false,
    },
    shipping_address: {
        building_name: {
            type: String,
            required: false,
            default: null
        },
        street: {
            type: String,
            required: false,
            default: null
        },
        city: {
            type: String,
            required: false,
            default: null
        },
        state: {
            type: String,
            required: false,
            default: null
        },
        zipcode: {
            type: String,
            required: false,
            default: null
        },
        country: {
            type: String,
            required: false,
            default: null
        }
    },
    billing_address: {
        building_name: {
            type: String,
            required: false,
            default: null
        },
        street: {
            type: String,
            required: false,
            default: null
        },
        city: {
            type: String,
            required: false,
            default: null
        },
        state: {
            type: String,
            required: false,
            default: null
        },
        zipcode: {
            type: String,
            required: false,
            default: null
        },
        country: {
            type: String,
            required: false,
            default: null
        }
    },
    notes: {
        type: String,
        required: false
    },
    documents: [
        {
            type: String,
            required: false
        }
    ],
    type: {
        type: String,
        required: false
    },
    activated_service: {
        type: String,
        required: false
    },
    is_phone_verified: {
        type: Boolean,
        required: false
    },
    is_email_verified: {
        type: Boolean,
        required: false
    },
    documentStatus: [{
            status: {
                type: String,
                required: false
            },
            reason: {
                type: String,
                required: false
            }
        }],
    contact_name: {
        type: String,
        required: false
    }
});
exports.default = (0, mongoose_1.model)('companies', CompanyModel);
//# sourceMappingURL=companyModel.js.map