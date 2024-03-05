"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByIdCustomField = exports.findByIdAndDeleteCustomField = exports.findByIdAndUpdateCustomField = exports.findOneCustomeVariable = exports.createCustomField = exports.countCustomField = exports.getAllCustomField = void 0;
const ContactsCustomField_1 = __importDefault(require("../models/ContactsCustomField"));
const logger_1 = __importDefault(require("../config/logger"));
async function getAllCustomField(queryParams) {
    try {
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
        const data = await ContactsCustomField_1.default.find({ ...filterQuery })
            .limit(Number(queryParams.limit))
            .skip(Number(queryParams.offset))
            .sort(queryParams.sort)
            .select(queryParams.fields)
            .populate(queryParams.populate);
        return data;
    }
    catch (err) {
        logger_1.default.error(`Error in fetching custom variable : `, err);
        return false;
    }
}
exports.getAllCustomField = getAllCustomField;
async function countCustomField(queryParams, userDetails) {
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
    const data = await ContactsCustomField_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countCustomField = countCustomField;
async function createCustomField(data) {
    try {
        const CustomField = new ContactsCustomField_1.default(data);
        const response = await CustomField.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating CustomField : ${err}`);
        return false;
    }
}
exports.createCustomField = createCustomField;
async function findOneCustomeVariable(queryParams) {
    try {
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
        const data = await ContactsCustomField_1.default.findOne({ ...filterQuery })
            .select(queryParams.fields)
            .populate(queryParams.populate);
        return data;
    }
    catch (err) {
        logger_1.default.error(`Error in finding one custom variable : `, err);
        return false;
    }
}
exports.findOneCustomeVariable = findOneCustomeVariable;
async function findByIdAndUpdateCustomField(id, updates, options) {
    try {
        const response = await ContactsCustomField_1.default.findByIdAndUpdate(id, updates, { new: true, ...options });
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in updating custom fields : ${id} : ${err}`);
        return false;
    }
}
exports.findByIdAndUpdateCustomField = findByIdAndUpdateCustomField;
async function findByIdAndDeleteCustomField(id) {
    try {
        const response = await ContactsCustomField_1.default.findByIdAndDelete(id);
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in deleting custom fields : ${id} : ${err}`);
        return false;
    }
}
exports.findByIdAndDeleteCustomField = findByIdAndDeleteCustomField;
async function findByIdCustomField(id) {
    try {
        const response = await ContactsCustomField_1.default.findById(id);
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in fetching by id custom field : ${id} : ${err}`);
        return false;
    }
}
exports.findByIdCustomField = findByIdCustomField;
//# sourceMappingURL=customFieldModel.js.map