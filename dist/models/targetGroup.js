"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TargetGroupModel = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    target_ids: [{
            type: String,
            required: false
        }],
    target_group_id: {
        type: String,
        required: false
    }
});
exports.default = (0, mongoose_1.model)('targetGroup', TargetGroupModel);
//# sourceMappingURL=targetGroup.js.map