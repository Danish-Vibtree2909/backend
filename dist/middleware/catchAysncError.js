"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAysncError = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.default = catchAysncError;
//# sourceMappingURL=catchAysncError.js.map