"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVibconnect = exports.getVibconnect = void 0;
const vibconnectModel_1 = __importDefault(require("../models/vibconnectModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getVibconnect(queryParams) {
    const filterQuery = { ...queryParams };
    const excludeApiFields = [
        "page",
        "sort",
        "limit",
        "fields",
        "offset",
        "populate",
    ];
    excludeApiFields.forEach((e) => delete filterQuery[e]);
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await vibconnectModel_1.default
        .find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getVibconnect = getVibconnect;
async function createVibconnect(data) {
    try {
        const vibconnect = new vibconnectModel_1.default(data);
        const response = vibconnect.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`error in creating vibcoonect model : ${err}`);
        return false;
    }
}
exports.createVibconnect = createVibconnect;
//# sourceMappingURL=vibconnectModel.js.map