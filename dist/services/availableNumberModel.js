"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAvailableNumbers = exports.countAvailableNumbers = exports.getAvailableNumbers = void 0;
const availableNumbers_1 = __importDefault(require("../models/availableNumbers"));
const logger_1 = __importDefault(require("../config/logger"));
async function getAvailableNumbers(queryParams) {
    const filterQuery = { ...queryParams };
    const excludeApiFields = [
        "page",
        "sort",
        "limit",
        "fields",
        "offset",
        "populate",
        "stateName",
    ];
    excludeApiFields.forEach((e) => delete filterQuery[e]);
    console.log("Query service : ", filterQuery, queryParams);
    const data = await availableNumbers_1.default.find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getAvailableNumbers = getAvailableNumbers;
async function countAvailableNumbers(queryParams, userDetails) {
    const filterQuery = { ...queryParams };
    const excludeApiFields = [
        "page",
        "sort",
        "limit",
        "fields",
        "offset",
        "populate",
        "stateName"
    ];
    excludeApiFields.forEach((e) => delete filterQuery[e]);
    //console.log("Query service : ", filterQuery);
    const data = await availableNumbers_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countAvailableNumbers = countAvailableNumbers;
async function deleteAvailableNumbers(query) {
    try {
        const deletedNumberDetails = await availableNumbers_1.default.deleteOne(query);
        return deletedNumberDetails;
    }
    catch (err) {
        logger_1.default.error(`Error while deleting number from available number : ${err}`);
        return false;
    }
}
exports.deleteAvailableNumbers = deleteAvailableNumbers;
//# sourceMappingURL=availableNumberModel.js.map