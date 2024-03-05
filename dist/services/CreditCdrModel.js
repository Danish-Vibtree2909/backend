"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCreditCdr = void 0;
const CreditCdrModel_1 = __importDefault(require("../models/CreditCdrModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function createCreditCdr(data) {
    try {
        const response = await CreditCdrModel_1.default.create(data);
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating credit logs : ${err}`);
        return false;
    }
}
exports.createCreditCdr = createCreditCdr;
//# sourceMappingURL=CreditCdrModel.js.map