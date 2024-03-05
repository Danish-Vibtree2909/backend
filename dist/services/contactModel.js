"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneContact = exports.insertManyContacts = exports.deleteManyContacts = exports.deleteOneContactById = exports.updateContactById = exports.createContact = exports.getContactById = exports.countContactDocuments = exports.getContacts = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const { contactModel } = require("../models/ContactsModel");
async function getContacts(queryParams) {
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
    const data = await contactModel
        .find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getContacts = getContacts;
async function countContactDocuments(queryParams, userDetails) {
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
    const data = await contactModel.countDocuments({ ...filterQuery });
    return data;
}
exports.countContactDocuments = countContactDocuments;
async function getContactById(id, queryParams) {
    const data = await contactModel
        .findById(id)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getContactById = getContactById;
async function createContact(data) {
    try {
        const contact = new contactModel(data);
        const response = await contact.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating contact : ${err}`);
        return false;
    }
}
exports.createContact = createContact;
async function updateContactById(query, updates, options) {
    try {
        const updatedData = await contactModel.findByIdAndUpdate(query, updates, options);
        return updatedData;
    }
    catch (err) {
        logger_1.default.error(`Error in updating : ${err}`);
        return false;
    }
}
exports.updateContactById = updateContactById;
async function deleteOneContactById(id) {
    try {
        const myQuery = { _id: id };
        const contactDeletedData = await contactModel.deleteOne(myQuery);
        return contactDeletedData;
    }
    catch (err) {
        logger_1.default.error(`Error in deleting one contact : ${err}`);
        return false;
    }
}
exports.deleteOneContactById = deleteOneContactById;
async function deleteManyContacts(query) {
    try {
        const contactDeletedData = await contactModel.deleteMany({ ...query });
        return contactDeletedData;
    }
    catch (err) {
        logger_1.default.error(`Error in deleting many contact : ${err}`);
        return false;
    }
}
exports.deleteManyContacts = deleteManyContacts;
async function insertManyContacts(query) {
    try {
        const contactbulkWriteData = await contactModel.bulkWrite(query);
        return contactbulkWriteData;
    }
    catch (err) {
        logger_1.default.error(`Error in deleting many contact : ${err}`);
        return false;
    }
}
exports.insertManyContacts = insertManyContacts;
async function getOneContact(queryParams) {
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
    const data = await contactModel
        .findOne({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getOneContact = getOneContact;
//# sourceMappingURL=contactModel.js.map