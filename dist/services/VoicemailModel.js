"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByIdAndDeleteVoicemailBox = exports.findByIdAndUpdateVoicemailBox = exports.createVoiceMailBox = exports.getByIdVoicemailBox = exports.countDocumentOfVoicemailBox = exports.getAllVoicemailBox = exports.countDocumentOfVoicemailRecord = exports.getAllVoicemailRecord = void 0;
const VoiceMailBoxModel_1 = __importDefault(require("../models/VoiceMailBoxModel"));
const VoiceMailRecordModel_1 = __importDefault(require("../models/VoiceMailRecordModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getAllVoicemailRecord(queryParams) {
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
    const data = await VoiceMailRecordModel_1.default.find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getAllVoicemailRecord = getAllVoicemailRecord;
async function countDocumentOfVoicemailRecord(queryParams) {
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
    const data = await VoiceMailRecordModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countDocumentOfVoicemailRecord = countDocumentOfVoicemailRecord;
async function getAllVoicemailBox(queryParams) {
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
    const data = await VoiceMailBoxModel_1.default.find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getAllVoicemailBox = getAllVoicemailBox;
async function countDocumentOfVoicemailBox(queryParams) {
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
    const data = await VoiceMailBoxModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countDocumentOfVoicemailBox = countDocumentOfVoicemailBox;
async function getByIdVoicemailBox(id, queryParams) {
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await VoiceMailBoxModel_1.default.findById(id);
    return data;
}
exports.getByIdVoicemailBox = getByIdVoicemailBox;
async function createVoiceMailBox(data) {
    try {
        const mongoObj = new VoiceMailBoxModel_1.default(data);
        const response = await mongoObj.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating VoiceMailBoxModel : ${err}`);
        return err;
    }
}
exports.createVoiceMailBox = createVoiceMailBox;
async function findByIdAndUpdateVoicemailBox(query, updates, options) {
    try {
        const updatedBlockList = await VoiceMailBoxModel_1.default.findByIdAndUpdate(query, updates, options);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error("error in updating VoiceMailBoxModel : " + err);
        return false;
    }
}
exports.findByIdAndUpdateVoicemailBox = findByIdAndUpdateVoicemailBox;
async function findByIdAndDeleteVoicemailBox(query) {
    try {
        const updatedBlockList = await VoiceMailBoxModel_1.default.findByIdAndDelete(query);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error("error in deleting VoiceMailBoxModel : " + err);
        return false;
    }
}
exports.findByIdAndDeleteVoicemailBox = findByIdAndDeleteVoicemailBox;
//# sourceMappingURL=VoicemailModel.js.map