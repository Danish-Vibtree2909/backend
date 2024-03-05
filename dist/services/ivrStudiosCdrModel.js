"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneAndUpdateIvrStudiosCallBack = exports.createIvrStudiosCdrCallBack = void 0;
const ivrStudiosModelCallBacks_1 = __importDefault(require("../models/ivrStudiosModelCallBacks"));
const logger_1 = __importDefault(require("../config/logger"));
async function createIvrStudiosCdrCallBack(data) {
    try {
        const ivrStudiosStatusModel = new ivrStudiosModelCallBacks_1.default(data);
        const response = await ivrStudiosStatusModel.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating createIvrStudiosCdrCallBack call back : `);
        logger_1.default.error(err);
        return err;
    }
}
exports.createIvrStudiosCdrCallBack = createIvrStudiosCdrCallBack;
async function findOneAndUpdateIvrStudiosCallBack(query, update, option) {
    try {
        const response = await ivrStudiosModelCallBacks_1.default.findOneAndUpdate(query, update, option);
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in updating createIvrStudiosCdrCallBack call back : `);
        logger_1.default.error(err);
        return err;
    }
}
exports.findOneAndUpdateIvrStudiosCallBack = findOneAndUpdateIvrStudiosCallBack;
//# sourceMappingURL=ivrStudiosCdrModel.js.map