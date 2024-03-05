"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseException_1 = __importDefault(require("./BaseException"));
class UnauthorizedRequestException extends BaseException_1.default {
    constructor() {
        super(401, "User is unauthorized", "UNAUTHORIZATION_ERROR");
    }
}
exports.default = UnauthorizedRequestException;
//# sourceMappingURL=UnauthorizedRequestException.js.map