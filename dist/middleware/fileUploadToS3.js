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
exports.deleteFile = exports.downloadFile = exports.uploadFile = exports.s3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const BaseException_1 = __importDefault(require("../exceptions/BaseException"));
const config = __importStar(require("../config/index"));
const s3 = new aws_sdk_1.default.S3({
    signatureVersion: 'v4',
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: 'eu-central-1'
});
exports.s3 = s3;
async function uploadFile(bucketName, file) {
    console.log("cred ", config.AWS_ACCESS_KEY, config.AWS_SECRET_ACCESS_KEY);
    const random = Math.random().toString(36).substr(2, 25);
    const params = {
        Bucket: bucketName,
        Key: `${random}_${file.originalname}`,
        Body: file.buffer
    };
    console.log("params : ", params);
    return await s3
        .upload(params)
        .promise()
        .then((data) => data)
        .catch((err) => {
        console.log(err);
        throw new BaseException_1.default(500, "File can not be uploaded!", "File_Upload_Error");
    });
}
exports.uploadFile = uploadFile;
async function downloadFile(bucketName, filePath) {
    const params = {
        Bucket: bucketName,
        Key: filePath
    };
    return await s3
        .getObject(params)
        .promise()
        .then((data) => data)
        .catch((err) => {
        console.log(err);
        throw new BaseException_1.default(500, "File can not be downloaded!", "File_Download_Error");
    });
}
exports.downloadFile = downloadFile;
async function deleteFile(bucketName, filePath) {
    const params = {
        Bucket: bucketName,
        Key: filePath
    };
    return await s3
        .deleteObject(params)
        .promise()
        .then((data) => data)
        .catch((err) => {
        console.log(err);
        throw new BaseException_1.default(500, "File can not be deleted!", "File_Delete_Error");
    });
}
exports.deleteFile = deleteFile;
//# sourceMappingURL=fileUploadToS3.js.map