"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserActivity = void 0;
const UserActivityModel_1 = __importDefault(require("../models/UserActivityModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function createUserActivity(data) {
    try {
        const response = await UserActivityModel_1.default.create(data);
        return response;
    }
    catch (err) {
        logger_1.default.error('Error in creating User Activity ' + err);
        return false;
    }
}
exports.createUserActivity = createUserActivity;
//# sourceMappingURL=UserActivityModel.js.map