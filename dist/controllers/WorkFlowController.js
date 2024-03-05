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
const Index_1 = __importDefault(require("./Index"));
const IvrFlowUIModel_1 = require("../services/IvrFlowUIModel");
const index_1 = require("../helper/index");
const config = __importStar(require("../config/index"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const BaseException_1 = __importDefault(require("../exceptions/BaseException"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});
class WorkFlowController extends Index_1.default {
    constructor(model) {
        super(model);
        this.getWorkFlows = this.getWorkFlows.bind(this);
        this.updateWorkFlowById = this.updateWorkFlowById.bind(this);
        this.deleteWorkFlowById = this.deleteWorkFlowById.bind(this);
        this.getWorkFlowById = this.getWorkFlowById.bind(this);
        this.createWorkFlow = this.createWorkFlow.bind(this);
        this.ConvertTextToSpeech = this.ConvertTextToSpeech.bind(this);
        this.uploadAudio = this.uploadAudio.bind(this);
        this.ConvertSsmlToSpeech = this.ConvertSsmlToSpeech.bind(this);
    }
    async ConvertSsmlToSpeech(req, res) {
        const OutputFormat = req.body.OutputFormat;
        const VoiceId = req.body.VoiceId;
        const ssml = req.body.ssml;
        const TextType = req.body.TextType;
        var input = {
            OutputFormat: OutputFormat,
            Text: ssml,
            TextType: TextType,
            VoiceId: VoiceId,
        };
        let result = Math.random().toString(36).substr(2, 25);
        const Polly = new aws_sdk_1.default.Polly({
            accessKeyId: config.AWS_ACCESS_KEY_POLLY,
            secretAccessKey: config.AWS_SECRET_ACCESS_KEY_POLLY,
            region: config.AWS_REGION_POLLY,
        });
        Polly.synthesizeSpeech(input, async (err, data) => {
            if (err) {
                console.log(err);
                this.status = false;
                this.message = err.message;
                this.code = 200;
                this.data = [];
                return res.json(this.Response());
            }
            if (data.AudioStream instanceof Buffer) {
                const params = {
                    Bucket: "vibtreedan/public",
                    Key: new Date().toISOString() + "_" + `${result}.mp3`,
                    Body: data.AudioStream,
                    ContentType: "audio/mpeg",
                };
                await s3
                    .upload(params)
                    .promise()
                    .then((data) => {
                    console.log("data in s3 ", data);
                    this.data = [data];
                    this.message = "file successfully uploaded.";
                    this.status = true;
                    this.code = 200;
                    return res.json(this.Response());
                })
                    .catch((err) => {
                    console.log("err 325 : ", err);
                    this.status = false;
                    this.message = err.message;
                    this.code = 200;
                    this.data = [];
                    return res.json(this.Response());
                });
            }
        });
    }
    async uploadAudio(req, res) {
        try {
            this.data = [];
            this.status = true;
            let file = req.file;
            if (!file) {
                throw new Error("Audio file is required with 'audio parameter'");
            }
            // check this is audio or not
            if (!(file.mimetype === "audio/webm" ||
                file.mimetype === "mp3" ||
                file.mimetype === "opus" ||
                file.mimetype === "audio/mpeg" ||
                file.mimetype === "audio/wav")) {
                throw new Error("File is not audio");
            }
            const filename = file.originalname;
            // upload it to s3
            const params = {
                // Bucket: 'playgreeting/LineForwarding', // The name of the bucket. For example, 'sample_bucket_101'.
                Bucket: "vibtreedan/public",
                // Key: helper.removeAllSpace(new Date().toISOString() + filename), // The name of the object. For example, 'sample_upload.txt'.
                Key: new Date().toISOString() + "_" + filename,
                Body: file.buffer,
                ContentType: "audio/mpeg",
            };
            const dataS3 = await s3
                .upload(params)
                .promise()
                .then((data) => data)
                .catch((err) => {
                throw new BaseException_1.default(500, "File can not be uploaded!", "File_Upload_Error");
            });
            await s3.getSignedUrl("putObject", params);
            this.data = {
                //this is saving the whole location of the file
                fileKey: params.Key,
                //this is saving the key of the file
                fileLink: dataS3.Location,
            };
            this.message = "file successfully uploaded.";
        }
        catch (error) {
            this.message = error.message;
            this.code = 200;
            this.status = false;
        }
        return res.json(this.Response());
    }
    async ConvertTextToSpeech(req, res) {
        const OutputFormat = req.body.OutputFormat;
        const VoiceId = req.body.VoiceId;
        const Text = req.body.Text;
        const TextType = req.body.TextType;
        var input = {
            OutputFormat: OutputFormat,
            Text: Text,
            TextType: TextType,
            VoiceId: VoiceId,
        };
        let result = Math.random().toString(36).substr(2, 25);
        const Polly2 = new aws_sdk_1.default.Polly({
            accessKeyId: config.AWS_ACCESS_KEY_POLLY,
            secretAccessKey: config.AWS_SECRET_ACCESS_KEY_POLLY,
            region: config.AWS_REGION_POLLY,
        });
        Polly2.synthesizeSpeech(input, async (err, data) => {
            if (err) {
                console.log(err);
                this.status = false;
                this.message = err.message;
                this.code = 200;
                this.data = [];
                return res.json(this.Response());
            }
            if (data.AudioStream instanceof Buffer) {
                const params = {
                    Bucket: "vibtreedan/public",
                    Key: new Date().toISOString() + "_" + `${result}.mp3`,
                    Body: data.AudioStream,
                    ContentType: "audio/mpeg",
                };
                await s3
                    .upload(params)
                    .promise()
                    .then((data) => {
                    this.data = [data];
                    this.message = "file successfully uploaded.";
                    this.status = true;
                    this.code = 200;
                    return res.json(this.Response());
                })
                    .catch((err) => {
                    console.log(err);
                    this.status = false;
                    this.message = err.message;
                    this.code = 200;
                    this.data = [];
                    return res.json(this.Response());
                });
            }
        });
    }
    async getWorkFlows(req, res) {
        const authId = req.JWTUser?.authId;
        const queryParams = { ...req.query, auth_id: authId };
        const data = await (0, IvrFlowUIModel_1.getWorkFlows)(queryParams);
        const totalCount = await (0, IvrFlowUIModel_1.countWorkFlowDocuments)(queryParams);
        const response = {
            data: data,
            totalCount: totalCount,
        };
        this.data = response;
        this.code = 200;
        this.status = true;
        this.message = "Details Fetched!";
        return res.status(200).json(this.Response());
    }
    async updateWorkFlowById(req, res) {
        const query = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(query);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const body = { ...req.body };
        delete body.haveCredits;
        const updates = { ...body, updatedAt: new Date() };
        const options = { upsert: false };
        const updatedData = await (0, IvrFlowUIModel_1.updateWorkFlowWithId)(query, updates, options);
        if (updatedData) {
            this.data = [];
            this.status = true;
            this.message = "Updated WorkFlow";
            this.code = 204;
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
    }
    async deleteWorkFlowById(req, res) {
        const id = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(id);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const data = await (0, IvrFlowUIModel_1.deleteWorkFlowById)(id);
        if (data) {
            this.data = [];
            this.status = true;
            this.code = 204;
            this.message = "Detail Deleted!";
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.message = "Something went wrong";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
    }
    async getWorkFlowById(req, res) {
        const id = req.params.id;
        const query = req.query;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(id);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const data = await (0, IvrFlowUIModel_1.getWorkFlowWithId)(id, query);
        if (data) {
            this.data = data;
            this.status = true;
            this.code = 200;
            this.message = "Detail Fetched!";
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.message = "Something went wrong";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
    }
    async createWorkFlow(req, res) {
        const authId = req.JWTUser?.authId;
        const body = req.body;
        const finalBody = { ...body, auth_id: authId };
        const data = await (0, IvrFlowUIModel_1.createWorkFlow)(finalBody);
        if (data) {
            this.data = data;
            this.status = true;
            this.code = 201;
            this.message = "WorkFlow Created!";
            return res.status(201).json(this.Response());
        }
        else {
            this.data = [];
            this.code = 403;
            this.status = false;
            this.message = "Something went wrong!";
            return res.status(403).json(this.Response());
        }
    }
}
exports.default = WorkFlowController;
//# sourceMappingURL=WorkFlowController.js.map