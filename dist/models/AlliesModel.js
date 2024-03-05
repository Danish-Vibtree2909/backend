"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AlliesModel = new mongoose_1.Schema({
    partner: {
        type: String,
        required: true
    },
    data: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    }
});
exports.default = (0, mongoose_1.model)('allies', AlliesModel);
//# sourceMappingURL=AlliesModel.js.map