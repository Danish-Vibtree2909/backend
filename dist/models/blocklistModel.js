"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BlocklistModel = new mongoose_1.Schema({
    authId: {
        type: String,
        required: false
    },
    number: {
        type: String,
        required: false
    }
});
exports.default = (0, mongoose_1.model)('blocklist', BlocklistModel);
//# sourceMappingURL=blocklistModel.js.map