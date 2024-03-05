"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const moment_1 = __importDefault(require("moment"));
const winston_cloudwatch_1 = __importDefault(require("winston-cloudwatch"));
const conf = __importStar(require("../config/index"));
const { combine, timestamp, printf } = winston_1.default.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} - [${level}] - ${message}`;
});
// console.log("conf.AWS_CLOUDWATCH_KEY : ",conf.AWS_CLOUDWATCH_KEY , ' : ', AWS_CLOUDWATCH_SECRET)
const logger = () => {
    return winston_1.default.createLogger({
        level: 'debug',
        format: combine(winston_1.default.format.simple(), timestamp({ format: (0, moment_1.default)().format('YYYY-MM-DD hh:mm:ss').trim() }), myFormat),
        transports: [
            new winston_1.default.transports.Console(),
            // Configure WinstonCloudWatch transport
            new winston_cloudwatch_1.default({
                logGroupName: conf.AWS_GROUP_NAME,
                logStreamName: conf.AWS_STREAM_NAME,
                awsRegion: conf.AWS_CLOUDWATCH_REGION,
                awsOptions: {
                    credentials: {
                        accessKeyId: conf.AWS_CLOUDWATCH_KEY,
                        secretAccessKey: conf.AWS_CLOUDWATCH_SECRET
                    }
                }
            })
        ]
    });
};
exports.default = logger;
//# sourceMappingURL=developmentLogger.js.map