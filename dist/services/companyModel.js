"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompany = void 0;
const companyModel_1 = __importDefault(require("../models/companyModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function createCompany(data) {
    try {
        const companyDetail = new companyModel_1.default(data);
        const response = await companyDetail.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating company : ${err}`);
        return false;
    }
}
exports.createCompany = createCompany;
//# sourceMappingURL=companyModel.js.map