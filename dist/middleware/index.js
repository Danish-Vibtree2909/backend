"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSubscription = exports.checkFormatOfId = exports.jwtAuth = exports.isAuth = void 0;
const isAuth_1 = __importDefault(require("./isAuth"));
exports.isAuth = isAuth_1.default;
const isAuth_2 = require("./isAuth");
Object.defineProperty(exports, "jwtAuth", { enumerable: true, get: function () { return isAuth_2.jwtAuth; } });
const checkId_1 = __importDefault(require("./checkId"));
exports.checkFormatOfId = checkId_1.default;
const Subscription_1 = __importDefault(require("./Subscription"));
exports.validateSubscription = Subscription_1.default;
//# sourceMappingURL=index.js.map