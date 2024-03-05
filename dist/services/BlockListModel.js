"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByIdBlocklist = exports.findByIdAndDeleteBlocklist = exports.findByIdAndUpdateBlockList = exports.createBlockList = exports.countDocumentBlockList = exports.getAllBlockList = void 0;
const blocklistModel_1 = __importDefault(require("../models/blocklistModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getAllBlockList(queryParams) {
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
    const data = await blocklistModel_1.default.find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getAllBlockList = getAllBlockList;
async function countDocumentBlockList(queryParams, userDetails) {
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
    const data = await blocklistModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countDocumentBlockList = countDocumentBlockList;
async function createBlockList(data) {
    try {
        const mongoObj = new blocklistModel_1.default(data);
        const response = await mongoObj.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating BlocklistModel : `);
        logger_1.default.error(err);
        return err;
    }
}
exports.createBlockList = createBlockList;
async function findByIdAndUpdateBlockList(query, updates, options) {
    try {
        const updatedBlockList = await blocklistModel_1.default.findByIdAndUpdate(query, updates, options);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error("error in updating BlocklistModel : ");
        logger_1.default.error(err);
        return false;
    }
}
exports.findByIdAndUpdateBlockList = findByIdAndUpdateBlockList;
async function findByIdAndDeleteBlocklist(query) {
    try {
        const updatedBlockList = await blocklistModel_1.default.findByIdAndDelete(query);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error("error in deleting BlocklistModel : ");
        logger_1.default.error(err);
        return false;
    }
}
exports.findByIdAndDeleteBlocklist = findByIdAndDeleteBlocklist;
async function getByIdBlocklist(id, queryParams) {
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await blocklistModel_1.default
        .findById(id)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getByIdBlocklist = getByIdBlocklist;
//# sourceMappingURL=BlockListModel.js.map