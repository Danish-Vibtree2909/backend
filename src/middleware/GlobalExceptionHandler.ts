import type { NextFunction, Request, Response } from "express";
import BaseException from "../exceptions/BaseException";
import logger from "../config/logger";
require('dotenv').config()

const sendErrorDev = (err: any, res: Response) => {
  logger.error("Error Stack : " + err.stack);
  res.status(err.statusCode).json({
    success: false,
    errorCode: err.errorCode || "INTERNAL_SERVER_ERROR",
    errorMsg: err.message,
    errorStack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    success: false,
    errorCode: err.errorCode || "INTERNAL_SERVER_ERROR",
    errorMsg: err.message,
  });
};

const GlobalExceptionHnadler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   console.log(err)
  logger.error("Error : " + JSON.stringify(err));
  err.statusCode = err.status || 500;
  err.message =
    err instanceof BaseException ? err.message : "Something went wrong!";
  let environment = process.env.NODE_ENV || "production";

  // Check if the response headers have already been sent
  if (res.headersSent) {
    return next(err);
  }

  if (environment === "development") {
    sendErrorDev(err, res);
  } else if (environment === "production") {
    sendErrorProd(err, res);
  }
};

export default GlobalExceptionHnadler;
