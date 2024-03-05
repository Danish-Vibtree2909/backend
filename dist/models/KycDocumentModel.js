"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const KycDocumentModel = new mongoose_1.Schema({
    user_id: {
        type: String,
        required: true,
        default: false
    },
    company_type: {
        type: String,
        required: true,
        default: false
    },
    documents: [{
            fileLocation: {
                type: String,
                required: false
            },
            document_type: {
                type: String,
                required: false
            },
            status: {
                type: String,
                required: false
            },
            rejected_reason: {
                type: String,
                required: false
            }
        }],
    createdAt: {
        type: String,
        required: false
    },
    updatedAt: {
        type: String,
        required: false
    }
});
exports.default = (0, mongoose_1.model)('kycdocuments', KycDocumentModel);
//# sourceMappingURL=KycDocumentModel.js.map