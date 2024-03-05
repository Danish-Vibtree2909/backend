"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneInbox = exports.deleteOneInboxById = exports.updateInboxById = exports.createInbox = exports.getInboxById = exports.countInboxDocuments = exports.getInboxes = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const InboxModel_1 = __importDefault(require("../models/InboxModel"));
async function getInboxes(queryParams) {
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
    const data = await InboxModel_1.default
        .find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getInboxes = getInboxes;
async function countInboxDocuments(queryParams, userDetails) {
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
    const data = await InboxModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countInboxDocuments = countInboxDocuments;
async function getInboxById(id, queryParams) {
    const data = await InboxModel_1.default
        .findById(id)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getInboxById = getInboxById;
async function createInbox(data) {
    try {
        const Inbox = new InboxModel_1.default(data);
        const response = await Inbox.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating Inbox : ${err}`);
        return false;
    }
}
exports.createInbox = createInbox;
async function updateInboxById(query, updates, options) {
    try {
        const updatedData = await InboxModel_1.default.findByIdAndUpdate(query, updates, options);
        return updatedData;
    }
    catch (err) {
        logger_1.default.error(`Error in updating Inbox : ${err}`);
        return false;
    }
}
exports.updateInboxById = updateInboxById;
async function deleteOneInboxById(id) {
    try {
        const myQuery = { _id: id };
        const contactDeletedData = await InboxModel_1.default.deleteOne(myQuery);
        return contactDeletedData;
    }
    catch (err) {
        logger_1.default.error(`Error in deleting one Inbox : ${err}`);
        return false;
    }
}
exports.deleteOneInboxById = deleteOneInboxById;
async function getOneInbox(queryParams) {
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
    const data = await InboxModel_1.default
        .findOne({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getOneInbox = getOneInbox;
//# sourceMappingURL=inboxModel.js.map