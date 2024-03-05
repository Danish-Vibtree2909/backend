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
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = __importStar(require("aws-sdk"));
/**
 * It the parenf class of all controller
 * @class COntroller
 */
class Controller {
    code = 200;
    status = true;
    successMessage = 'Request successfully completed';
    errorMessage = 'Requst failed.';
    message = 'Request successfully completed';
    data = [];
    count;
    constructor(model) {
        this.Response = this.Response.bind(this);
        this.s3Client = this.s3Client.bind(this);
        this.code = 200;
        this.status = true;
        this.message = 'Request successfully completed.';
        this.data = [];
        this.count = 0;
    }
    s3Client() {
        return new AWS.S3({
            accessKeyId: 'AKIA2MTCLJCG3DK7TOER',
            secretAccessKey: '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'
        });
    }
    /**
     * It will return the api response
     * @returns IResponse
     * */
    Response() {
        return {
            status: this.status,
            code: this.code,
            message: this.message,
            data: this.data ? this.data : []
        };
    }
}
exports.default = Controller;
//# sourceMappingURL=Index.js.map