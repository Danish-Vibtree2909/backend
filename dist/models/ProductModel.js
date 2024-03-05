"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProductModel = new mongoose_1.Schema({
    product_name: {
        type: String
    },
    product_image: {
        type: mongoose_1.Schema.Types.Array,
        required: false,
    },
    description: {
        type: String
    },
    grid_color: {
        type: Boolean,
        required: false,
        default: false
    },
    product_number: {
        type: Number,
        required: false
    },
    product_users: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'user'
        }]
});
exports.default = (0, mongoose_1.model)('products', ProductModel);
//# sourceMappingURL=ProductModel.js.map