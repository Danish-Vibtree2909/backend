"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOneGroupsById = exports.updateGroupsById = exports.createGroups = exports.getGroupsById = exports.countGroupsDocuments = exports.getGroups = void 0;
const { groupModel } = require("../models/ContactsModel");
const logger_1 = __importDefault(require("../config/logger"));
async function getGroups(queryParams) {
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
    const data = await groupModel
        .find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getGroups = getGroups;
async function countGroupsDocuments(queryParams, userDetails) {
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
    const data = await groupModel.countDocuments({ ...filterQuery });
    return data;
}
exports.countGroupsDocuments = countGroupsDocuments;
async function getGroupsById(id, queryParams) {
    const data = await groupModel
        .findById(id)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getGroupsById = getGroupsById;
async function createGroups(data) {
    try {
        const contact = new groupModel(data);
        const response = await contact.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in groupModel contact : ${err}`);
        return false;
    }
}
exports.createGroups = createGroups;
async function updateGroupsById(query, updates, options) {
    try {
        const updatedData = await groupModel.findByIdAndUpdate(query, updates, options);
        return updatedData;
    }
    catch (err) {
        logger_1.default.error(`Error in groupModel update : ${err}`);
        return false;
    }
}
exports.updateGroupsById = updateGroupsById;
async function deleteOneGroupsById(id) {
    try {
        const myQuery = { _id: id };
        const contactDeletedData = await groupModel.deleteOne(myQuery);
        return contactDeletedData;
    }
    catch (err) {
        logger_1.default.error(`Error in deleting one group : ${err}`);
        return false;
    }
}
exports.deleteOneGroupsById = deleteOneGroupsById;
//# sourceMappingURL=groupModel.js.map