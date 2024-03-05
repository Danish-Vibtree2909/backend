"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseException extends Error {
    status;
    message;
    errorCode;
    constructor(status, message, errorCode) {
        super(message);
        this.status = status;
        this.message = message;
        this.errorCode = errorCode;
    }
}
exports.default = BaseException;
//# sourceMappingURL=BaseException.js.map