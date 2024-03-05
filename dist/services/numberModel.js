"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNumber = exports.countNumberDocuments = exports.getNumbers = void 0;
const numbers_1 = __importDefault(require("../models/numbers"));
const logger_1 = __importDefault(require("../config/logger"));
async function getNumbers(queryParams) {
    const filterQuery = { ...queryParams };
    const excludeApiFields = [
        "page",
        "sort",
        "limit",
        "fields",
        "offset",
        "populate",
    ];
    //@ts-ignore
    excludeApiFields.forEach((e) => delete filterQuery[e]);
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await numbers_1.default
        .find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getNumbers = getNumbers;
async function countNumberDocuments(queryParams, userDetails) {
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
    //console.log("Query service : ", filterQuery);
    const data = await numbers_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countNumberDocuments = countNumberDocuments;
async function createNumber(data) {
    try {
        const new_number = new numbers_1.default({ ...data });
        const response = await new_number.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating Number after purchasing  : ${err}`);
        return false;
    }
}
exports.createNumber = createNumber;
//# sourceMappingURL=numberModel.js.map