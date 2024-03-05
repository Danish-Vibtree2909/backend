"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StoreTypeModel = new mongoose_1.Schema({
    erpCode: {
        type: String,
        required: false
    },
    brand: {
        type: String,
        required: false
    },
    storeName: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    zone: {
        type: String,
        required: false
    },
    storeManager: {
        type: String,
        required: false
    },
    cityHead: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    enterpriceUsername: {
        type: String,
        required: false
    },
    enterpricePassword: {
        type: String,
        required: false
    },
    //business id for sending feedback to famepilot
    businessUuid: {
        type: String,
        required: false
    },
    // branchCode for famepilot
    branchCodeForFeedBack: {
        type: String,
        required: false
    },
});
exports.default = (0, mongoose_1.model)('store', StoreTypeModel);
//# sourceMappingURL=StoreModel.js.map