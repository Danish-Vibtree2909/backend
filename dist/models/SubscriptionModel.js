"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SubscriptionModel = new mongoose_1.Schema({
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    package: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    credits: {
        type: Number,
        required: false,
        min: [0, 'No -ve numbers']
    },
    total_number: {
        type: Number,
        required: false,
        default: 1
    },
    users_allowed: {
        type: Number,
        required: false,
        default: 1
    },
    features: [{
            name: {
                type: String,
                required: true
            },
            allowed: {
                type: Boolean,
                required: false,
                default: false
            },
            total_consumed: {
                type: Number,
                required: false
            },
            total_allowed: {
                type: Number,
                required: false
            }
        }],
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'user',
    },
    companyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'companies',
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    startDate: {
        type: Date,
        default: () => Date.now()
    },
    endDate: {
        type: Date,
        default: () => Date.now()
    },
    isExpired: {
        type: Boolean,
        required: false,
        default: false
    },
    paymentId: {
        type: String,
        required: false
    },
    isFuturePlan: {
        type: Boolean,
        required: false,
        default: false
    }
});
exports.default = (0, mongoose_1.model)('subscription', SubscriptionModel);
//# sourceMappingURL=SubscriptionModel.js.map