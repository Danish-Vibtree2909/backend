"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRoute = void 0;
const logger_1 = __importDefault(require("../config/logger"));
// Define the middleware function
const logRoute = async (req, res, next) => {
    logger_1.default.info(`${req.method} ${req.originalUrl} `);
    next();
};
exports.logRoute = logRoute;
//# sourceMappingURL=RouteInfo.js.map