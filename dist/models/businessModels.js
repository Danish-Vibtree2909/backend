"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BusinessHourModel = new mongoose_1.Schema({
    authId: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'user'
    },
    data: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false
    }
});
exports.default = (0, mongoose_1.model)('businesshour', BusinessHourModel);
//# sourceMappingURL=businessModels.js.map