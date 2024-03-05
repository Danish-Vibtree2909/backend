"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseException_1 = __importDefault(require("../exceptions/BaseException"));
const logger_1 = __importDefault(require("../config/logger"));
require('dotenv').config();
const sendErrorDev = (err, res) => {
    logger_1.default.error("Error Stack : " + err.stack);
    res.status(err.statusCode).json({
        success: false,
        errorCode: err.errorCode || "INTERNAL_SERVER_ERROR",
        errorMsg: err.message,
        errorStack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        errorCode: err.errorCode || "INTERNAL_SERVER_ERROR",
        errorMsg: err.message,
    });
};
const GlobalExceptionHnadler = (err, req, res, next) => {
    //   console.log(err)
    logger_1.default.error("Error : " + JSON.stringify(err));
    err.statusCode = err.status || 500;
    err.message =
        err instanceof BaseException_1.default ? err.message : "Something went wrong!";
    let environment = process.env.NODE_ENV || "production";
    // Check if the response headers have already been sent
    if (res.headersSent) {
        return next(err);
    }
    if (environment === "development") {
        sendErrorDev(err, res);
    }
    else if (environment === "production") {
        sendErrorProd(err, res);
    }
};
exports.default = GlobalExceptionHnadler;
//# sourceMappingURL=GlobalExceptionHandler.js.map