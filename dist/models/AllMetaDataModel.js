"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AllMetaDataModel = new mongoose_1.Schema({
    object: {
        type: String,
        required: true,
    },
    entry: [
        {
            type: mongoose_1.Schema.Types.Mixed,
            required: false,
        }
    ]
});
exports.default = (0, mongoose_1.model)('allMetaDataModel', AllMetaDataModel);
//# sourceMappingURL=AllMetaDataModel.js.map