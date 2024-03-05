"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneAndUpdateConference = void 0;
const ConferenceModel_1 = __importDefault(require("../models/ConferenceModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function findOneAndUpdateConference(query, update, option) {
    try {
        const response = await ConferenceModel_1.default.findOneAndUpdate(query, update, option);
        return response;
    }
    catch (err) {
        logger_1.default.error('Error in updating conference model : ' + err);
        return false;
    }
}
exports.findOneAndUpdateConference = findOneAndUpdateConference;
//# sourceMappingURL=ConferenceController.js.map