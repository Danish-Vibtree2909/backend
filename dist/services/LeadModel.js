"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOnendUpdateLead = exports.deleteManyLead = exports.createLead = void 0;
const LeadModel_1 = __importDefault(require("../models/LeadModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function createLead(data) {
    try {
        const mongoObj = new LeadModel_1.default(data);
        const response = await mongoObj.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating LeadModel : ${err}`);
        return false;
    }
}
exports.createLead = createLead;
async function deleteManyLead(query) {
    try {
        const updatedLeadModel = await LeadModel_1.default.deleteMany(query);
        return updatedLeadModel;
    }
    catch (err) {
        logger_1.default.error("error in deleting LeadModel : " + err);
        return false;
    }
}
exports.deleteManyLead = deleteManyLead;
async function findOnendUpdateLead(query, updates, options) {
    try {
        const updatedLead = await LeadModel_1.default.findOneAndUpdate(query, updates, options);
        return updatedLead;
    }
    catch (err) {
        logger_1.default.error("error in updating LeadModel : " + err);
        return false;
    }
}
exports.findOnendUpdateLead = findOnendUpdateLead;
//# sourceMappingURL=LeadModel.js.map