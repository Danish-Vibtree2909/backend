"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const developmentLogger_1 = __importDefault(require("./developmentLogger"));
let logger = null;
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
console.log("logger file : ", env);
if (env === 'development') {
    logger = (0, developmentLogger_1.default)();
}
exports.default = logger;
//# sourceMappingURL=logger.js.map