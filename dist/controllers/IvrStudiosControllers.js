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
// import { IvrStudios } from '../types/ivrStudiosType'
const VoiceResponse_1 = __importDefault(require("twilio/lib/twiml/VoiceResponse"));
const conf = __importStar(require("../config/index"));
const ivrStudiosModelCallBacks_1 = __importDefault(require("../models/ivrStudiosModelCallBacks"));
const ivrFlowUIModel_1 = __importDefault(require("../models/ivrFlowUIModel"));
const smsModel_1 = __importDefault(require("../models/smsModel"));
const request_1 = __importDefault(require("request"));
const ConferenceModel_1 = __importDefault(require("../models/ConferenceModel"));
const ConferenceCallBacksModel_1 = __importDefault(require("../models/ConferenceCallBacksModel"));
const fileUploadToS3_1 = require("../middleware/fileUploadToS3");
const IvrStudiousRealTime_1 = __importDefault(require("../models/IvrStudiousRealTime"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config = __importStar(require("../config/index"));
const moment_1 = __importDefault(require("moment"));
const UserPermissionUserModel_1 = __importDefault(require("../models/UserPermissionUserModel"));
const VoiceMailRecordModel_1 = __importDefault(require("../models/VoiceMailRecordModel"));
const callXmlGenerator_1 = require("../helper/callXmlGenerator");
const { contactModel } = require("../models/ContactsModel");
const mime_types_1 = __importDefault(require("mime-types"));
const stream_1 = require("stream");
const logger_1 = __importDefault(require("../config/logger"));
aws_sdk_1.default.config.accessKeyId = config.AWS_ACCESS_KEY;
aws_sdk_1.default.config.secretAccessKey = config.AWS_SECRET_ACCESS_KEY;
aws_sdk_1.default.config.region = "eu-central-1";
require("dotenv").config();
const httpClient = request_1.default;
class IvrStudiosController extends Index_1.default {
    constructor(model) {
        super(model);
        this.numberNotInService = this.numberNotInService.bind(this);
        this.MakeConferenceCall = this.MakeConferenceCall.bind(this);
        this.getConferenceRoom = this.getConferenceRoom.bind(this);
        this.getListOfConference = this.getListOfConference.bind(this);
        this.getVibconnectDataAndModefiy =
            this.getVibconnectDataAndModefiy.bind(this);
        this.deleteAudioFromS3 = this.deleteAudioFromS3.bind(this);
        this.checkIfCustomerInLine = this.checkIfCustomerInLine.bind(this);
        this.createIvrFlowAccordingToUIFlowVersionTwo =
            this.createIvrFlowAccordingToUIFlowVersionTwo.bind(this);
        this.getTargetNodeAndExecuteVersionTwo =
            this.getTargetNodeAndExecuteVersionTwo.bind(this);
        this.getRealTimeData = this.getRealTimeData.bind(this);
        this.downloadRecording = this.downloadRecording.bind(this);
        this.xmlGenerator = this.xmlGenerator.bind(this);
    }
    async xmlGenerator(req, res) {
        let number = req.query.number;
        const voice = new VoiceResponse_1.default();
        let Parent;
        Parent = voice.dial({
            answerOnBridge: true,
            record: true,
        });
        Parent.number(number);
        return res.send(voice.toString());
    }
    downloadFile = async (bucketName, filePath) => {
        const s3bucket = new aws_sdk_1.default.S3({
            signatureVersion: "v4",
            accessKeyId: config.AWS_ACCESS_KEY_RECORDINGS,
            secretAccessKey: config.AWS_SECRET_ACCESS_KEY_RECORDINGS,
        });
        const params = {
            Bucket: bucketName,
            Key: filePath,
        };
        return await s3bucket
            .getObject(params)
            .promise()
            .then((data) => data)
            .catch((err) => {
            console.log(err);
            //throw new BaseException(500, "File can not be downloaded!", "File_Download_Error");
        });
    };
    //Without Dynamic tags
    async downloadRecording(req, res) {
        const AccountSid = req.query.AccountSid;
        const RecordingSid = req.query.RecordingSid;
        const fileLocation = `${AccountSid}-${RecordingSid}.mp3`;
        if (!AccountSid) {
            return res.status(404).json({ message: "AuthId is missing" });
        }
        if (!RecordingSid) {
            return res.status(404).json({ message: "RecordingSid is missing" });
        }
        const fileData = await this.downloadFile(config.AWS_BUCKET_NAME_RECORDINGS, fileLocation);
        if (!fileData) {
            return res.status(404).send("Not Found");
        }
        const file = new stream_1.Readable({
            read() {
                this.push(fileData.Body);
                this.push(null);
            },
        });
        const fileNameArr = fileLocation.split("-");
        const filename = fileNameArr[fileNameArr.length - 1];
        const fileExtensionArr = fileLocation.split(".");
        const fileType = fileExtensionArr[fileExtensionArr.length - 1];
        res.setHeader("Content-Disposition", 'attachment: filename="' + filename + '"');
        //@ts-ignore
        res.setHeader("Content-Type", mime_types_1.default.lookup(fileType));
        file.pipe(res);
        return res;
    }
    obtainFileName(fileUrl) {
        return fileUrl.split("/")[fileUrl.split("/").length - 1];
    }
    async deleteAudioFromS3(req, res) {
        const fileUrl = req.body.fileUrl;
        const fileName = this.obtainFileName(decodeURIComponent(fileUrl));
        const bucketName = "vibtreedan";
        await (0, fileUploadToS3_1.deleteFile)(bucketName, `public/${fileName}`);
        return res.status(200).json({ message: "deleted" });
    }
    convertObjectToQueryString(obj) {
        return Object.keys(obj)
            .map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
        })
            .join("&");
    }
    async getVibconnectDataAndModefiy(req, res) {
        const actionPath = req.params.action;
        const queryFromVibconnect = req.query;
        const myQuery = { ParentCallSid: queryFromVibconnect.ParentCallSid };
        const callStatusFromApiCall = await ConferenceModel_1.default.findOne(myQuery);
        let updatedQueryObjectForVibtree;
        if (callStatusFromApiCall) {
            updatedQueryObjectForVibtree = {
                ...queryFromVibconnect,
                ApiCallStatus: callStatusFromApiCall.CallStatus,
                isOriginConference: "true",
            };
        }
        // console.log("Query from vibconnect",queryFromVibconnect)
        console.log(updatedQueryObjectForVibtree);
        // res.redirect(`${conf.BaseUrl}/api/v1/calls/update?${updatedQueryForVibtre}`)
        if (updatedQueryObjectForVibtree) {
            const updatedQueryForVibtree = this.convertObjectToQueryString(updatedQueryObjectForVibtree);
            console.log("address : ", `${conf.BaseUrl}/api/action/${actionPath}/?${updatedQueryForVibtree}`);
            return res.redirect(`${conf.BaseUrl}/api/action/${actionPath}/?${updatedQueryForVibtree}`);
        }
        return res.json({ message: "No data found" });
    }
    async checkIfCustomerInLine(req, res) {
        const conferenceRoom = req.params.conferenceRoom;
        const parentCallSid = conferenceRoom.split("_")[1];
        const url = req.params.url;
        res.set("Content-Type", "text/xml");
        const defaultVRI = new VoiceResponse_1.default();
        try {
            const callDetailsOfConferenceSid = await ConferenceCallBacksModel_1.default.find({
                FriendlyName: conferenceRoom,
            });
            // console.log("call Details of conference sid",callDetailsOfConferenceSid)
            let correctConferenceIdInWhichCustomerIsInLine = "";
            let countOfMemberInConference = 0;
            let countOfMemberLeaveConference = 0;
            for (let i = 0; i < callDetailsOfConferenceSid.length; i++) {
                if (callDetailsOfConferenceSid[i].CallSid === parentCallSid &&
                    callDetailsOfConferenceSid[i].FriendlyName === conferenceRoom) {
                    correctConferenceIdInWhichCustomerIsInLine =
                        callDetailsOfConferenceSid[i].ConferenceSid;
                }
            }
            for (let i = 0; i < callDetailsOfConferenceSid.length; i++) {
                if (callDetailsOfConferenceSid[i].ConferenceSid ===
                    correctConferenceIdInWhichCustomerIsInLine &&
                    callDetailsOfConferenceSid[i].StatusCallbackEvent ===
                        "participant-join") {
                    countOfMemberInConference++;
                }
                if (callDetailsOfConferenceSid[i].ConferenceSid ===
                    correctConferenceIdInWhichCustomerIsInLine &&
                    callDetailsOfConferenceSid[i].StatusCallbackEvent ===
                        "participant-leave") {
                    countOfMemberLeaveConference++;
                }
            }
            console.log("correct conference id in which customer is in line : ", correctConferenceIdInWhichCustomerIsInLine);
            console.log("count of member in conference : ", countOfMemberInConference);
            console.log("count of member leave conference : ", countOfMemberLeaveConference);
            if (countOfMemberInConference >= 1 &&
                countOfMemberLeaveConference === 0) {
                console.log("customer is in line the xml is of conference ");
                if (req.params.url) {
                    if (req.params.url !== "empty") {
                        const voice = new VoiceResponse_1.default();
                        console.log("url : ", url);
                        if (req.params.url.includes('SendDigits')) {
                            const voice = new VoiceResponse_1.default();
                            console.log("req.params.url : ", req.params.url);
                            const digitsObj = req.params.url.split('SendDigits|')[1];
                            console.log("digits obj : ", digitsObj);
                            voice.play({ digits: `${digitsObj}#` });
                            let Parentdial = voice.dial();
                            Parentdial.conference({ endConferenceOnExit: "true" }, conferenceRoom);
                            logger_1.default.info('send digits conference url : ' + voice.toString());
                            return res.send(voice.toString());
                        }
                        voice.play(`https://vibtreedan.s3.amazonaws.com/public/${url}`);
                        let Parentdial = voice.dial();
                        Parentdial.conference({ endConferenceOnExit: "true" }, conferenceRoom);
                        return res.send(voice.toString());
                    }
                    const voice = new VoiceResponse_1.default();
                    let Parentdial = voice.dial();
                    Parentdial.conference({ endConferenceOnExit: "true" }, conferenceRoom);
                    return res.send(voice.toString());
                }
            }
            if (countOfMemberInConference >= 1 && countOfMemberLeaveConference >= 1) {
                console.log("customer hangup the xml is of hangup");
                const voice = new VoiceResponse_1.default();
                voice.hangup();
                return res.send(voice.toString());
            }
            const voice = new VoiceResponse_1.default();
            let Parentdial = voice.dial();
            Parentdial.conference({ endConferenceOnExit: "true" }, conferenceRoom);
            return res.send(voice.toString());
        }
        catch (err) {
            console.log(err);
            this.message = err.message;
            this.status = false;
            this.code = 500;
            defaultVRI.say(err.message);
        }
        return res.send(defaultVRI.toString());
    }
    async getConferenceRoom(req, res) {
        const customer_number = req.params.customer_number;
        const url = req.params.url;
        res.set("Content-Type", "text/xml");
        const defaultVRI = new VoiceResponse_1.default();
        try {
            if (req.params.url) {
                if (req.params.url !== "empty") {
                    const voice = new VoiceResponse_1.default();
                    console.log("url : ", url);
                    voice.play(`https://vibtreedan.s3.amazonaws.com/public/${url}`);
                    let Parentdial = voice.dial();
                    // Parentdial.conference({endConferenceOnExit : "true"} , customer_number)
                    Parentdial.conference(customer_number);
                    return res.send(voice.toString());
                }
                const voice = new VoiceResponse_1.default();
                let Parentdial = voice.dial();
                // Parentdial.conference({endConferenceOnExit : "true"} , customer_number)
                Parentdial.conference(customer_number);
                return res.send(voice.toString());
            }
            const voice = new VoiceResponse_1.default();
            let Parentdial = voice.dial();
            // Parentdial.conference({endConferenceOnExit : "true"} , customer_number)
            Parentdial.conference(customer_number);
            return res.send(voice.toString());
        }
        catch (err) {
            console.log(err);
            this.message = err.message;
            this.status = false;
            this.code = 500;
            defaultVRI.say(err.message);
        }
        return res.send(defaultVRI.toString());
    }
    async sendCompletedMessageThree(auth_id, auth_secret, from, pe_id, body, to) {
        const link = `https://api.vibconnect.io/v1/Accounts/${auth_id}/Messages`;
        // console.log("body in target function ", agent , customer)
        const tok = auth_id + ":" + auth_secret;
        const hash = Buffer.from(tok).toString("base64");
        const correctFormatOfCustomerNumber = this.checkTheNumberContainsSymbolOrNOT(to);
        const only10DigitsOfNumber = correctFormatOfCustomerNumber
            ? correctFormatOfCustomerNumber.slice(-10)
            : "";
        const options = {
            method: "POST",
            url: link,
            headers: {
                Authorization: "Basic " + hash,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                From: from,
                //   "To": `+${to}`,
                To: `+91${only10DigitsOfNumber}`,
                PeId: pe_id,
                Body: body,
                StatusCallback: `${process.env.BASE_URL}/api/webhook/vibconnect/message`,
                StatusCallbackMethod: "queued, failed , sent , delivered ,undelivered",
            }),
        };
        console.log(options);
        return new Promise((resolve, reject) => {
            httpClient(options, (err, res, body) => {
                if (err) {
                    console.log("error message ", err);
                    reject(err);
                }
                //  console.log("res of target ",res)
                console.log("body of message ", body);
                resolve(body);
            });
        });
    }
    async sendMessageToDomestic(auth_id, auth_secret, from, pe_id, template_id, body, to) {
        const link = `https://api.vibconnect.io/v1/Accounts/${auth_id}/Messages`;
        // console.log("body in target function ", agent , customer)
        const tok = auth_id + ":" + auth_secret;
        const hash = Buffer.from(tok).toString("base64");
        const correctFormatOfCustomerNumber = this.checkTheNumberContainsSymbolOrNOT(to);
        const only10DigitsOfNumber = correctFormatOfCustomerNumber
            ? correctFormatOfCustomerNumber.slice(-10)
            : "";
        const options = {
            method: "POST",
            url: link,
            headers: {
                Authorization: "Basic " + hash,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                From: from,
                //   "To": `+${to}`,
                To: `+91${only10DigitsOfNumber}`,
                PEId: pe_id,
                TemplateId: template_id,
                Body: body,
                StatusCallback: `${process.env.BASE_URL}/api/webhook/vibconnect/message`,
                StatusCallbackMethod: "queued, failed , sent , delivered ,undelivered",
            }),
        };
        console.log(options);
        return new Promise((resolve, reject) => {
            httpClient(options, (err, res, body) => {
                if (err) {
                    console.log("error message ", err);
                    reject(err);
                }
                //  console.log("res of target ",res)
                console.log("body of message domestic :  ", body);
                if (body === "404 page not found")
                    resolve({
                        sid: "001",
                        date_created: "server-down",
                        date_updated: "server-down",
                        date_sent: "",
                        ParentAccountSid: "WZD6OPMP9LZ5V2UX59N4",
                        account_sid: "server-down",
                        ParentAuthId: "server-down",
                        to: "server-down",
                        from: "server-down",
                        messaging_service_sid: "",
                        body: "server-down",
                        status: "server-down",
                        num_segments: "",
                        num_media: "",
                        direction: "outbound-api",
                        api_version: "2010-04-01",
                        price: "",
                        price_unit: "USD",
                        error_code: "",
                        error_message: "",
                        uri: "server-down",
                        subresource_uris: { media: "server-down" },
                    });
                resolve(body);
            });
        });
    }
    updateRealTimeDataOfIvrStudiousForApiCall = async (query, updates) => {
        console.log("I am in updateRealTimeDataOfIvrStudiousForApiCall");
        console.log("query : ", query);
        console.log("updates : ", updates);
        try {
            await IvrStudiousRealTime_1.default.findOneAndUpdate(query, updates);
        }
        catch (err) {
            console.log(err);
        }
    };
    loopOverNumberToGetAvailableNumberOfAgent = async (arrayOfAgentNumbers) => {
        console.log("array of agents number : ", arrayOfAgentNumbers);
        let onlyNumbersArray = arrayOfAgentNumbers.map((val) => {
            return val.number;
        });
        const myQuery = onlyNumbersArray
            ? { Receiver: { $in: onlyNumbersArray } }
            : {};
        const dataInRealTime = await IvrStudiousRealTime_1.default.find(myQuery);
        console.log("data in real time : ", dataInRealTime);
        const numbersArrayInRealTime = dataInRealTime.map((val) => {
            return val.Receiver;
        });
        const numberArrayInDataBase = arrayOfAgentNumbers.map((val) => {
            return val.number;
        });
        const x = numberArrayInDataBase.filter((val) => !numbersArrayInRealTime.includes(val));
        console.log("x : ", x);
        if (x.length > 0) {
            return x[0];
        }
        else {
            return "no-number";
        }
    };
    timeout = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
    sleep = async (fn, ...args) => {
        await this.timeout(3000);
        return fn(...args);
    };
    getConferenceSidAndEndConference = async (ParentCallSid, authId, authSecretid) => {
        const conferenceDetailsOfParticularCall = await this.findConferenceIdUsingParentCallId(ParentCallSid, authId, authSecretid);
        console.log("conferenceDetailsOfParticularCall : ", typeof conferenceDetailsOfParticularCall, conferenceDetailsOfParticularCall);
        let conferenceId = conferenceDetailsOfParticularCall.sid;
        const result = await this.endConference(authId, authSecretid, conferenceId);
        console.log("result of end conference if no call is there : ", result);
        return result;
    };
    async endConference(auth_id, authSecret_id, conference_id) {
        const link = "https://api.vibconnect.io/v1/Accounts/" +
            auth_id +
            "/Conferences/" +
            conference_id;
        const tok = auth_id + ":" + authSecret_id;
        const hash = Buffer.from(tok).toString("base64");
        const data_to_send = {
            Status: "completed",
        };
        const options = {
            method: "PUT",
            url: link,
            headers: {
                Authorization: "Basic " + hash,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...data_to_send,
            }),
        };
        console.log(options);
        return new Promise((resolve, reject) => {
            httpClient(options, (err, res, body) => {
                if (err) {
                    console.log("error in endOfConference ", err);
                    reject(err);
                }
                //  console.log("res of target ",res)
                console.log("body of endOfConference ", body);
                resolve(body);
            });
        });
    }
    findConferenceIdUsingParentCallId = async (parentCallId, authId, authSecretId) => {
        // let query = {FriendlyName : `Room_${parentCallId}`}
        //const result : any = await ConferenceModel.findOne(query);
        //const result : any = await ConferenceCallBacksModel.findOne(query);
        const result = await this.getListOfConference(authId, authSecretId);
        const jsonResult = JSON.parse(result);
        // console.log("result : ", typeof jsonResult, jsonResult)
        const conferenceDetailsOfParticularCall = jsonResult?.conferences.filter((val) => val.friendly_name === `Room_${parentCallId}`);
        if (conferenceDetailsOfParticularCall.length > 0) {
            return conferenceDetailsOfParticularCall[0];
        }
        else {
            return "not-fount";
        }
    };
    extractAllNumberOfCorrespondingUser = async (detailsOfNumbersFromUI) => {
        console.log("this is the details of call extract numbers using this : ", detailsOfNumbersFromUI);
        let x = Promise.all(detailsOfNumbersFromUI.map(async (val) => {
            const detailsOfUser = await UserPermissionUserModel_1.default.findOne({
                _id: val.userId,
            });
            let tempObj = {
                number: detailsOfUser.phone,
                ringTimeOut: val.ringTimeOut,
            };
            return await tempObj;
        }));
        //  console.log("numbers of users : " , await x);
        return await x;
    };
    handleGenerateRecordXml = async (targetNode, detailsFromVibconnect, id, nextNode) => {
        const voice = new VoiceResponse_1.default();
        // console.log("details from vibconnect : ", detailsFromVibconnect)
        // console.log("details of target node : ", targetNode)
        let maxLength = targetNode.data.maxSecond
            ? targetNode.data.maxSecond
            : "60";
        let finishOnKey = targetNode.data.finishOnKey
            ? targetNode.data.finishOnKey
            : "*";
        console.log("maxLength : ", maxLength);
        console.log("finish on key :", finishOnKey);
        let caller = detailsFromVibconnect.Caller.slice(-10);
        let callSid = detailsFromVibconnect.CallSid;
        let timeStamp = detailsFromVibconnect.Timestamp
            ? detailsFromVibconnect.Timestamp
            : new Date().getTime();
        let voiceMailBoxName = targetNode.data.voiceMailName
            ? targetNode.data.voiceMailName
            : "default";
        let voiceMailNodeId = targetNode.id ? targetNode.id : "default";
        let accountSid = detailsFromVibconnect.AccountSid
            ? detailsFromVibconnect.AccountSid
            : null;
        const data = {
            AccountSid: accountSid,
            Caller: caller,
            CallSid: callSid,
            TimeStamp: timeStamp,
            VoiceMailBoxName: voiceMailBoxName,
            VoiceMailNodeId: voiceMailNodeId,
        };
        if (callSid !== null && callSid !== undefined) {
            const record = new VoiceMailRecordModel_1.default(data);
            await record.save();
        }
        try {
            voice.record({
                action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNode}/${targetNode.id}`,
                method: "GET",
                recordingStatusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/voicemail`,
                maxLength: maxLength,
                finishOnKey: finishOnKey,
            });
            // voice.hangup()
            let xml = voice.toString();
            return xml;
        }
        catch (err) {
            console.log("error in handle generate record xml : ", err);
            let xml = voice.say(err.message);
            return xml;
        }
    };
    checkChildCallStatusOfPreviousCall = async (parentCallSid) => {
        let result = { status: false, data: {} };
        const myQuery = { ParentCallSid: parentCallSid };
        const findDetails = await ConferenceModel_1.default.find(myQuery);
        const previousCallDetails = findDetails.length > 0 ? findDetails[0] : {};
        console.log("Previous call of BHR MPC : ", previousCallDetails);
        if (previousCallDetails) {
            result = { status: true, data: previousCallDetails };
        }
        else {
            result = { status: false, data: {} };
        }
        return result;
    };
    handleMultiPartyCallDistributionOfTypeRoundRobin = async (targetNode, dataFromVibconnect, id) => {
        const voice = new VoiceResponse_1.default();
        // console.log("call type is round robin : ", targetNode , " dataFromVibconnect : ", dataFromVibconnect , " id : ", id)
        try {
            let numbersArray;
            let lastCalledNumber;
            let To = targetNode.data.mpcCallUsingNumbers[0].number;
            let From = dataFromVibconnect.To;
            let timeOut = "60";
            let url = "empty";
            if (targetNode.data.url) {
                let fullUrl = targetNode.data.url;
                // let removedHttpsUrl = fullUrl.replace("https://vibtreedan.s3.amazonaws.com/public/","")
                let removedHttpsUrl = fullUrl.split("public/");
                url = removedHttpsUrl[1];
                console.log("remove url : ", url);
            }
            if (targetNode.data.mpcCallUsingNumbers[0]) {
                timeOut = targetNode.data.mpcCallUsingNumbers[0].ringTimeOut;
            }
            if (targetNode.data.mpcCallUsing === "User") {
                console.log("this is not number this is user typ calling system");
                let detailsOfNumbersFromUI = targetNode.data.mpcCallUsingNumbers;
                const numbersFromUerID = await this.extractAllNumberOfCorrespondingUser(detailsOfNumbersFromUI);
                console.log("List of numbers from user : ", numbersFromUerID);
                numbersArray = numbersFromUerID;
            }
            if (targetNode.data.mpcCallUsing === "Number") {
                console.log("this is number this is user typ calling system");
                // numbersArray = targetNode.data.mpcCallUsingNumbers.map((number)=>{
                //     return number.number
                // })
                numbersArray = targetNode.data.mpcCallUsingNumbers;
                // console.log("numbers array : ", numbersArray)
            }
            const flowDetails = await ivrFlowUIModel_1.default.findOne({ _id: id });
            lastCalledNumber = flowDetails.lastCalledNumber;
            console.log("lastCalledNumber : ", lastCalledNumber);
            if (lastCalledNumber) {
                const lastCalledNumberIndex = numbersArray.findIndex((x) => x.number === lastCalledNumber);
                if (lastCalledNumberIndex !== -1) {
                    numbersArray.splice(lastCalledNumberIndex, 1);
                }
            }
            //by commenting this we stop checking number in realtime_db if agent available or not
            // const nextNumberIfbusy = await this.loopOverNumberToGetAvailableNumberOfAgent(correctNumberArray)
            const nextNumberIfbusy = numbersArray[0] ? numbersArray[0].number : "";
            console.log("next number if busy : ", nextNumberIfbusy);
            if (nextNumberIfbusy === "no-number") {
                console.log("no number is available");
                console.log("end conference call");
                let authId;
                let authSecretid;
                authId = targetNode.data.authId;
                authSecretid = targetNode.data.authSecret;
                const data_required_to_filter_conference_details = {
                    AccountSid: dataFromVibconnect.AccountSid,
                    ParentCallSid: dataFromVibconnect.ParentCallSid,
                    ConferenceId: "",
                    CallSid: dataFromVibconnect.ParentCallSid,
                    FriendlyName: `Room_${dataFromVibconnect.ParentCallSid}`,
                    ChildCallSid: dataFromVibconnect.ParentCallSid,
                    source: targetNode.id,
                    id: id,
                    listOfChildCallSid: [dataFromVibconnect.ParentCallSid],
                    whispherUrl: url,
                    callDistributionType: "RoundRobin",
                };
                console.log("data_required_to_filter_conference_details 3901 : ", data_required_to_filter_conference_details);
                const conference = new ConferenceModel_1.default(data_required_to_filter_conference_details);
                await conference.save();
                const responseOfConferenceEnd = this.sleep(this.getConferenceSidAndEndConference, dataFromVibconnect.ParentCallSid, authId, authSecretid);
                console.log("response of conference end : ", responseOfConferenceEnd);
            }
            else {
                To = nextNumberIfbusy;
                const body = {
                    statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call`,
                    // "statusCallback":`https://dataneuronbackend.herokuapp.com/subscribers`, //For testing Only
                    statusCallbackEvent: "initiated, ringing, answered, completed",
                    Record: "true",
                    To: To,
                    From: From,
                    Timeout: timeOut,
                    Method: "GET",
                    // "Url" : `${conf.BaseUrl}/api/getConferenceRoom/Room_${req.body.ParentCallSid}/${url}`
                    Url: `${conf.BaseUrl}/api/checkIfCustomerInLine/Room_${dataFromVibconnect.ParentCallSid}/${url}`,
                    callDistributionType: "RoundRobin",
                    recordingStatusCallback: `${conf.BaseUrl}/api//vibconnect/webhook/recordings`,
                    recordingStatusCallbackEvent: "in-progress, completed, absent",
                    recordingStatusCallbackMethod: "POST",
                    record: "true",
                };
                console.log("body : ", body);
                console.log("node credentials : ", targetNode.data.authId, " : ", targetNode.data.authSecret);
                const call_details = await this.MakeConferenceCall(targetNode.data.authId, targetNode.data.authSecret, body);
                const call_details_json = JSON.parse(call_details);
                const data_required_to_filter_conference_details = {
                    AccountSid: dataFromVibconnect.AccountSid,
                    ParentCallSid: dataFromVibconnect.ParentCallSid,
                    ConferenceId: "",
                    CallSid: call_details_json.sid,
                    FriendlyName: `Room_${dataFromVibconnect.ParentCallSid}`,
                    ChildCallSid: call_details_json.sid,
                    source: targetNode.id,
                    id: id,
                    listOfChildCallSid: [call_details_json.sid],
                    whispherUrl: url,
                    callDistributionType: "RoundRobin",
                };
                console.log("data_required_to_filter_conference_details 3709 : ", data_required_to_filter_conference_details);
                const conference = new ConferenceModel_1.default(data_required_to_filter_conference_details);
                await conference.save();
                let queryToSend = { ParentCallSid: dataFromVibconnect.ParentCallSid };
                let updateToSend = {
                    $set: { CallSidOfConferenceChildCall: call_details_json.sid },
                };
                this.updateRealTimeDataOfIvrStudiousForApiCall(queryToSend, updateToSend);
            }
            let Parent;
            Parent = voice.dial({
                action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/conference|Room_${dataFromVibconnect.ParentCallSid}/${targetNode.id}`,
                method: "GET",
            });
            Parent.conference({
                waitUrl: targetNode.data.mpcAudio,
                statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
                statusCallbackEvent: "start end join leave mute hold",
            }, `Room_${dataFromVibconnect.ParentCallSid}`);
            let xml = voice.toString();
            return xml;
        }
        catch (error) {
            voice.say(error.message);
            let xml = voice.toString();
            return xml;
        }
    };
    handleMultiPartyCallDistributionProcess = async (targetNode, dataFromVibconnect, id) => {
        const voice = new VoiceResponse_1.default();
        console.log("call type is Parallel : ", targetNode.data, dataFromVibconnect);
        try {
            //send customer in conference
            let Parent;
            Parent = voice.dial({
                action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/conference|Room_${dataFromVibconnect.ParentCallSid}/${targetNode.id}`,
                method: "GET",
            });
            Parent.conference({
                waitUrl: targetNode.data.mpcAudio,
                statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
                statusCallbackEvent: "start end join leave mute hold",
            }, `Room_${dataFromVibconnect.ParentCallSid}`);
            //send Api request of call to every agent
            let purchasedNumber = dataFromVibconnect.To;
            purchasedNumber = this.checkTheNumberContainsSymbolOrNOT(dataFromVibconnect.To);
            if (purchasedNumber.includes("223531")) {
                purchasedNumber = "+" + purchasedNumber;
            }
            let url = "empty";
            if (targetNode.data.url) {
                let fullUrl = targetNode.data.url;
                let removedHttpsUrl = fullUrl.split("public/");
                url = removedHttpsUrl[1];
            }
            let callSidOfAgents = [];
            if (targetNode.data.mpcCallUsing === "User") {
                console.log("this is not number this is user typ calling system");
                let detailsOfNumbersFromUI = targetNode.data.mpcCallUsingNumbers;
                const numbersFromUerID = await this.extractAllNumberOfCorrespondingUser(detailsOfNumbersFromUI);
                console.log("List of numbers from user : ", numbersFromUerID);
                await Promise.all(numbersFromUerID.map(async (number) => {
                    const body = {
                        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call/parallel`,
                        statusCallbackEvent: "initiated, ringing, answered, completed",
                        Record: "true",
                        To: number.number,
                        From: purchasedNumber,
                        Timeout: number.ringTimeOut,
                        Method: "GET",
                        Url: `${conf.BaseUrl}/api/getConferenceRoom/Room_${dataFromVibconnect.ParentCallSid}/${url}`,
                        recordingStatusCallback: `${conf.BaseUrl}/api//vibconnect/webhook/recordings`,
                        recordingStatusCallbackEvent: "in-progress, completed, absent",
                        recordingStatusCallbackMethod: "POST",
                        record: "true",
                    };
                    console.log("node credentials : ", targetNode.data.authId, " : ", targetNode.data.authSecret);
                    const call_details = await this.MakeConferenceCall(targetNode.data.authId, targetNode.data.authSecret, body);
                    const callDetailsJson = JSON.parse(call_details);
                    callSidOfAgents = [...callSidOfAgents, callDetailsJson.sid];
                }));
            }
            if (targetNode.data.mpcCallUsing === "Number") {
                await Promise.all(targetNode.data.mpcCallUsingNumbers.map(async (number) => {
                    const body = {
                        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call/parallel`,
                        statusCallbackEvent: "initiated, ringing, answered, completed",
                        Record: "true",
                        To: number.number,
                        From: purchasedNumber,
                        Timeout: number.ringTimeOut,
                        Method: "GET",
                        Url: `${conf.BaseUrl}/api/getConferenceRoom/Room_${dataFromVibconnect.ParentCallSid}/${url}`,
                        recordingStatusCallback: `${conf.BaseUrl}/api//vibconnect/webhook/recordings`,
                        recordingStatusCallbackEvent: "in-progress, completed, absent",
                        recordingStatusCallbackMethod: "POST",
                        record: "true",
                    };
                    console.log("node credentials : ", targetNode.data.authId, " : ", targetNode.data.authSecret);
                    const call_details = await this.MakeConferenceCall(targetNode.data.authId, targetNode.data.authSecret, body);
                    const callDetailsJson = JSON.parse(call_details);
                    callSidOfAgents = [...callSidOfAgents, callDetailsJson.sid];
                }));
            }
            const data_required_to_filter_conference_details = {
                AccountSid: dataFromVibconnect.AccountSid,
                ParentCallSid: dataFromVibconnect.ParentCallSid,
                ConferenceId: "",
                FriendlyName: `Room_${dataFromVibconnect.ParentCallSid}`,
                source: targetNode.id,
                id: id,
                callDistributionType: "Parallel",
                CallStatus: "initiated",
                listOfAgentsCallSid: [...callSidOfAgents],
                whispherUrl: url,
            };
            console.log("data_required_to_filter_conference_details 5142 : ", data_required_to_filter_conference_details);
            const conference = new ConferenceModel_1.default(data_required_to_filter_conference_details);
            await conference.save();
            console.log("callSidOfAgents : ", callSidOfAgents);
            let xml = voice.toString();
            return xml;
        }
        catch (error) {
            voice.say(error.message);
            let xml = voice.toString();
            return xml;
        }
    };
    runApiRequestInBackground = async (detailsOfTargetNode, id, customer) => {
        const request = await this.collectDetailsAndMakeRequest(detailsOfTargetNode, customer);
        // console.log("request : ",request)
        const jsonResponse = JSON.parse(request);
        const { variableArray } = detailsOfTargetNode.data;
        const exactValueAfterFilter = this.filterVariablesFromResponse(variableArray, jsonResponse);
        // console.log("exactValueAfterFilter : ",exactValueAfterFilter)
        // console.log("jsonResponse : ",jsonResponse)
        await IvrStudiousRealTime_1.default.findOneAndUpdate({ ParentCallSid: id }, { $push: { variables: exactValueAfterFilter } });
    };
    findTargetsFromSource(allNodes, source) {
        let sourceNodes = allNodes.filter((node) => {
            if (node.source === source) {
                return node;
            }
        });
        return sourceNodes;
    }
    findIfTargetIsFunction(allNodes, nodesWithSameSource) {
        for (const i in nodesWithSameSource) {
            let targetNodeId = nodesWithSameSource[i].target;
            for (const j in allNodes) {
                if (allNodes[j].id === targetNodeId) {
                    if (allNodes[j].data.requestUrl) {
                        return allNodes[j];
                    }
                }
            }
        }
    }
    convertArrayToJson(arr, customer) {
        // console.log("arr : ",arr)
        // console.log("customer 2040 : ",customer)
        let removed_sip;
        if (customer !== undefined) {
            if (customer[0] === "s") {
                let removed_ip = customer.split("@")[0];
                let x = removed_ip.split(":")[1];
                removed_sip = x.substr(x.length - 10);
            }
            if (customer[0] !== "s") {
                removed_sip = customer.substr(customer.length - 10);
            }
        }
        //  console.log("removed_sip 2051 : ",removed_sip)
        var val_to_replace = " [#Caller1]";
        //@ts-ignore
        var replace_with = removed_sip; // here we are replacing it
        if (arr.includes(val_to_replace)) {
            const x = arr.map((item) => {
                return item.replace(val_to_replace, replace_with);
            });
            // console.log("x : ",x)
            const obj = new Map();
            for (let i = 0; i < x.length; i++) {
                if (i % 2 === 0 || i === 0) {
                    obj.set(x[i], x[i + 1]);
                }
            }
            //this converts the MAP into object
            let result = Object.fromEntries(obj);
            return result;
        }
        else {
            const obj = new Map();
            for (let i = 0; i < arr.length; i++) {
                if (i % 2 === 0 || i === 0) {
                    obj.set(arr[i], arr[i + 1]);
                }
            }
            //this converts the MAP into object
            let result = Object.fromEntries(obj);
            return result;
        }
    }
    async collectDetailsAndMakeRequest(details, customer) {
        const { functionBody, requestUrl, requestMethod, headerArrays } = details.data;
        const body = this.convertArrayToJson(functionBody, customer);
        const headers = this.convertArrayToJson(headerArrays);
        console.log("body : ", body);
        // console.log("headers : ",headers)
        const options = {
            method: requestMethod,
            url: requestUrl,
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify(body),
        };
        return new Promise((resolve, reject) => {
            (0, request_1.default)(options, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                // console.log("functionBody : ", response.body)
                resolve(response.body);
            });
        });
    }
    destructuringNestedArrayAndGiveValue(array, responseObject, key) {
        let value = " ";
        switch (array.length) {
            case 1:
                if (responseObject) {
                    value = responseObject[array[0]];
                }
                break;
            case 2:
                if (responseObject[array[0]]) {
                    value = responseObject[array[0]][array[1]];
                }
                break;
            case 3:
                if (responseObject[array[0]][array[1]]) {
                    value = responseObject[array[0]][array[1]][array[2]];
                }
                break;
            case 4:
                if (responseObject[array[0]][array[1]][array[2]]) {
                    value = responseObject[array[0]][array[1]][array[2]][array[3]];
                }
                break;
            case 5:
                if (responseObject[array[0]][array[1]][array[2]][array[3]]) {
                    value =
                        responseObject[array[0]][array[1]][array[2]][array[3]][array[4]];
                }
                break;
            case 6:
                if (responseObject[array[0]][array[1]][array[2]][array[3]][array[4]]) {
                    value =
                        responseObject[array[0]][array[1]][array[2]][array[3]][array[4]][array[5]];
                }
                break;
            case 7:
                if (responseObject[array[0]][array[1]][array[2]][array[3]][array[4]][array[5]]) {
                    value =
                        responseObject[array[0]][array[1]][array[2]][array[3]][array[4]][array[5]][array[6]];
                }
                break;
            case 8:
                if (responseObject[array[0]][array[1]][array[2]][array[3]][array[4]][array[5]][array[6]]) {
                    value =
                        responseObject[array[0]][array[1]][array[2]][array[3]][array[4]][array[5]][array[6]][array[7]];
                }
                break;
            case 9:
                if (responseObject[array[0]][array[1]][array[2]][array[3]][array[4]][array[5]][array[6]][array[7]]) {
                    value =
                        responseObject[array[0]][array[1]][array[2]][array[3]][array[4]][array[5]][array[6]][array[7]][array[8]];
                }
                break;
            case 10:
                if (responseObject[array[0]][array[1]][array[2]][array[3]][array[4]][array[5]][array[6]][array[7]][array[8]]) {
                    value =
                        responseObject[array[0]][array[1]][array[2]][array[3]][array[4]][array[5]][array[6]][array[7]][array[8]][array[9]];
                }
                break;
            default:
                value = "";
                break;
        }
        let temObj = { key: key, value: value };
        return temObj;
    }
    filterVariablesFromResponse(variableArray, responseObject) {
        const valueFromResponse = [];
        for (const i in variableArray) {
            const x = this.destructuringNestedArrayAndGiveValue(variableArray[i].variable_value.split("."), responseObject, variableArray[i].variable_name);
            console.log("x : ", x);
            valueFromResponse.push(x);
        }
        // console.log("valueFromResponse 2564 : ",valueFromResponse)
        if (valueFromResponse.length > 0) {
            const x = valueFromResponse.filter((item) => {
                // if(item.value !== " " || item.value !== undefined){
                //     return item
                // }
                return item.value !== " ";
            });
            const y = x.filter((item) => {
                return item.value !== undefined;
            });
            // console.log("x 2569 : ",y)
            return y;
            // for(let i=0; i<valueFromResponse.length; i++){
            //     if(valueFromResponse[i].value === " " || valueFromResponse[i].value == undefined || valueFromResponse[i].value == null){
            //         // valueFromResponse.splice(i,1)
            //         console.log("valueFromResponse[i].value : ",valueFromResponse[i].value)
            //     }
            // }
        }
        // console.log("valueFromResponse 2572 : ",valueFromResponse)
        return valueFromResponse;
    }
    removeFunctionNodeIdFromNextNode(allNodes, filteredNode) {
        // console.log("allNodes : ",allNodes)
        // console.log("filteredNode : ",filteredNode)
        let nextNodeId;
        for (const i in allNodes) {
            for (const j in filteredNode) {
                if (filteredNode[j].target === allNodes[i].id &&
                    allNodes[i].data.requestUrl === undefined) {
                    // allNodes[i].nextNode = filteredNode[j].nextNode
                    // console.log("allNodes[i].nextNode : ",allNodes[i].id)
                    nextNodeId = allNodes[i].id;
                }
            }
        }
        //@ts-ignore
        return nextNodeId;
    }
    checkTheNumberContainsSymbolOrNOT(number) {
        // console.log("number : ", number);
        number = decodeURIComponent(number);
        if (number.includes("+")) {
            return number.replace(/[^0-9]/g, "");
        }
        return number;
    }
    getNameOfDay(num) {
        switch (num) {
            case 0:
                return "Sunday";
                break;
            case 1:
                return "Monday";
                break;
            case 2:
                return "Tuesday";
                break;
            case 3:
                return "Wednesday";
                break;
            case 4:
                return "Thursday";
                break;
            case 5:
                return "Friday";
                break;
            case 6:
                return "Saturday";
                break;
            default:
                return " ";
                break;
        }
    }
    getStartAndEndTimeFromMultipleTimeInSingleDay(data, currentTime) {
        // console.log("Data : ", data.timeArray);
        // console.log("currentTime : ", currentTime);
        let startDate;
        let endDate;
        if (data.timeArray !== undefined) {
            if (data.timeArray.length > 0) {
                for (let i = 0; i < data.timeArray.length; i++) {
                    let start = (0, moment_1.default)(data.timeArray[i].startTime, "HH:mm:ss").format();
                    let end = (0, moment_1.default)(data.timeArray[i].endTime, "HH:mm:ss").format();
                    // console.log("start in function : ", start);
                    // console.log("end in function : ", end);
                    if ((0, moment_1.default)(currentTime).isBetween(start, end)) {
                        console.log("Yes it is between selected multiple time zone");
                        console.log("start : ", start);
                        console.log("end : ", end);
                        console.log("currentTime : ", currentTime);
                        startDate = start;
                        endDate = end;
                        break;
                    }
                    else {
                        // console.log("No it is not between selected multiple time zone");
                        // console.log("start : ", start);
                        // console.log("end : ", end);
                        // console.log("currentTime : ", currentTime);
                        if (data.timeArray[i].startTime !== undefined) {
                            startDate = (0, moment_1.default)(data.timeArray[i].startTime, "HH:mm:ss").format();
                        }
                        if (data.timeArray[i].endTime !== undefined) {
                            endDate = (0, moment_1.default)(data.timeArray[i].endTime, "HH:mm:ss").format();
                        }
                    }
                }
            }
        }
        else {
            startDate = (0, moment_1.default)(data.startTime, "HH:mm:ss").format();
            endDate = (0, moment_1.default)(data.endTime, "HH:mm:ss").format();
        }
        let output = { startTime: startDate, endTime: endDate };
        // console.log("output : ", output);
        return output;
    }
    //step one
    zohoIntegerationForParticularClient = async (data) => {
        let url = conf.ZOHO_INTEGERATION_URL + '/api/contacts/save';
        const body = data;
        const options = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        };
        return new Promise((resolve, reject) => {
            httpClient(options, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                resolve(body);
            });
        });
    };
    async createIvrFlowAccordingToUIFlowVersionTwo(req, res) {
        res.set("Content-Type", "text/xml");
        const defaultVri = new VoiceResponse_1.default();
        const authID = req.query.AccountSid;
        let purchasedNumber = req.query.To;
        const data = req.query;
        (0, callXmlGenerator_1.getOrCreateContact)(data);
        purchasedNumber = this.checkTheNumberContainsSymbolOrNOT(req.query.To);
        // console.log("purchasedNumber : ", purchasedNumber.length, purchasedNumber);
        // console.log("x : ", x)
        let dateAfterThreeDay;
        let timeAfterThreeHour;
        dateAfterThreeDay = (0, moment_1.default)().add(2, "d").toDate();
        timeAfterThreeHour = (0, moment_1.default)().add(3, "hours").toDate();
        if (req.query !== undefined || req.query !== null) {
            let body = req.query;
            if (authID === "4I8LSQ37HRWBC998VFJ7") {
                this.zohoIntegerationForParticularClient(body);
            }
            const ivr_studios_status_call_back = new ivrStudiosModelCallBacks_1.default({
                ...body,
                source: "gather_response_query_ivr_flow",
                expireDate: dateAfterThreeDay,
            });
            ivr_studios_status_call_back.save();
        }
        try {
            const voice = new VoiceResponse_1.default();
            const data = await ivrFlowUIModel_1.default.findOne({
                auth_id: authID,
                number: purchasedNumber,
            });
            if (!data?.active) {
                logger_1.default.warn(`WorkFlow of incoming call is not active in -> ${purchasedNumber}`);
                voice.hangup();
                return res.send(voice.toString());
            }
            if (!data?.haveCredits) {
                logger_1.default.warn(`No credits in Account ${authID} in number -> ${purchasedNumber}`);
                voice.hangup();
                return res.send(voice.toString());
            }
            //@ts-ignore
            const document_id = data._id;
            //@ts-ignore
            const connectors = data.input.filter((item) => {
                if (item.type == "buttonedge") {
                    return item;
                }
            });
            //@ts-ignore
            const firstNode = data.input.find((item) => {
                if (item.data !== undefined) {
                    if (item.data.cloudNumber !== undefined) {
                        if (item.data.cloudNumber === purchasedNumber) {
                            return item;
                        }
                        // return item
                    }
                }
            });
            //@ts-ignore
            let sourceId_to_find_in_next_connector = firstNode.id;
            const nextNode = connectors.find((item) => {
                if (item.source === sourceId_to_find_in_next_connector) {
                    return item;
                }
            });
            const nextNodeId = nextNode.target;
            const nextNodeData = data.input?.find((item) => {
                if (item.id === nextNodeId) {
                    return item;
                }
            });
            // console.log("Next Node : ", nextNodeData);
            if (nextNodeData.type === "PlayAudioNode") {
                const newRealTime = new IvrStudiousRealTime_1.default({
                    ...req.query,
                    source: "Web",
                    expireDate: timeAfterThreeHour,
                });
                await newRealTime.save();
                const nextNode_for_action = connectors.find((item) => {
                    if (item.source === nextNodeId) {
                        return item;
                    }
                });
                const nextNode_for_action_id_data = nextNode_for_action.target;
                const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, nextNodeId, nextNode_for_action_id_data, nextNodeData.data);
                return res.send(xmlFromHelper);
            }
            if (nextNodeData.type === "ivrNode") {
                const newRealTime = new IvrStudiousRealTime_1.default({
                    ...req.query,
                    source: "Web",
                    expireDate: timeAfterThreeHour,
                });
                await newRealTime.save();
                const xml = (0, callXmlGenerator_1.generateXmlForIvrNode)(document_id, nextNodeId, sourceId_to_find_in_next_connector, nextNodeData.data);
                return res.send(xml);
            }
            if (nextNodeData.type === "BusinessHourNode") {
                // const newRealTime = new IvrStudiosRealTime({...req.query, source:"Web" , expireDate : timeAfterThreeHour})
                // await newRealTime.save()
                let nodeDetails = nextNodeData.data;
                console.log("nodeDetails : ", nodeDetails);
                if (nodeDetails) {
                    if (nodeDetails.bHourOption == "anytime") {
                        voice.hangup();
                        const xml = voice.toString();
                        return res.send(xml);
                    }
                    else {
                        for (let i = 0; i < nodeDetails.bHourDays.length; i++) {
                            if (nodeDetails.bHourDays[i].isWorking === true) {
                                const currentTime = new Date();
                                const currentDay = this.getNameOfDay(currentTime.getDay());
                                // console.log(
                                //   "currentDay : ",
                                //   currentDay,
                                //   nodeDetails.bHourDays[i].day
                                // );
                                if (currentDay.toLowerCase() ==
                                    nodeDetails.bHourDays[i].day.toLowerCase()) {
                                    // console.log(
                                    //   "nodeDetails.bHourDays[i] : ",
                                    //   nodeDetails.bHourDays[i]
                                    // );
                                    const now = (0, moment_1.default)()
                                        .add(5, "hours")
                                        .add(30, "minutes")
                                        .format(); // in local it is fine but in live it is giving actual time so dont need to add hours
                                    //const now = moment().format()
                                    const tempStartEndObj = await this.getStartAndEndTimeFromMultipleTimeInSingleDay(nodeDetails.bHourDays[i], now);
                                    // console.log("tempStartEndObj : ", tempStartEndObj);
                                    let { startTime, endTime } = tempStartEndObj;
                                    const start = startTime;
                                    const end = endTime;
                                    let bussinessHourNodeId = nextNodeData.id;
                                    // console.log("bussinessHourNodeId : ",bussinessHourNodeId)
                                    if ((0, moment_1.default)(now).isBetween(start, end)) {
                                        console.log("is between : now -> ", now, "start -> ", start, "end -> ", end);
                                        // console.log("connectors : ", connectors)
                                        const nextNodeConnectedToBussinessHourNodeOn = connectors.filter((item) => {
                                            if (item.source === bussinessHourNodeId &&
                                                item.sourceHandle == "businesshourOn") {
                                                return item;
                                            }
                                        });
                                        // console.log(
                                        //   "nextNodeConnectedToBussinessHourNode : ",
                                        //   nextNodeConnectedToBussinessHourNodeOn
                                        // );
                                        const nextNodeIfSuccess = data.input?.find((item) => {
                                            if (item.id ===
                                                nextNodeConnectedToBussinessHourNodeOn[0].target) {
                                                return item;
                                            }
                                        });
                                        // console.log("nextNodeIfSuccess : ",nextNodeIfSuccess)
                                        if (nextNodeIfSuccess) {
                                            console.log("next node if not succes 6842 ", nextNodeIfSuccess);
                                            if (nextNodeIfSuccess.type === "ivrNode") {
                                                const newRealTime = new IvrStudiousRealTime_1.default({
                                                    ...req.query,
                                                    source: "Web",
                                                    expireDate: timeAfterThreeHour,
                                                });
                                                await newRealTime.save();
                                                const xml = (0, callXmlGenerator_1.generateXmlForIvrNode)(document_id, nextNodeIfSuccess.id, sourceId_to_find_in_next_connector, nextNodeIfSuccess.data);
                                                return res.send(xml);
                                            }
                                            if (nextNodeIfSuccess.type === "PlayAudioNode") {
                                                const newRealTime = new IvrStudiousRealTime_1.default({
                                                    ...req.query,
                                                    source: "Web",
                                                    expireDate: timeAfterThreeHour,
                                                });
                                                await newRealTime.save();
                                                const nextNode_for_action = connectors.find((item) => {
                                                    if (item.source === nextNodeIfSuccess.id) {
                                                        return item;
                                                    }
                                                });
                                                const nextNode_for_action_id_data = nextNode_for_action.target;
                                                const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, nextNodeIfSuccess.id, nextNode_for_action_id_data, nextNodeIfSuccess.data);
                                                return res.send(xmlFromHelper);
                                            }
                                            if (nextNodeIfSuccess.type === "MultiPartyCallNode") {
                                                const newRealTime = new IvrStudiousRealTime_1.default({
                                                    ...req.query,
                                                    source: "Web",
                                                    expireDate: timeAfterThreeHour,
                                                });
                                                await newRealTime.save();
                                                const dataFromVibconnect = req.query;
                                                const xml = await (0, callXmlGenerator_1.generateXmlForMultiPartyCallNode)(document_id, nextNodeIfSuccess.id, nextNodeIfSuccess.id, nextNodeIfSuccess.data, dataFromVibconnect);
                                                return res.send(xml);
                                            }
                                            if (nextNodeIfSuccess.type === "MessageNode") {
                                                let makePlayXml = false;
                                                let playNodeDetails;
                                                let playNodeId;
                                                if (nextNodeConnectedToBussinessHourNodeOn.length === 1) {
                                                    const dataFromVibconnect = req.query;
                                                    const xml = await (0, callXmlGenerator_1.generateXmlForMessage)(nextNodeIfSuccess.data, dataFromVibconnect);
                                                    return res.send(xml);
                                                }
                                                if (nextNodeConnectedToBussinessHourNodeOn.length > 1) {
                                                    // console.log(
                                                    //   "Try to search play node it will be there."
                                                    // );
                                                    for (let i = 0; i < nextNodeConnectedToBussinessHourNodeOn.length; i++) {
                                                        const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                            nextNodeConnectedToBussinessHourNodeOn[i].target);
                                                        if (detailsOfTargetNode.type == "MessageNode") {
                                                            const dataFromVibconnect = req.query;
                                                            //not making it async await because it is making API response slow and we dont need to send message first then play
                                                            (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                                        }
                                                        if (detailsOfTargetNode.type == "PlayAudioNode") {
                                                            makePlayXml = true;
                                                            playNodeDetails = detailsOfTargetNode.data;
                                                            playNodeId = detailsOfTargetNode.id;
                                                        }
                                                    }
                                                }
                                                if (makePlayXml) {
                                                    const nextNode_for_action = connectors.find((item) => {
                                                        if (item.source === playNodeId) {
                                                            return item;
                                                        }
                                                    });
                                                    const nextNode_for_action_id_data = nextNode_for_action.target;
                                                    const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                                                    return res.send(xmlFromHelper);
                                                }
                                            }
                                            if (nextNodeIfSuccess.type === "BusinessHourNode") {
                                                let nodeDetails = nextNodeIfSuccess.data;
                                                // console.log("nodeDetails : ", nodeDetails);
                                                if (nextNodeIfSuccess) {
                                                    if (nodeDetails.bHourOption == "anytime") {
                                                        voice.hangup();
                                                        const xml = voice.toString();
                                                        return res.send(xml);
                                                    }
                                                    else {
                                                        for (let i = 0; i < nextNodeIfSuccess.data.bHourDays.length; i++) {
                                                            if (nodeDetails.bHourDays[i].isWorking === true) {
                                                                const currentTime = new Date();
                                                                const currentDay = this.getNameOfDay(currentTime.getDay());
                                                                // console.log(
                                                                //   "currentDay : ",
                                                                //   currentDay,
                                                                //   nodeDetails.bHourDays[i].day
                                                                // );
                                                                if (currentDay.toLowerCase() ==
                                                                    nodeDetails.bHourDays[i].day.toLowerCase()) {
                                                                    // console.log(
                                                                    //   "nodeDetails.bHourDays[i] : ",
                                                                    //   nodeDetails.bHourDays[i]
                                                                    // );
                                                                    const now = (0, moment_1.default)()
                                                                        .add(5, "hours")
                                                                        .add(30, "minutes")
                                                                        .format(); // in local it is fine but in live it is giving actual time so dont need to add hours
                                                                    //const now = moment().format()
                                                                    const tempStartEndObj = await this.getStartAndEndTimeFromMultipleTimeInSingleDay(nodeDetails.bHourDays[i], now);
                                                                    // console.log(
                                                                    //   "tempStartEndObj : ",
                                                                    //   tempStartEndObj
                                                                    // );
                                                                    let { startTime, endTime } = tempStartEndObj;
                                                                    const start = startTime;
                                                                    const end = endTime;
                                                                    let bussinessHourNodeId = nextNodeIfSuccess.id;
                                                                    // console.log("bussinessHourNodeId : ",bussinessHourNodeId)
                                                                    if ((0, moment_1.default)(now).isBetween(start, end)) {
                                                                        // console.log(
                                                                        //   "is between : now -> ",
                                                                        //   now,
                                                                        //   "start  ",
                                                                        //   start,
                                                                        //   "end : ",
                                                                        //   end
                                                                        // );
                                                                        // console.log("connectors : ", connectors)
                                                                        const nextNodeConnectedToBussinessHourNodeOn = connectors.filter((item) => {
                                                                            if (item.source === bussinessHourNodeId &&
                                                                                item.sourceHandle == "businesshourOn") {
                                                                                return item;
                                                                            }
                                                                        });
                                                                        // console.log(
                                                                        //   "nextNodeConnectedToBussinessHourNode : ",
                                                                        //   nextNodeConnectedToBussinessHourNodeOn
                                                                        // );
                                                                        const nextNodeIfSuccess = data.input?.filter((item) => {
                                                                            if (item.id ===
                                                                                nextNodeConnectedToBussinessHourNodeOn[0]
                                                                                    .target) {
                                                                                return item;
                                                                            }
                                                                        });
                                                                        // console.log(
                                                                        //   "nextNodeIfSuccess : ",
                                                                        //   nextNodeIfSuccess
                                                                        // );
                                                                        if (nextNodeIfSuccess.length > 0) {
                                                                            // console.log(
                                                                            //   "next node if not succes 8485",
                                                                            //   nextNodeIfSuccess[0]
                                                                            // );
                                                                            if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                                                const newRealTime = new IvrStudiousRealTime_1.default({
                                                                                    ...req.query,
                                                                                    source: "Web",
                                                                                    expireDate: timeAfterThreeHour,
                                                                                });
                                                                                await newRealTime.save();
                                                                                const xml = (0, callXmlGenerator_1.generateXmlForIvrNode)(document_id, nextNodeIfSuccess[0].id, sourceId_to_find_in_next_connector, nextNodeIfSuccess[0].data);
                                                                                return res.send(xml);
                                                                            }
                                                                            if (nextNodeIfSuccess[0].type ===
                                                                                "PlayAudioNode") {
                                                                                const nextNode_for_action = connectors.find((item) => {
                                                                                    if (item.source ===
                                                                                        nextNodeIfSuccess[0].id) {
                                                                                        return item;
                                                                                    }
                                                                                });
                                                                                const nextNode_for_action_id_data = nextNode_for_action.target;
                                                                                const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, nextNodeIfSuccess[0].id, nextNode_for_action_id_data, nextNodeIfSuccess[0].data);
                                                                                return res.send(xmlFromHelper);
                                                                            }
                                                                            if (nextNodeIfSuccess[0].type ===
                                                                                "MessageNode") {
                                                                                let makePlayXml = false;
                                                                                let playNodeDetails;
                                                                                let playNodeId;
                                                                                if (nextNodeConnectedToBussinessHourNodeOn.length ===
                                                                                    1) {
                                                                                    const dataFromVibconnect = req.query;
                                                                                    const xml = await (0, callXmlGenerator_1.generateXmlForMessage)(nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                                                    return res.send(xml);
                                                                                }
                                                                                if (nextNodeConnectedToBussinessHourNodeOn.length >
                                                                                    1) {
                                                                                    console.log("Try to search play node it will be there.");
                                                                                    for (let i = 0; i <
                                                                                        nextNodeConnectedToBussinessHourNodeOn.length; i++) {
                                                                                        const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                                                            nextNodeConnectedToBussinessHourNodeOn[i].target);
                                                                                        if (detailsOfTargetNode.type ==
                                                                                            "MessageNode") {
                                                                                            const dataFromVibconnect = req.query;
                                                                                            //not making it async await because it is making API response slow and we dont need to send message first then play
                                                                                            (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                                                                        }
                                                                                        if (detailsOfTargetNode.type ==
                                                                                            "PlayAudioNode") {
                                                                                            makePlayXml = true;
                                                                                            playNodeDetails =
                                                                                                detailsOfTargetNode.data;
                                                                                            playNodeId =
                                                                                                detailsOfTargetNode.id;
                                                                                        }
                                                                                    }
                                                                                }
                                                                                if (makePlayXml) {
                                                                                    const nextNode_for_action = connectors.find((item) => {
                                                                                        if (item.source === playNodeId) {
                                                                                            return item;
                                                                                        }
                                                                                    });
                                                                                    const nextNode_for_action_id_data = nextNode_for_action.target;
                                                                                    const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                                                                                    return res.send(xmlFromHelper);
                                                                                }
                                                                            }
                                                                            if (nextNodeIfSuccess[0].type ===
                                                                                "MultiPartyCallNode") {
                                                                                const newRealTime = new IvrStudiousRealTime_1.default({
                                                                                    ...req.query,
                                                                                    source: "Web",
                                                                                    expireDate: timeAfterThreeHour,
                                                                                });
                                                                                await newRealTime.save();
                                                                                const dataFromVibconnect = req.query;
                                                                                const xml = await (0, callXmlGenerator_1.generateXmlForMultiPartyCallNode)(document_id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                                                return res.send(xml);
                                                                            }
                                                                        }
                                                                    }
                                                                    else {
                                                                        const nextNodeConnectedToBussinessHourNodeOff = connectors.filter((item) => {
                                                                            if (item.source === bussinessHourNodeId &&
                                                                                item.sourceHandle == "businesshourOff") {
                                                                                return item;
                                                                            }
                                                                        });
                                                                        // console.log("nextNodeConnectedToBussinessHourNodeOff : ", nextNodeConnectedToBussinessHourNodeOff)
                                                                        // console.log(
                                                                        //   "is not between : now -> ",
                                                                        //   now,
                                                                        //   "start -> ",
                                                                        //   start,
                                                                        //   "end -> ",
                                                                        //   end
                                                                        // );
                                                                        const nextNodeIfSuccess = data.input?.filter((item) => {
                                                                            for (let i = 0; i <
                                                                                nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                                                if (item.id ===
                                                                                    nextNodeConnectedToBussinessHourNodeOff[i].target) {
                                                                                    return item;
                                                                                }
                                                                            }
                                                                            // if(item.id === nextNodeConnectedToBussinessHourNodeOff[0].target){
                                                                            //     return item
                                                                            // }
                                                                        });
                                                                        // console.log(
                                                                        //   "if bussiness hour off nextNodeIfSuccess : ",
                                                                        //   nextNodeIfSuccess
                                                                        // );
                                                                        if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                                            const newRealTime = new IvrStudiousRealTime_1.default({
                                                                                ...req.query,
                                                                                source: "Web",
                                                                                expireDate: timeAfterThreeHour,
                                                                            });
                                                                            await newRealTime.save();
                                                                            const xml = (0, callXmlGenerator_1.generateXmlForIvrNode)(document_id, nextNodeIfSuccess[0].id, sourceId_to_find_in_next_connector, nextNodeIfSuccess[0].data);
                                                                            return res.send(xml);
                                                                        }
                                                                        if (nextNodeIfSuccess[0].type ===
                                                                            "PlayAudioNode") {
                                                                            let makePlayXml = false;
                                                                            let playNodeDetails;
                                                                            let playNodeId;
                                                                            if (nextNodeConnectedToBussinessHourNodeOff.length ===
                                                                                1) {
                                                                                const nextNode_for_action = connectors.find((item) => {
                                                                                    if (item.source ===
                                                                                        nextNodeIfSuccess[0].id) {
                                                                                        return item;
                                                                                    }
                                                                                });
                                                                                const nextNode_for_action_id_data = nextNode_for_action.target;
                                                                                const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, nextNodeIfSuccess[0].id, nextNode_for_action_id_data, nextNodeIfSuccess[0].data);
                                                                                return res.send(xmlFromHelper);
                                                                            }
                                                                            if (nextNodeConnectedToBussinessHourNodeOff.length >
                                                                                1) {
                                                                                // console.log(
                                                                                //   "Try to search play node it will be there."
                                                                                // );
                                                                                for (let i = 0; i <
                                                                                    nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                                                    const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                                                        nextNodeConnectedToBussinessHourNodeOff[i].target);
                                                                                    if (detailsOfTargetNode.type ==
                                                                                        "MessageNode") {
                                                                                        const dataFromVibconnect = req.query;
                                                                                        //not making it async await because it is making API response slow and we dont need to send message first then play
                                                                                        (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                                                                    }
                                                                                    if (detailsOfTargetNode.type ==
                                                                                        "PlayAudioNode") {
                                                                                        makePlayXml = true;
                                                                                        playNodeDetails =
                                                                                            detailsOfTargetNode.data;
                                                                                        playNodeId = detailsOfTargetNode.id;
                                                                                    }
                                                                                }
                                                                            }
                                                                            if (makePlayXml) {
                                                                                const nextNode_for_action = connectors.find((item) => {
                                                                                    if (item.source === playNodeId) {
                                                                                        return item;
                                                                                    }
                                                                                });
                                                                                const nextNode_for_action_id_data = nextNode_for_action.target;
                                                                                const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                                                                                return res.send(xmlFromHelper);
                                                                            }
                                                                        }
                                                                        if (nextNodeIfSuccess[0].type ===
                                                                            "MessageNode") {
                                                                            let makePlayXml = false;
                                                                            let playNodeDetails;
                                                                            let playNodeId;
                                                                            if (nextNodeConnectedToBussinessHourNodeOff.length ===
                                                                                1) {
                                                                                const dataFromVibconnect = req.query;
                                                                                const xml = await (0, callXmlGenerator_1.generateXmlForMessage)(nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                                                return res.send(xml);
                                                                            }
                                                                            if (nextNodeConnectedToBussinessHourNodeOff.length >
                                                                                1) {
                                                                                // console.log(
                                                                                //   "Try to search play node it will be there."
                                                                                // );
                                                                                for (let i = 0; i <
                                                                                    nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                                                    const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                                                        nextNodeConnectedToBussinessHourNodeOff[i].target);
                                                                                    if (detailsOfTargetNode.type ==
                                                                                        "MessageNode") {
                                                                                        const dataFromVibconnect = req.query;
                                                                                        //not making it async await because it is making API response slow and we dont need to send message first then play
                                                                                        (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                                                                    }
                                                                                    if (detailsOfTargetNode.type ==
                                                                                        "PlayAudioNode") {
                                                                                        makePlayXml = true;
                                                                                        playNodeDetails =
                                                                                            detailsOfTargetNode.data;
                                                                                        playNodeId = detailsOfTargetNode.id;
                                                                                    }
                                                                                }
                                                                            }
                                                                            if (makePlayXml) {
                                                                                const nextNode_for_action = connectors.find((item) => {
                                                                                    if (item.source === playNodeId) {
                                                                                        return item;
                                                                                    }
                                                                                });
                                                                                const nextNode_for_action_id_data = nextNode_for_action.target;
                                                                                const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                                                                                return res.send(xmlFromHelper);
                                                                            }
                                                                        }
                                                                        if (nextNodeIfSuccess[0].type ===
                                                                            "MultiPartyCallNode") {
                                                                            const newRealTime = new IvrStudiousRealTime_1.default({
                                                                                ...req.query,
                                                                                source: "Web",
                                                                                expireDate: timeAfterThreeHour,
                                                                            });
                                                                            await newRealTime.save();
                                                                            const dataFromVibconnect = req.query;
                                                                            const xml = await (0, callXmlGenerator_1.generateXmlForMultiPartyCallNode)(document_id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                                            return res.send(xml);
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        const nextNodeConnectedToBussinessHourNodeOff = connectors.filter((item) => {
                                            if (item.source === bussinessHourNodeId &&
                                                item.sourceHandle == "businesshourOff") {
                                                return item;
                                            }
                                        });
                                        // console.log("nextNodeConnectedToBussinessHourNodeOff : ", nextNodeConnectedToBussinessHourNodeOff)
                                        console.log("is not between : now -> ", now, "start -> ", start, "end -> ", end);
                                        const nextNodeIfSuccess = data.input?.filter((item) => {
                                            for (let i = 0; i < nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                if (item.id ===
                                                    nextNodeConnectedToBussinessHourNodeOff[i].target) {
                                                    return item;
                                                }
                                            }
                                            // if(item.id === nextNodeConnectedToBussinessHourNodeOff[0].target){
                                            //     return item
                                            // }
                                        });
                                        // console.log(
                                        //   "if bussiness hour off nextNodeIfSuccess 8400 : ",
                                        //   nextNodeIfSuccess
                                        // );
                                        if (nextNodeIfSuccess[0].type === "ivrNode") {
                                            const newRealTime = new IvrStudiousRealTime_1.default({
                                                ...req.query,
                                                source: "Web",
                                                expireDate: timeAfterThreeHour,
                                            });
                                            await newRealTime.save();
                                            const xml = (0, callXmlGenerator_1.generateXmlForIvrNode)(document_id, nextNodeIfSuccess[0].id, sourceId_to_find_in_next_connector, nextNodeIfSuccess[0].data);
                                            return res.send(xml);
                                        }
                                        if (nextNodeIfSuccess[0].type === "PlayAudioNode") {
                                            let makePlayXml = false;
                                            let playNodeDetails;
                                            let playNodeId;
                                            if (nextNodeConnectedToBussinessHourNodeOff.length === 1) {
                                                const nextNode_for_action = connectors.find((item) => {
                                                    if (item.source === nextNodeIfSuccess[0].id) {
                                                        return item;
                                                    }
                                                });
                                                const nextNode_for_action_id_data = nextNode_for_action.target;
                                                const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, nextNodeIfSuccess[0].id, nextNode_for_action_id_data, nextNodeIfSuccess[0].data);
                                                return res.send(xmlFromHelper);
                                            }
                                            if (nextNodeConnectedToBussinessHourNodeOff.length > 1) {
                                                // console.log(
                                                //   "Try to search play node it will be there."
                                                // );
                                                for (let i = 0; i < nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                    const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                        nextNodeConnectedToBussinessHourNodeOff[i].target);
                                                    if (detailsOfTargetNode.type == "MessageNode") {
                                                        const dataFromVibconnect = req.query;
                                                        //not making it async await because it is making API response slow and we dont need to send message first then play
                                                        (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                                    }
                                                    if (detailsOfTargetNode.type == "PlayAudioNode") {
                                                        makePlayXml = true;
                                                        playNodeDetails = detailsOfTargetNode.data;
                                                        playNodeId = detailsOfTargetNode.id;
                                                    }
                                                }
                                            }
                                            if (makePlayXml) {
                                                const nextNode_for_action = connectors.find((item) => {
                                                    if (item.source === playNodeId) {
                                                        return item;
                                                    }
                                                });
                                                const nextNode_for_action_id_data = nextNode_for_action.target;
                                                const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                                                return res.send(xmlFromHelper);
                                            }
                                        }
                                        if (nextNodeIfSuccess[0].type === "MessageNode") {
                                            let makePlayXml = false;
                                            let playNodeDetails;
                                            let playNodeId;
                                            if (nextNodeConnectedToBussinessHourNodeOff.length === 1) {
                                                const dataFromVibconnect = req.query;
                                                const xml = await (0, callXmlGenerator_1.generateXmlForMessage)(nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                return res.send(xml);
                                            }
                                            if (nextNodeConnectedToBussinessHourNodeOff.length > 1) {
                                                // console.log(
                                                //   "Try to search play node it will be there."
                                                // );
                                                for (let i = 0; i < nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                    const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                        nextNodeConnectedToBussinessHourNodeOff[i].target);
                                                    if (detailsOfTargetNode.type == "MessageNode") {
                                                        const dataFromVibconnect = req.query;
                                                        //not making it async await because it is making API response slow and we dont need to send message first then play
                                                        (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                                    }
                                                    if (detailsOfTargetNode.type == "PlayAudioNode") {
                                                        makePlayXml = true;
                                                        playNodeDetails = detailsOfTargetNode.data;
                                                        playNodeId = detailsOfTargetNode.id;
                                                    }
                                                }
                                            }
                                            if (makePlayXml) {
                                                const nextNode_for_action = connectors.find((item) => {
                                                    if (item.source === playNodeId) {
                                                        return item;
                                                    }
                                                });
                                                const nextNode_for_action_id_data = nextNode_for_action.target;
                                                const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                                                return res.send(xmlFromHelper);
                                            }
                                        }
                                        if (nextNodeIfSuccess[0].type === "BusinessHourNode") {
                                            let nodeDetails = nextNodeIfSuccess[0].data;
                                            // console.log("nodeDetails : ", nodeDetails);
                                            if (nextNodeIfSuccess.length > 0) {
                                                if (nodeDetails.bHourOption == "anytime") {
                                                    let bussinessHourNodeId = nodeDetails.id;
                                                    const nextNodeConnectedToBussinessHourNodeOn = connectors.filter((item) => {
                                                        if (item.source === bussinessHourNodeId &&
                                                            item.sourceHandle == "businesshourOn") {
                                                            return item;
                                                        }
                                                    });
                                                    const nextNodeIfSuccess = data.input?.filter((item) => {
                                                        if (item.id ===
                                                            nextNodeConnectedToBussinessHourNodeOn[0].target) {
                                                            return item;
                                                        }
                                                    });
                                                    if (nextNodeIfSuccess.length > 0) {
                                                        // console.log(
                                                        //   "next node if succes ",
                                                        //   nextNodeIfSuccess[0]
                                                        // );
                                                        if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                            const newRealTime = new IvrStudiousRealTime_1.default({
                                                                ...req.query,
                                                                source: "Web",
                                                                expireDate: timeAfterThreeHour,
                                                            });
                                                            await newRealTime.save();
                                                            const xml = (0, callXmlGenerator_1.generateXmlForIvrNode)(document_id, nextNodeIfSuccess[0].id, sourceId_to_find_in_next_connector, nextNodeIfSuccess[0].data);
                                                            return res.send(xml);
                                                        }
                                                        // if(nextNodeIfSuccess[0].type === 'PlayAudioNode'){
                                                        //     const nextNode_for_action = connectors.find((item : any)=>{
                                                        //         if(item.source === nextNodeIfSuccess[0].id){
                                                        //             return item
                                                        //         }
                                                        //     })
                                                        //     const nextNode_for_action_id_data = nextNode_for_action.target
                                                        //     const xmlFromHelper = generateXmlForPlayNode( document_id , nextNodeIfSuccess[0].id ,nextNode_for_action_id_data, nextNodeIfSuccess[0].data)
                                                        //     return res.send(xmlFromHelper)
                                                        // }
                                                        if (nextNodeIfSuccess[0].type === "PlayAudioNode") {
                                                            let makePlayXml = false;
                                                            let playNodeDetails;
                                                            let playNodeId;
                                                            if (nextNodeConnectedToBussinessHourNodeOff.length ===
                                                                1) {
                                                                const nextNode_for_action = connectors.find((item) => {
                                                                    if (item.source === nextNodeIfSuccess[0].id) {
                                                                        return item;
                                                                    }
                                                                });
                                                                const nextNode_for_action_id_data = nextNode_for_action.target;
                                                                const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, nextNodeIfSuccess[0].id, nextNode_for_action_id_data, nextNodeIfSuccess[0].data);
                                                                return res.send(xmlFromHelper);
                                                            }
                                                            if (nextNodeConnectedToBussinessHourNodeOff.length >
                                                                1) {
                                                                // console.log(
                                                                //   "Try to search play node it will be there."
                                                                // );
                                                                for (let i = 0; i <
                                                                    nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                                    const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                                        nextNodeConnectedToBussinessHourNodeOff[i]
                                                                            .target);
                                                                    if (detailsOfTargetNode.type == "MessageNode") {
                                                                        const dataFromVibconnect = req.query;
                                                                        //not making it async await because it is making API response slow and we dont need to send message first then play
                                                                        (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                                                    }
                                                                    if (detailsOfTargetNode.type == "PlayAudioNode") {
                                                                        makePlayXml = true;
                                                                        playNodeDetails = detailsOfTargetNode.data;
                                                                        playNodeId = detailsOfTargetNode.id;
                                                                    }
                                                                }
                                                            }
                                                            if (makePlayXml) {
                                                                const nextNode_for_action = connectors.find((item) => {
                                                                    if (item.source === playNodeId) {
                                                                        return item;
                                                                    }
                                                                });
                                                                const nextNode_for_action_id_data = nextNode_for_action.target;
                                                                const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                                                                return res.send(xmlFromHelper);
                                                            }
                                                        }
                                                        if (nextNodeIfSuccess[0].type === "MessageNode") {
                                                            let makePlayXml = false;
                                                            let playNodeDetails;
                                                            let playNodeId;
                                                            if (nextNodeConnectedToBussinessHourNodeOff.length ===
                                                                1) {
                                                                const dataFromVibconnect = req.query;
                                                                const xml = await (0, callXmlGenerator_1.generateXmlForMessage)(nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                                return res.send(xml);
                                                            }
                                                            if (nextNodeConnectedToBussinessHourNodeOff.length >
                                                                1) {
                                                                // console.log(
                                                                //   "Try to search play node it will be there."
                                                                // );
                                                                for (let i = 0; i <
                                                                    nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                                    const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                                        nextNodeConnectedToBussinessHourNodeOff[i]
                                                                            .target);
                                                                    if (detailsOfTargetNode.type == "MessageNode") {
                                                                        const dataFromVibconnect = req.query;
                                                                        //not making it async await because it is making API response slow and we dont need to send message first then play
                                                                        (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                                                    }
                                                                    if (detailsOfTargetNode.type == "PlayAudioNode") {
                                                                        makePlayXml = true;
                                                                        playNodeDetails = detailsOfTargetNode.data;
                                                                        playNodeId = detailsOfTargetNode.id;
                                                                    }
                                                                }
                                                            }
                                                            if (makePlayXml) {
                                                                const nextNode_for_action = connectors.find((item) => {
                                                                    if (item.source === playNodeId) {
                                                                        return item;
                                                                    }
                                                                });
                                                                const nextNode_for_action_id_data = nextNode_for_action.target;
                                                                const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                                                                return res.send(xmlFromHelper);
                                                            }
                                                        }
                                                        if (nextNodeIfSuccess[0].type === "MultiPartyCallNode") {
                                                            const newRealTime = new IvrStudiousRealTime_1.default({
                                                                ...req.query,
                                                                source: "Web",
                                                                expireDate: timeAfterThreeHour,
                                                            });
                                                            await newRealTime.save();
                                                            const dataFromVibconnect = req.query;
                                                            const xml = await (0, callXmlGenerator_1.generateXmlForMultiPartyCallNode)(document_id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                            return res.send(xml);
                                                        }
                                                    }
                                                }
                                                else {
                                                    for (let i = 0; i < nextNodeIfSuccess[0].data.bHourDays.length; i++) {
                                                        if (nodeDetails.bHourDays[i].isWorking === true) {
                                                            const currentTime = new Date();
                                                            const currentDay = this.getNameOfDay(currentTime.getDay());
                                                            // console.log(
                                                            //   "currentDay : ",
                                                            //   currentDay,
                                                            //   nodeDetails.bHourDays[i].day
                                                            // );
                                                            if (currentDay.toLowerCase() ==
                                                                nodeDetails.bHourDays[i].day.toLowerCase()) {
                                                                // console.log(
                                                                //   "nodeDetails.bHourDays[i] : ",
                                                                //   nodeDetails.bHourDays[i]
                                                                // );
                                                                const now = (0, moment_1.default)()
                                                                    .add(5, "hours")
                                                                    .add(30, "minutes")
                                                                    .format(); // in local it is fine but in live it is giving actual time so dont need to add hours
                                                                //const now = moment().format()
                                                                const tempStartEndObj = await this.getStartAndEndTimeFromMultipleTimeInSingleDay(nodeDetails.bHourDays[i], now);
                                                                // console.log(
                                                                //   "tempStartEndObj : ",
                                                                //   tempStartEndObj
                                                                // );
                                                                let { startTime, endTime } = tempStartEndObj;
                                                                const start = startTime;
                                                                const end = endTime;
                                                                let bussinessHourNodeId = nextNodeIfSuccess[0].id;
                                                                // console.log("bussinessHourNodeId : ",bussinessHourNodeId)
                                                                if ((0, moment_1.default)(now).isBetween(start, end)) {
                                                                    // console.log(
                                                                    //   "is between : now -> ",
                                                                    //   now,
                                                                    //   "start  ",
                                                                    //   start,
                                                                    //   "end : ",
                                                                    //   end
                                                                    // );
                                                                    // console.log("connectors : ", connectors)
                                                                    const nextNodeConnectedToBussinessHourNodeOn = connectors.filter((item) => {
                                                                        if (item.source === bussinessHourNodeId &&
                                                                            item.sourceHandle == "businesshourOn") {
                                                                            return item;
                                                                        }
                                                                    });
                                                                    // console.log(
                                                                    //   "nextNodeConnectedToBussinessHourNode : ",
                                                                    //   nextNodeConnectedToBussinessHourNodeOn
                                                                    // );
                                                                    const nextNodeIfSuccess = data.input?.filter((item) => {
                                                                        if (item.id ===
                                                                            nextNodeConnectedToBussinessHourNodeOn[0]
                                                                                .target) {
                                                                            return item;
                                                                        }
                                                                    });
                                                                    // console.log(
                                                                    //   "nextNodeIfSuccess : ",
                                                                    //   nextNodeIfSuccess
                                                                    // );
                                                                    if (nextNodeIfSuccess.length > 0) {
                                                                        // console.log(
                                                                        //   "next node if not succes 8485",
                                                                        //   nextNodeIfSuccess[0]
                                                                        // );
                                                                        if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                                            const newRealTime = new IvrStudiousRealTime_1.default({
                                                                                ...req.query,
                                                                                source: "Web",
                                                                                expireDate: timeAfterThreeHour,
                                                                            });
                                                                            await newRealTime.save();
                                                                            const xml = (0, callXmlGenerator_1.generateXmlForIvrNode)(document_id, nextNodeIfSuccess[0].id, sourceId_to_find_in_next_connector, nextNodeIfSuccess[0].data);
                                                                            return res.send(xml);
                                                                        }
                                                                        if (nextNodeIfSuccess[0].type ===
                                                                            "PlayAudioNode") {
                                                                            const nextNode_for_action = connectors.find((item) => {
                                                                                if (item.source ===
                                                                                    nextNodeIfSuccess[0].id) {
                                                                                    return item;
                                                                                }
                                                                            });
                                                                            const nextNode_for_action_id_data = nextNode_for_action.target;
                                                                            const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, nextNodeIfSuccess[0].id, nextNode_for_action_id_data, nextNodeIfSuccess[0].data);
                                                                            return res.send(xmlFromHelper);
                                                                        }
                                                                        if (nextNodeIfSuccess[0].type ===
                                                                            "MessageNode") {
                                                                            let makePlayXml = false;
                                                                            let playNodeDetails;
                                                                            let playNodeId;
                                                                            if (nextNodeConnectedToBussinessHourNodeOff.length ===
                                                                                1) {
                                                                                const dataFromVibconnect = req.query;
                                                                                const xml = await (0, callXmlGenerator_1.generateXmlForMessage)(nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                                                return res.send(xml);
                                                                            }
                                                                            if (nextNodeConnectedToBussinessHourNodeOff.length >
                                                                                1) {
                                                                                // console.log(
                                                                                //   "Try to search play node it will be there."
                                                                                // );
                                                                                for (let i = 0; i <
                                                                                    nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                                                    const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                                                        nextNodeConnectedToBussinessHourNodeOff[i].target);
                                                                                    if (detailsOfTargetNode.type ==
                                                                                        "MessageNode") {
                                                                                        const dataFromVibconnect = req.query;
                                                                                        //not making it async await because it is making API response slow and we dont need to send message first then play
                                                                                        (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                                                                    }
                                                                                    if (detailsOfTargetNode.type ==
                                                                                        "PlayAudioNode") {
                                                                                        makePlayXml = true;
                                                                                        playNodeDetails =
                                                                                            detailsOfTargetNode.data;
                                                                                        playNodeId = detailsOfTargetNode.id;
                                                                                    }
                                                                                }
                                                                            }
                                                                            if (makePlayXml) {
                                                                                const nextNode_for_action = connectors.find((item) => {
                                                                                    if (item.source === playNodeId) {
                                                                                        return item;
                                                                                    }
                                                                                });
                                                                                const nextNode_for_action_id_data = nextNode_for_action.target;
                                                                                const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                                                                                return res.send(xmlFromHelper);
                                                                            }
                                                                        }
                                                                        if (nextNodeIfSuccess[0].type ===
                                                                            "MultiPartyCallNode") {
                                                                            const newRealTime = new IvrStudiousRealTime_1.default({
                                                                                ...req.query,
                                                                                source: "Web",
                                                                                expireDate: timeAfterThreeHour,
                                                                            });
                                                                            await newRealTime.save();
                                                                            const dataFromVibconnect = req.query;
                                                                            const xml = await (0, callXmlGenerator_1.generateXmlForMultiPartyCallNode)(document_id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                                            return res.send(xml);
                                                                        }
                                                                    }
                                                                }
                                                                else {
                                                                    const nextNodeConnectedToBussinessHourNodeOff = connectors.filter((item) => {
                                                                        if (item.source === bussinessHourNodeId &&
                                                                            item.sourceHandle == "businesshourOff") {
                                                                            return item;
                                                                        }
                                                                    });
                                                                    // console.log("nextNodeConnectedToBussinessHourNodeOff : ", nextNodeConnectedToBussinessHourNodeOff)
                                                                    // console.log(
                                                                    //   "is not between : now -> ",
                                                                    //   now,
                                                                    //   "start -> ",
                                                                    //   start,
                                                                    //   "end -> ",
                                                                    //   end
                                                                    // );
                                                                    const nextNodeIfSuccess = data.input?.filter((item) => {
                                                                        for (let i = 0; i <
                                                                            nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                                            if (item.id ===
                                                                                nextNodeConnectedToBussinessHourNodeOff[i].target) {
                                                                                return item;
                                                                            }
                                                                        }
                                                                        // if(item.id === nextNodeConnectedToBussinessHourNodeOff[0].target){
                                                                        //     return item
                                                                        // }
                                                                    });
                                                                    // console.log(
                                                                    //   "if bussiness hour off nextNodeIfSuccess : ",
                                                                    //   nextNodeIfSuccess
                                                                    // );
                                                                    if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                                        const newRealTime = new IvrStudiousRealTime_1.default({
                                                                            ...req.query,
                                                                            source: "Web",
                                                                            expireDate: timeAfterThreeHour,
                                                                        });
                                                                        await newRealTime.save();
                                                                        const xml = (0, callXmlGenerator_1.generateXmlForIvrNode)(document_id, nextNodeIfSuccess[0].id, sourceId_to_find_in_next_connector, nextNodeIfSuccess[0].data);
                                                                        return res.send(xml);
                                                                    }
                                                                    if (nextNodeIfSuccess[0].type ===
                                                                        "PlayAudioNode") {
                                                                        let makePlayXml = false;
                                                                        let playNodeDetails;
                                                                        let playNodeId;
                                                                        if (nextNodeConnectedToBussinessHourNodeOff.length ===
                                                                            1) {
                                                                            const nextNode_for_action = connectors.find((item) => {
                                                                                if (item.source ===
                                                                                    nextNodeIfSuccess[0].id) {
                                                                                    return item;
                                                                                }
                                                                            });
                                                                            const nextNode_for_action_id_data = nextNode_for_action.target;
                                                                            const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, nextNodeIfSuccess[0].id, nextNode_for_action_id_data, nextNodeIfSuccess[0].data);
                                                                            return res.send(xmlFromHelper);
                                                                        }
                                                                        if (nextNodeConnectedToBussinessHourNodeOff.length >
                                                                            1) {
                                                                            // console.log(
                                                                            //   "Try to search play node it will be there."
                                                                            // );
                                                                            for (let i = 0; i <
                                                                                nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                                                const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                                                    nextNodeConnectedToBussinessHourNodeOff[i].target);
                                                                                if (detailsOfTargetNode.type ==
                                                                                    "MessageNode") {
                                                                                    const dataFromVibconnect = req.query;
                                                                                    //not making it async await because it is making API response slow and we dont need to send message first then play
                                                                                    (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                                                                }
                                                                                if (detailsOfTargetNode.type ==
                                                                                    "PlayAudioNode") {
                                                                                    makePlayXml = true;
                                                                                    playNodeDetails =
                                                                                        detailsOfTargetNode.data;
                                                                                    playNodeId = detailsOfTargetNode.id;
                                                                                }
                                                                            }
                                                                        }
                                                                        if (makePlayXml) {
                                                                            const nextNode_for_action = connectors.find((item) => {
                                                                                if (item.source === playNodeId) {
                                                                                    return item;
                                                                                }
                                                                            });
                                                                            const nextNode_for_action_id_data = nextNode_for_action.target;
                                                                            const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                                                                            return res.send(xmlFromHelper);
                                                                        }
                                                                    }
                                                                    if (nextNodeIfSuccess[0].type === "MessageNode") {
                                                                        let makePlayXml = false;
                                                                        let playNodeDetails;
                                                                        let playNodeId;
                                                                        if (nextNodeConnectedToBussinessHourNodeOff.length ===
                                                                            1) {
                                                                            const dataFromVibconnect = req.query;
                                                                            const xml = await (0, callXmlGenerator_1.generateXmlForMessage)(nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                                            return res.send(xml);
                                                                        }
                                                                        if (nextNodeConnectedToBussinessHourNodeOff.length >
                                                                            1) {
                                                                            // console.log(
                                                                            //   "Try to search play node it will be there."
                                                                            // );
                                                                            for (let i = 0; i <
                                                                                nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                                                const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                                                    nextNodeConnectedToBussinessHourNodeOff[i].target);
                                                                                if (detailsOfTargetNode.type ==
                                                                                    "MessageNode") {
                                                                                    const dataFromVibconnect = req.query;
                                                                                    //not making it async await because it is making API response slow and we dont need to send message first then play
                                                                                    (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                                                                }
                                                                                if (detailsOfTargetNode.type ==
                                                                                    "PlayAudioNode") {
                                                                                    makePlayXml = true;
                                                                                    playNodeDetails =
                                                                                        detailsOfTargetNode.data;
                                                                                    playNodeId = detailsOfTargetNode.id;
                                                                                }
                                                                            }
                                                                        }
                                                                        if (makePlayXml) {
                                                                            const nextNode_for_action = connectors.find((item) => {
                                                                                if (item.source === playNodeId) {
                                                                                    return item;
                                                                                }
                                                                            });
                                                                            const nextNode_for_action_id_data = nextNode_for_action.target;
                                                                            const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(document_id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                                                                            return res.send(xmlFromHelper);
                                                                        }
                                                                    }
                                                                    if (nextNodeIfSuccess[0].type ===
                                                                        "MultiPartyCallNode") {
                                                                        const newRealTime = new IvrStudiousRealTime_1.default({
                                                                            ...req.query,
                                                                            source: "Web",
                                                                            expireDate: timeAfterThreeHour,
                                                                        });
                                                                        await newRealTime.save();
                                                                        const dataFromVibconnect = req.query;
                                                                        const xml = await (0, callXmlGenerator_1.generateXmlForMultiPartyCallNode)(document_id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                                        return res.send(xml);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if (nextNodeIfSuccess[0].type === "MultiPartyCallNode") {
                                            const newRealTime = new IvrStudiousRealTime_1.default({
                                                ...req.query,
                                                source: "Web",
                                                expireDate: timeAfterThreeHour,
                                            });
                                            await newRealTime.save();
                                            const dataFromVibconnect = req.query;
                                            const xml = await (0, callXmlGenerator_1.generateXmlForMultiPartyCallNode)(document_id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].data, dataFromVibconnect);
                                            return res.send(xml);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                voice.hangup();
                return res.send(voice.toString());
            }
            //version 1.2 (Check Also is CLI active or not if active then pass CustomerNumber instead od cloud number)
            if (nextNodeData.type === "MultiPartyCallNode") {
                const newRealTime = new IvrStudiousRealTime_1.default({
                    ...req.query,
                    source: "Web",
                    expireDate: timeAfterThreeHour,
                });
                await newRealTime.save();
                const dataFromVibconnect = req.query;
                const xml = await (0, callXmlGenerator_1.generateXmlForMultiPartyCallNode)(document_id, nextNodeData.id, nextNodeData.id, nextNodeData.data, dataFromVibconnect);
                return res.send(xml);
            }
            if (nextNodeData.type === "StickyAgentNode") {
                const newRealTime = new IvrStudiousRealTime_1.default({
                    ...req.query,
                    source: "Web",
                    expireDate: timeAfterThreeHour,
                });
                await newRealTime.save();
                const nextNode_for_action = connectors.find((item) => {
                    if (item.source === nextNodeId) {
                        return item;
                    }
                });
                const nextNode_for_action_id_data = nextNode_for_action.target;
                const dataFromVibconnect = req.query;
                const xml = await (0, callXmlGenerator_1.generateXMLForStickyAgentNode)(document_id, nextNodeData.id, nextNode_for_action_id_data, nextNodeData.data, dataFromVibconnect, connectors);
                console.log("XML is : ", xml);
                return res.send(xml);
            }
            console.log("xml created : ", voice.toString());
            return res.send(voice.toString());
        }
        catch (error) {
            this.message = error.message;
            this.code = 200;
            this.status = false;
            this.data = [];
            defaultVri.say(error.message);
        }
        return res.send(defaultVri.toString());
    }
    getOrCreateContact = async (data) => {
        const direction = data.Direction;
        const contact = data.Caller;
        if (direction === "inbound") {
            const queryToFindContact = {
                AccountSid: data.AccountSid,
                phoneNumber: { $regex: contact.slice(-10), $options: "i" },
            };
            contactModel
                .findOne(queryToFindContact)
                .then((detailsOfContact) => {
                console.log("Data in Contact : ", detailsOfContact);
                if (!detailsOfContact) {
                    const ContactModel = new contactModel({
                        firstName: "Unknown",
                        lastName: "",
                        phoneNumber: `91${contact.slice(-10)}`,
                        AccountSid: data.AccountSid,
                    });
                    ContactModel.save()
                        .then((data) => {
                        console.log("Since No Contact found new contact created : ", data);
                    })
                        .catch((err) => {
                        console.log("Error : ", err);
                    });
                }
            })
                .catch((err) => {
                console.log("Error : ", err);
            });
        }
    };
    async getRealTimeData(req, res) {
        const queryParams = { ...req.query };
        const excludeApiFields = [
            "page",
            "sort",
            "limit",
            "fields",
            "offset",
            "populate",
            "contact",
        ];
        excludeApiFields.forEach((e) => delete queryParams[e]);
        const authId = req.JWTUser?.authId;
        let contact;
        if (req.query.contact) {
            contact = req.query.contact;
        }
        const contactFilter = contact
            ? [
                { Receiver: { $regex: contact, $options: "i" } },
                { Caller: { $regex: contact, $options: "i" } },
            ]
            : [
                { Receiver: { $regex: contact, $options: "i" } },
                { Caller: { $regex: contact, $options: "i" } },
            ];
        const finalFilter = {
            AccountSid: authId,
            ...queryParams,
        };
        let realtimeData;
        if (contact) {
            console.log("Contact Provided");
            //@ts-ignore
            realtimeData = await IvrStudiousRealTime_1.default.find({ ...finalFilter, $or: contactFilter, }).limit(Number(req.query.limit)).skip(Number(req.query.offset)).sort(req.query.sort).select(req.query.fields).populate(req.query.populate);
        }
        else {
            console.log("Contact not provided");
            //@ts-ignore
            realtimeData = await IvrStudiousRealTime_1.default.find(finalFilter).limit(Number(req.query.limit)).skip(Number(req.query.offset)).sort(req.query.sort).select(req.query.fields).populate(req.query.populate);
        }
        const data = {
            data: realtimeData,
        };
        this.data = data;
        this.code = 200;
        this.message = "Request Completed!";
        return res.status(200).json(this.Response());
    }
    MakeConferenceCall(auth_id, authSecret_id, body) {
        const link = "https://api.vibconnect.io/v1/Accounts/" + auth_id + "/Calls";
        const tok = auth_id + ":" + authSecret_id;
        const hash = Buffer.from(tok).toString("base64");
        //  if(body.From.includes('918069')){
        //     body.From = body.From.replace('918069', '+918069')
        //  }
        //  if(body.From.includes('918069')){
        //     body.From = body.From.replace('918069', '+918069')
        //  }
        //  if(body.From.includes('911413')){
        //     body.From = '+913368110800'
        //  }
        //for mynammar
        if (body.From.includes("+")) {
            body.From = body.From = body.From.replace("+", "");
        }
        if (body.From.includes("918069")) {
            body.From = body.From.replace("918069", "+918069");
        }
        if (body.From.includes("91223531")) {
            body.From = body.From.replace("91223531", "+91223531");
        }
        const options = {
            method: "POST",
            url: link,
            headers: {
                Authorization: "Basic " + hash,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...body,
                name: body.campaign_name,
            }),
        };
        console.log(options);
        return new Promise((resolve, reject) => {
            httpClient(options, (err, res, body) => {
                if (err) {
                    console.log("error in Make CallOzora ", err);
                    reject(err);
                }
                //  console.log("res of target ",res)
                console.log("body of CallOzora ", body);
                resolve(body);
            });
        });
    }
    // action url format = baseUrl/action/level(i.e 0 , 1, 2)/inbound_number/_id/priority/numDigits
    async numberNotInService(req, res) {
        const voice = new VoiceResponse_1.default();
        voice.play("https://danish-asghar2909.github.io/mp3.xml/CancelNumber.mp3.mp3");
        return res.send(voice.toString());
    }
    async getListOfConference(auth_id, authSecret_id) {
        const link = "https://api.vibconnect.io/v1/Accounts/" + auth_id + "/Conferences";
        const tok = auth_id + ":" + authSecret_id;
        const hash = Buffer.from(tok).toString("base64");
        const options = {
            method: "GET",
            url: link,
            headers: {
                Authorization: "Basic " + hash,
                "Content-Type": "application/json",
            },
        };
        console.log(options);
        return new Promise((resolve, reject) => {
            httpClient(options, (err, res, body) => {
                if (err) {
                    console.log("error in getListOfConference ", err);
                    reject(err);
                }
                //  console.log("res of target ",res)
                //console.log("body of getListOfConference ",body)
                resolve(body);
            });
        });
    }
    async getTargetNodeAndExecuteVersionTwo(req, res, next) {
        const id = req.params.id;
        const target = req.params.target;
        const source = req.params.source;
        let dateAfterThreeDay;
        dateAfterThreeDay = (0, moment_1.default)().add(2, "d").toDate();
        if (req.query !== undefined || req.query !== null) {
            let body = req.query;
            const ivr_studios_status_call_back = new ivrStudiosModelCallBacks_1.default({
                ...body,
                source: "gather_response_query_ivr_flow",
                expireDate: dateAfterThreeDay,
            });
            await ivr_studios_status_call_back.save();
        }
        let body = req.body;
        console.log("body in gather ivr", body);
        const ivr_studios_status_call_back = new ivrStudiosModelCallBacks_1.default({
            ...body,
            source: "gather_response_body_ivr_flow",
            expireDate: dateAfterThreeDay,
        });
        await ivr_studios_status_call_back.save();
        let Digits = req.body.Digits;
        console.log("source : ", source);
        console.log("target : ", target);
        console.log("id : ", id);
        res.set("Content-Type", "text/xml");
        const defaultVri = new VoiceResponse_1.default();
        try {
            if (req.body.Digits == "#") {
                console.log("# pressed ");
                const voice = new VoiceResponse_1.default();
                const data = await ivrFlowUIModel_1.default.findById(id);
                // console.log("data : ",data)
                const document_id = id;
                const connectors = data.input.filter((item) => {
                    if ((item.type = "buttonedge")) {
                        return item;
                    }
                });
                const firstNode = connectors.map((item) => {
                    if (item.data !== undefined) {
                        if (item.data.cloudNumber !== undefined) {
                            return item;
                        }
                    }
                });
                // console.log("firstNode : ",firstNode)
                let sourceId_to_find_in_next_connector = firstNode[0].id;
                // console.log("source : ", sourceId_to_find_in_next_connector)
                const multipleSource = this.findTargetsFromSource(connectors, sourceId_to_find_in_next_connector);
                // console.log("multipleSource : ",multipleSource)
                if (multipleSource.length > 1) {
                    const targetFunctionNodeFromSourceWithMultipleTarget = this.findIfTargetIsFunction(data.input, multipleSource);
                    const { variableArray } = targetFunctionNodeFromSourceWithMultipleTarget.data;
                    let customer;
                    if (req.query.From) {
                        customer = req.query.From;
                    }
                    if (req.body.From) {
                        customer = req.body.From;
                    }
                    const request = await this.collectDetailsAndMakeRequest(targetFunctionNodeFromSourceWithMultipleTarget, customer);
                    const jsonResponse = JSON.parse(request);
                    const exactValueAfterFilter = this.filterVariablesFromResponse(variableArray, jsonResponse);
                    // console.log("exactValueAfterFilter : ",exactValueAfterFilter)
                    //updating the value of the variables in the database from API response
                    // await ivrFlowUIModel.findOneAndUpdate({auth_id : authID , number : purchasedNumber},{$set : {variables : exactValueAfterFilter}})
                    const newRealTime = new IvrStudiousRealTime_1.default({
                        ...req.query,
                        source: "Web",
                        variables: exactValueAfterFilter,
                    });
                    await newRealTime.save();
                }
                const nextNode = connectors.map((item) => {
                    if (item.source === sourceId_to_find_in_next_connector) {
                        return item;
                    }
                });
                var correctNextNode = nextNode.filter(function (el) {
                    return el != null;
                });
                //   console.log("correctNextNode : ",correctNextNode)
                // const nextNodeId = correctNextNode[0].target
                // console.log("nextNodeId : ",nextNodeId)
                const nextNodeIdTrial = correctNextNode;
                // console.log("nextNodeIdTrial : ",nextNodeIdTrial)
                const nextNodeId = this.removeFunctionNodeIdFromNextNode(data.input, nextNodeIdTrial);
                //    console.log("nextId : ",nextId)
                const nextNodeData = data.input?.map((item) => {
                    if (item.id === nextNodeId) {
                        return item;
                    }
                });
                const filteredNextNodeData = nextNodeData.filter(function (item) {
                    return item != null;
                });
                // console.log("filteredNextNodeData : ",filteredNextNodeData[0].data)
                if (filteredNextNodeData[0].data.audioUrl) {
                    const nextNode_for_action = connectors.map((item) => {
                        if (item.source === nextNodeId) {
                            return item;
                        }
                    });
                    const nextNode_for_action_id = nextNode_for_action.filter((node) => {
                        return node != null;
                    });
                    const nextNode_for_action_id_data = nextNode_for_action_id[0].target;
                    // console.log("nextNode_for_action : ",nextNode_for_action_id_data)
                    voice.play({ loop: filteredNextNodeData[0].data.loop, digits: "wwww3" }, filteredNextNodeData[0].data.audioUrl);
                    voice.pause({ length: filteredNextNodeData[0].data.playAudioPause });
                    voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${document_id}/${nextNode_for_action_id_data}/${nextNodeId}`);
                    console.log("xml is : ", voice.toString());
                    return res.send(voice.toString());
                }
                if (filteredNextNodeData[0].data.ivrNumberArray.length > 0) {
                    let Parent;
                    Parent = voice.gather({
                        action: `${conf.BaseUrl}/api/ivrstudios/convert/${document_id}/${nextNodeId}/${sourceId_to_find_in_next_connector}`,
                        method: "POST",
                        numDigits: "1",
                    });
                    if (filteredNextNodeData[0].data.ivrAudioUrl) {
                        Parent.play({ loop: filteredNextNodeData[0].data.loop }, filteredNextNodeData[0].data.ivrAudioUrl);
                        voice.pause({
                            length: filteredNextNodeData[0].data.ivrPlayAudioPause,
                        });
                    }
                    console.log("xml is : ", voice.toString());
                    return res.send(voice.toString());
                }
                this.data = filteredNextNodeData;
                this.message = "IvrStudio created successfully";
                this.status = true;
                this.code = 200;
                console.log("xml is : ", voice.toString());
                // return res.json(this.Response())
                return res.send(voice.toString());
            }
            else {
                const voice = new VoiceResponse_1.default();
                const data = await ivrFlowUIModel_1.default.findById(id);
                console.log("Data : ", data);
                const allNodes = data.input;
                const targetNode = allNodes.find((node) => node.id === target);
                console.log("targetNode : ", targetNode, target);
                if (target.includes("conference")) {
                    const roomId = target.split("|")[1];
                    console.log("roomId : ", roomId);
                    const conferenceIdFromRoomId = await ConferenceModel_1.default.findOne({
                        FriendlyName: roomId,
                    });
                    if (conferenceIdFromRoomId) {
                        console.log("conferenceIdFromRoomId : ", conferenceIdFromRoomId);
                        const status = conferenceIdFromRoomId?.CallStatus;
                        let ChildCallStatus = conferenceIdFromRoomId?.ChildCallStatus;
                        const tempData = await this.checkChildCallStatusOfPreviousCall(conferenceIdFromRoomId?.ParentCallSid);
                        console.log("Temp Data : ", tempData);
                        logger_1.default.info("status : " + status + " : main call status " + req.query.DialCallStatus + " " + req.query.CallStatus + "Child Call Status : " + ChildCallStatus);
                        let statusAccordingToUi;
                        if (tempData.status) {
                            ChildCallStatus = tempData.data.ChildCallStatus;
                        }
                        switch (status) {
                            case "in-progress":
                                if (req.query.DialCallStatus == "answered" ||
                                    req.query.DialCallStatus == "completed" ||
                                    req.query.DialCallStatus == "fake-completed" ||
                                    req.query.CallStatus === "answered" ||
                                    req.query.CallStatus === "completed") {
                                    statusAccordingToUi = "mpsAnswered";
                                    break;
                                }
                                statusAccordingToUi = "in-progress";
                                break;
                            case "completed":
                                statusAccordingToUi = "mpsAnswered";
                                break;
                            case "failed":
                                statusAccordingToUi = "mpsFailed";
                                break;
                            case "busy":
                                statusAccordingToUi = "mpsFailed";
                                break;
                            case "canceled":
                                statusAccordingToUi = "mpcMissed";
                                break;
                            case "initiated":
                                if (req.query.DialCallStatus == "answered" ||
                                    req.query.DialCallStatus == "completed" ||
                                    req.query.CallStatus === "answered" ||
                                    req.query.CallStatus === "completed") {
                                    statusAccordingToUi = "mpsUnanswered";
                                }
                                break;
                            case undefined:
                                if (req.query.DialCallStatus == "answered" ||
                                    req.query.DialCallStatus == "completed" ||
                                    req.query.CallStatus === "answered" ||
                                    req.query.CallStatus === "completed") {
                                    statusAccordingToUi = "mpsUnanswered";
                                }
                                break;
                            case "ringing":
                                if (req.query.DialCallStatus == "answered" ||
                                    req.query.DialCallStatus == "completed" ||
                                    req.query.CallStatus === "answered" ||
                                    req.query.CallStatus === "completed") {
                                    statusAccordingToUi = "mpsUnanswered";
                                }
                                break;
                            case "no-answer":
                                statusAccordingToUi = "mpsUnanswered";
                                break;
                            case "customer-hangup":
                                if (ChildCallStatus === "busy") {
                                    statusAccordingToUi = "mpcMissed";
                                }
                                else {
                                    if (req.query.DialCallStatus == "answered" ||
                                        req.query.DialCallStatus == "fake-completed" ||
                                        req.query.CallStatus === "answered" ||
                                        req.query.CallStatus === "completed") {
                                        statusAccordingToUi = "mpsUnanswered";
                                    }
                                }
                                // if(req.query.DialCallStatus == "answered" || req.query.DialCallStatus == "fake-completed" || req.query.CallStatus ==='answered' || req.query.CallStatus ==='completed'){
                                //     statusAccordingToUi = "mpsUnanswered"
                                // }
                                break;
                            default:
                                statusAccordingToUi = null;
                                break;
                        }
                        logger_1.default.info("Status According To UI : " + statusAccordingToUi);
                        const connectorWithTargetId = allNodes.filter((node) => {
                            if (node.source === source &&
                                node.sourceHandle === statusAccordingToUi) {
                                return node;
                            }
                        });
                        //  console.log("targetNode_without_filter : ",connectorWithTargetId)
                        const targetNode = allNodes.find((node) => node.id === connectorWithTargetId[0].target);
                        //  console.log("targetNode call back : ",targetNode)
                        if (req.query.DialCallStatus === "answered" ||
                            req.query.DialCallStatus === "completed") {
                            let myQuery = {
                                ParentCallSid: req.query.ParentCallSid,
                            };
                            await IvrStudiousRealTime_1.default.deleteMany(myQuery);
                        }
                        console.log("target node : ", targetNode);
                        if (targetNode) {
                            if (targetNode.type == "PlayAudioNode") {
                                const nextNodeToAction = allNodes.filter((node) => {
                                    if (node.source == targetNode.id) {
                                        return node;
                                    }
                                });
                                const detailsOfNextNodeToAction = allNodes.filter((node) => {
                                    if (node.id == nextNodeToAction[0].target) {
                                        return node;
                                    }
                                });
                                console.log("detailsOfNextNodeToAction : ", detailsOfNextNodeToAction);
                                console.log("nextNodeToAction multi target: ", nextNodeToAction);
                                let nextTargetNode = nextNodeToAction;
                                if (nextTargetNode.length > 0) {
                                    if (detailsOfNextNodeToAction.length > 0) {
                                        if (detailsOfNextNodeToAction[0].type == "HangUpNode") {
                                            nextTargetNode = nextNodeToAction;
                                            voice.play(targetNode.data.audioUrl); // fortesting we are removing play for now only
                                            // voice.hangup()
                                            console.log("xml is : ", voice.toString());
                                            return res.send(voice.toString());
                                        }
                                        else {
                                            voice.play({ loop: targetNode.data.loop, digits: "wwww3" }, targetNode.data.audioUrl);
                                            voice.pause({ length: targetNode.data.playAudioPause });
                                            voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNodeToAction[0].target}/${targetNode.id}`);
                                            console.log("xml is : ", voice.toString());
                                            return res.send(voice.toString());
                                        }
                                    }
                                    // voice.play({loop : targetNode.data.loop, digits:"wwww3"},targetNode.data.audioUrl)
                                    // voice.pause({length : targetNode.data.playAudioPause})
                                    // voice.redirect({method : "GET"},`${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNodeToAction[0].target}/${targetNode.id}`)
                                    // console.log("xml is : ", voice.toString())
                                    // return res.send(voice.toString())
                                }
                                // const deletedValue  :any= await ConferenceModel.findOneAndDelete({"FriendlyName" : roomId})
                                // console.log("delete : ",deletedValue)
                                voice.play({ loop: targetNode.data.loop, digits: "wwww3" }, targetNode.data.audioUrl);
                                voice.pause({ length: targetNode.data.playAudioPause });
                                console.log("xml is : ", voice.toString());
                                return res.send(voice.toString());
                            }
                            if (targetNode.type === "HangUpNode") {
                                // const deletedValue  :any= await ConferenceModel.findOneAndDelete({"FriendlyName" : roomId})
                                // console.log("delete : ",deletedValue)
                                voice.hangup();
                                console.log("xml is : ", voice.toString());
                                return res.send(voice.toString());
                            }
                            if (targetNode.type === "MessageNode") {
                                console.log("Do we need to send message : ", conferenceIdFromRoomId.isMessageSent);
                                if (conferenceIdFromRoomId.isMessageSent !== undefined) {
                                    if (conferenceIdFromRoomId.isMessageSent === false) {
                                        voice.hangup();
                                        console.log("xml is : ", voice.toString());
                                        return res.send(voice.toString());
                                    }
                                    else {
                                        await ConferenceModel_1.default.findOneAndUpdate({ FriendlyName: roomId }, { isMessageSent: false });
                                        // const deletedValue  :any= await ConferenceModel.findOneAndDelete({"FriendlyName" : roomId})
                                        // console.log("delete : ",deletedValue)
                                        let loop;
                                        let audioUrl;
                                        let playAudioPause;
                                        let makePlayXml = false;
                                        let ParentCallSid;
                                        if (req.body.ParentCallSid) {
                                            ParentCallSid = req.body.ParentCallSid;
                                        }
                                        else {
                                            ParentCallSid = conferenceIdFromRoomId.ParentCallSid
                                                ? conferenceIdFromRoomId.ParentCallSid
                                                : req.query.ParentCallSid;
                                        }
                                        // if(statusAccordingToUi === 'mpsAnswered'){
                                        //     ParentCallSid = conferenceIdFromRoomId.ParentCallSid
                                        // }
                                        console.log("Parent call sid : ", ParentCallSid);
                                        const customerVariablesDetails = await IvrStudiousRealTime_1.default.findOne({
                                            ParentCallSid: ParentCallSid,
                                        });
                                        let dataBaseVariables = {};
                                        if (customerVariablesDetails) {
                                            if (customerVariablesDetails.variables) {
                                                console.log("customerVariablesDetails : ", customerVariablesDetails.variables);
                                                const tempObj = customerVariablesDetails.variables.map((variable) => {
                                                    const stringObj = `{"${variable.key}":"${variable.value}"}`;
                                                    return JSON.parse(stringObj);
                                                });
                                                // console.log("tempObj : ",tempObj)
                                                const a = tempObj.reduce((acc, obj) => Object.assign(acc, obj), {});
                                                // console.log("a : ",a)
                                                dataBaseVariables = a;
                                            }
                                        }
                                        if (connectorWithTargetId.length > 1) {
                                            // console.log("targetNodeMoreThatnOne : ", connectorWithTargetId.length , connectorWithTargetId)
                                            for (let i = 0; i < connectorWithTargetId.length; i++) {
                                                // console.log("targetNode_id[i] : ",connectorWithTargetId[i])
                                                const targetNode = allNodes.find((node) => node.id === connectorWithTargetId[i].target);
                                                // console.log("targetNode : ",targetNode)
                                                if (targetNode.type == "MessageNode") {
                                                    const value = targetNode.data;
                                                    // console.log("value : ",value)
                                                    let ParentCallSid;
                                                    if (req.body.ParentCallSid) {
                                                        ParentCallSid = req.body.ParentCallSid;
                                                    }
                                                    else {
                                                        ParentCallSid = conferenceIdFromRoomId.ParentCallSid
                                                            ? conferenceIdFromRoomId.ParentCallSid
                                                            : req.query.ParentCallSid;
                                                    }
                                                    const myQuery = { ParentCallSid: ParentCallSid };
                                                    const customer = await ivrStudiosModelCallBacks_1.default.find(myQuery);
                                                    // console.log("customer : ",customer)
                                                    const time = customer[0].subscribeDate;
                                                    const call_back_with_digits = customer.filter((customer) => {
                                                        if (customer.source ===
                                                            "gather_response_body_ivr_flow") {
                                                            let Digits = customer.Digits;
                                                            return Digits;
                                                        }
                                                    });
                                                    const array_of_selected_Digits = call_back_with_digits.map((customer) => {
                                                        return customer.Digits;
                                                    });
                                                    let lastDigits;
                                                    console.log("call_back_with_digits.slice(-1)[0] : ", call_back_with_digits.slice(-1)[0]);
                                                    if (call_back_with_digits.slice(-1)[0] === undefined) {
                                                        lastDigits = "";
                                                    }
                                                    if (call_back_with_digits.slice(-1)[0] !== undefined) {
                                                        lastDigits =
                                                            call_back_with_digits.slice(-1)[0].Digits;
                                                    }
                                                    let removed_sip; //customer number
                                                    let customer_number_only_10_deigits;
                                                    if (customer[0].From) {
                                                        if (customer[0].From.includes("sip:")) {
                                                            let removed_ip = customer[0].From.split("@")[0];
                                                            removed_sip = removed_ip.split(":")[1];
                                                        }
                                                        else {
                                                            removed_sip = customer[0].From;
                                                            removed_sip = removed_sip.replace(/^0+/, "");
                                                            customer_number_only_10_deigits =
                                                                removed_sip.substr(removed_sip.length - 10);
                                                        }
                                                    }
                                                    console.log("array_of_selected_Digits : ", array_of_selected_Digits);
                                                    // console.log("lastDigits : ",lastDigits)
                                                    // console.log("time : ",time)
                                                    // console.log("customer : ", removed_sip)
                                                    // console.log("value.body : ",value.messageBody)
                                                    // console.log("customer number 568 : ", removed_sip , ParentCallSid, customer)
                                                    if (value.smsTo.toLowerCase() === "specific") {
                                                        console.log("value.body : ", value.messageBody);
                                                        const text = value.messageBody;
                                                        const Obj = {
                                                            "#Caller": removed_sip,
                                                            "#OnlyTenDigit": customer_number_only_10_deigits,
                                                            "#Time": time,
                                                            "#Digits": lastDigits,
                                                        };
                                                        const Obj2 = {
                                                            ...Obj,
                                                            ...dataBaseVariables,
                                                        };
                                                        var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
                                                        const x = text.replace(RE, function (matched) {
                                                            //@ts-ignore
                                                            return Obj2[matched];
                                                        });
                                                        // console.log("x : ",x)
                                                        const y = x
                                                            .replace(/\[/g, "")
                                                            .replace(/\]/g, "")
                                                            .replace(/\#/g, ""); //value of string after replacing [] from the messageBody
                                                        if (value.carrierType.toLowerCase() === "domestic") {
                                                            Promise.all(value.toNumbers.map(async (to) => {
                                                                // console.log("to : ",to.number)
                                                                const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                                const json_result = JSON.parse(string_result);
                                                                const sms_data = new smsModel_1.default(json_result);
                                                                await sms_data.save();
                                                            }));
                                                        }
                                                        if (value.carrierType.toLowerCase() ===
                                                            "international") {
                                                            Promise.all(value.toNumbers.map(async (to) => {
                                                                // console.log("to : ",to.number)
                                                                const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                                const json_result = JSON.parse(string_result);
                                                                const sms_data = new smsModel_1.default(json_result);
                                                                await sms_data.save();
                                                            }));
                                                        }
                                                    }
                                                    if (value.smsTo.toLowerCase() === "dynamic") {
                                                        const text = value.messageBody;
                                                        const Obj = {
                                                            "#Caller": removed_sip,
                                                            "#OnlyTenDigit": customer_number_only_10_deigits,
                                                            "#Time": time,
                                                            "#Digits": lastDigits,
                                                        };
                                                        const Obj2 = {
                                                            ...Obj,
                                                            ...dataBaseVariables,
                                                        };
                                                        var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
                                                        const x = text.replace(RE, function (matched) {
                                                            // console.log("matched : ",matched)
                                                            //@ts-ignore
                                                            return Obj2[matched];
                                                        });
                                                        const y = x
                                                            .replace(/\[/g, "")
                                                            .replace(/\]/g, "")
                                                            .replace(/\#/g, ""); //value of string after replacing [] from the messageBody
                                                        // console.log("y : ",y)
                                                        if (value.carrierType.toLowerCase() === "domestic") {
                                                            const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, removed_sip);
                                                            const json_result = JSON.parse(string_result);
                                                            const sms_data = new smsModel_1.default(json_result);
                                                            await sms_data.save();
                                                        }
                                                        if (value.carrierType.toLowerCase() ===
                                                            "international") {
                                                            const string_result = await this.sendCompletedMessageThree(value.AuthId, value.AuthSecret, value.senderId, value.peId, y, removed_sip);
                                                            const json_result = JSON.parse(string_result);
                                                            const sms_data = new smsModel_1.default(json_result);
                                                            await sms_data.save();
                                                        }
                                                    }
                                                }
                                                if (targetNode.type == "PlayAudioNode") {
                                                    makePlayXml = true;
                                                    loop = targetNode.data.loop;
                                                    audioUrl = targetNode.data.audioUrl;
                                                    playAudioPause = targetNode.data.playAudioPause;
                                                }
                                                // voice.say("Message Sent")
                                                // return res.send(voice.toString())
                                            }
                                            if (makePlayXml == true) {
                                                voice.play({ loop: loop }, audioUrl);
                                                voice.pause({ length: playAudioPause });
                                                console.log("xml is : ", voice.toString());
                                                return res.send(voice.toString());
                                            }
                                            voice.hangup();
                                            console.log("xml is : ", voice.toString());
                                            return res.send(voice.toString());
                                        }
                                        if (connectorWithTargetId.length == 1) {
                                            // console.log("targetNodeMore is one : ", connectorWithTargetId.length , connectorWithTargetId)
                                            const value = targetNode.data;
                                            // console.log("value : ",value )
                                            let ParentCallSid;
                                            if (req.body.ParentCallSid) {
                                                ParentCallSid = req.body.ParentCallSid;
                                            }
                                            else {
                                                ParentCallSid = conferenceIdFromRoomId.ParentCallSid
                                                    ? conferenceIdFromRoomId.ParentCallSid
                                                    : req.query.ParentCallSid;
                                            }
                                            const myQuery = { ParentCallSid: ParentCallSid };
                                            const customer = await ivrStudiosModelCallBacks_1.default.find(myQuery);
                                            // console.log("customer : ",customer)
                                            const time = customer[0].subscribeDate;
                                            const call_back_with_digits = customer.filter((customer) => {
                                                if (customer.source === "gather_response_body_ivr_flow") {
                                                    let Digits = customer.Digits;
                                                    return Digits;
                                                }
                                            });
                                            const array_of_selected_Digits = call_back_with_digits.map((customer) => {
                                                return customer.Digits;
                                            });
                                            let lastDigits;
                                            // console.log("call_back_with_digits.slice(-1)[0] : ",call_back_with_digits.slice(-1)[0])
                                            if (call_back_with_digits.slice(-1)[0] === undefined) {
                                                lastDigits = "";
                                            }
                                            if (call_back_with_digits.slice(-1)[0] !== undefined) {
                                                lastDigits = call_back_with_digits.slice(-1)[0].Digits;
                                            }
                                            let removed_sip; //customer number
                                            let customer_number_only_10_deigits;
                                            if (customer[0].From) {
                                                if (customer[0].From.includes("sip:")) {
                                                    let removed_ip = customer[0].From.split("@")[0];
                                                    removed_sip = removed_ip.split(":")[1];
                                                }
                                                else {
                                                    removed_sip = customer[0].From;
                                                    removed_sip = removed_sip.replace(/^0+/, "");
                                                    customer_number_only_10_deigits = removed_sip.substr(removed_sip.length - 10);
                                                }
                                            }
                                            console.log("array_of_selected_Digits : ", array_of_selected_Digits);
                                            // console.log("lastDigits : ",lastDigits)
                                            // console.log("time : ",time)
                                            // console.log("customer : ", removed_sip)
                                            // console.log("value.body : ",value.messageBody)
                                            // console.log("customer number 720 : ", removed_sip , ParentCallSid , customer)
                                            if (value.smsTo.toLowerCase() === "specific") {
                                                console.log("value.body : ", value.messageBody);
                                                const text = value.messageBody;
                                                const Obj = {
                                                    "#Caller": removed_sip,
                                                    "#OnlyTenDigit": customer_number_only_10_deigits,
                                                    "#Time": time,
                                                    "#Digits": lastDigits,
                                                };
                                                var RE = new RegExp(Object.keys(Obj).join("|"), "gi");
                                                const x = text.replace(RE, function (matched) {
                                                    //@ts-ignore
                                                    return Obj[matched];
                                                });
                                                // console.log("x : ",x)
                                                const y = x.replace(/\[/g, "").replace(/\]/g, ""); //value of string after replacing [] from the messageBody
                                                if (value.carrierType.toLowerCase() === "domestic") {
                                                    Promise.all(value.toNumbers.map(async (to) => {
                                                        console.log("to : ", to.number);
                                                        const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                        const json_result = JSON.parse(string_result);
                                                        const sms_data = new smsModel_1.default(json_result);
                                                        await sms_data.save();
                                                    }));
                                                }
                                                if (value.carrierType.toLowerCase() === "international") {
                                                    Promise.all(value.toNumbers.map(async (to) => {
                                                        // console.log("to : ",to.number)
                                                        const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                        const json_result = JSON.parse(string_result);
                                                        const sms_data = new smsModel_1.default(json_result);
                                                        await sms_data.save();
                                                    }));
                                                }
                                            }
                                            if (value.smsTo.toLowerCase() === "dynamic") {
                                                const text = value.messageBody;
                                                const Obj = {
                                                    "#Caller": removed_sip,
                                                    "#OnlyTenDigit": customer_number_only_10_deigits,
                                                    "#Time": time,
                                                    "#Digits": lastDigits,
                                                };
                                                var RE = new RegExp(Object.keys(Obj).join("|"), "gi");
                                                const x = text.replace(RE, function (matched) {
                                                    console.log("matched : ", matched);
                                                    //@ts-ignore
                                                    return Obj[matched];
                                                });
                                                const y = x.replace(/\[/g, "").replace(/\]/g, ""); //value of string after replacing [] from the messageBody
                                                // console.log("y : ",y)
                                                if (value.carrierType.toLowerCase() === "domestic") {
                                                    const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, removed_sip);
                                                    const json_result = JSON.parse(string_result);
                                                    const sms_data = new smsModel_1.default(json_result);
                                                    await sms_data.save();
                                                }
                                                if (value.carrierType.toLowerCase() === "international") {
                                                    const string_result = await this.sendCompletedMessageThree(value.AuthId, value.AuthSecret, value.senderId, value.peId, y, removed_sip);
                                                    const json_result = JSON.parse(string_result);
                                                    const sms_data = new smsModel_1.default(json_result);
                                                    await sms_data.save();
                                                }
                                            }
                                            voice.hangup();
                                            console.log("xml is : ", voice.toString());
                                            return res.send(voice.toString());
                                        }
                                        console.log("parentCallSid : ", req.query.ParentCallSid);
                                        voice.hangup();
                                        console.log("xml is : ", voice.toString());
                                        return res.send(voice.toString());
                                    }
                                }
                                else {
                                    await ConferenceModel_1.default.findOneAndUpdate({ FriendlyName: roomId }, { isMessageSent: false });
                                    // const deletedValue  :any= await ConferenceModel.findOneAndDelete({"FriendlyName" : roomId})
                                    // console.log("delete : ",deletedValue)
                                    let loop;
                                    let audioUrl;
                                    let playAudioPause;
                                    let makePlayXml = false;
                                    let ParentCallSid;
                                    if (req.body.ParentCallSid) {
                                        ParentCallSid = req.body.ParentCallSid;
                                    }
                                    else {
                                        ParentCallSid = req.query.ParentCallSid;
                                    }
                                    const customerVariablesDetails = await IvrStudiousRealTime_1.default.findOne({
                                        ParentCallSid: ParentCallSid,
                                    });
                                    let dataBaseVariables = {};
                                    if (customerVariablesDetails) {
                                        if (customerVariablesDetails.variables) {
                                            console.log("customerVariablesDetails : ", customerVariablesDetails.variables);
                                            const tempObj = customerVariablesDetails.variables.map((variable) => {
                                                const stringObj = `{"${variable.key}":"${variable.value}"}`;
                                                return JSON.parse(stringObj);
                                            });
                                            // console.log("tempObj : ",tempObj)
                                            const a = tempObj.reduce((acc, obj) => Object.assign(acc, obj), {});
                                            // console.log("a : ",a)
                                            dataBaseVariables = a;
                                        }
                                    }
                                    if (connectorWithTargetId.length > 1) {
                                        // console.log("targetNodeMoreThatnOne : ", connectorWithTargetId.length , connectorWithTargetId)
                                        for (let i = 0; i < connectorWithTargetId.length; i++) {
                                            // console.log("targetNode_id[i] : ",connectorWithTargetId[i])
                                            const targetNode = allNodes.find((node) => node.id === connectorWithTargetId[i].target);
                                            // console.log("targetNode : ",targetNode)
                                            if (targetNode.type == "MessageNode") {
                                                const value = targetNode.data;
                                                // console.log("value : ",value)
                                                let ParentCallSid;
                                                if (req.body.ParentCallSid) {
                                                    ParentCallSid = req.body.ParentCallSid;
                                                }
                                                else {
                                                    ParentCallSid = conferenceIdFromRoomId.ParentCallSid
                                                        ? conferenceIdFromRoomId.ParentCallSid
                                                        : req.query.ParentCallSid;
                                                }
                                                const myQuery = { ParentCallSid: ParentCallSid };
                                                const customer = await ivrStudiosModelCallBacks_1.default.find(myQuery);
                                                // console.log("customer : ",customer)
                                                const time = customer[0].subscribeDate;
                                                const call_back_with_digits = customer.filter((customer) => {
                                                    if (customer.source ===
                                                        "gather_response_body_ivr_flow") {
                                                        let Digits = customer.Digits;
                                                        return Digits;
                                                    }
                                                });
                                                const array_of_selected_Digits = call_back_with_digits.map((customer) => {
                                                    return customer.Digits;
                                                });
                                                let lastDigits;
                                                console.log("call_back_with_digits.slice(-1)[0] : ", call_back_with_digits.slice(-1)[0]);
                                                if (call_back_with_digits.slice(-1)[0] === undefined) {
                                                    lastDigits = "";
                                                }
                                                if (call_back_with_digits.slice(-1)[0] !== undefined) {
                                                    lastDigits =
                                                        call_back_with_digits.slice(-1)[0].Digits;
                                                }
                                                let removed_sip; //customer number
                                                let customer_number_only_10_deigits;
                                                if (customer[0].From) {
                                                    if (customer[0].From.includes("sip:")) {
                                                        let removed_ip = customer[0].From.split("@")[0];
                                                        removed_sip = removed_ip.split(":")[1];
                                                    }
                                                    else {
                                                        removed_sip = customer[0].From;
                                                        removed_sip = removed_sip.replace(/^0+/, "");
                                                        customer_number_only_10_deigits =
                                                            removed_sip.substr(removed_sip.length - 10);
                                                    }
                                                }
                                                console.log("array_of_selected_Digits : ", array_of_selected_Digits);
                                                // console.log("lastDigits : ",lastDigits)
                                                // console.log("time : ",time)
                                                // console.log("customer : ", removed_sip)
                                                // console.log("value.body : ",value.messageBody)
                                                // console.log("customer number 568 : ", removed_sip , ParentCallSid, customer)
                                                if (value.smsTo.toLowerCase() === "specific") {
                                                    console.log("value.body : ", value.messageBody);
                                                    const text = value.messageBody;
                                                    const Obj = {
                                                        "#Caller": removed_sip,
                                                        "#OnlyTenDigit": customer_number_only_10_deigits,
                                                        "#Time": time,
                                                        "#Digits": lastDigits,
                                                    };
                                                    const Obj2 = {
                                                        ...Obj,
                                                        ...dataBaseVariables,
                                                    };
                                                    var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
                                                    const x = text.replace(RE, function (matched) {
                                                        //@ts-ignore
                                                        return Obj2[matched];
                                                    });
                                                    // console.log("x : ",x)
                                                    const y = x
                                                        .replace(/\[/g, "")
                                                        .replace(/\]/g, "")
                                                        .replace(/\#/g, ""); //value of string after replacing [] from the messageBody
                                                    if (value.carrierType.toLowerCase() === "domestic") {
                                                        Promise.all(value.toNumbers.map(async (to) => {
                                                            // console.log("to : ",to.number)
                                                            const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                            const json_result = JSON.parse(string_result);
                                                            const sms_data = new smsModel_1.default(json_result);
                                                            await sms_data.save();
                                                        }));
                                                    }
                                                    if (value.carrierType.toLowerCase() === "international") {
                                                        Promise.all(value.toNumbers.map(async (to) => {
                                                            // console.log("to : ",to.number)
                                                            const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                            const json_result = JSON.parse(string_result);
                                                            const sms_data = new smsModel_1.default(json_result);
                                                            await sms_data.save();
                                                        }));
                                                    }
                                                }
                                                if (value.smsTo.toLowerCase() === "dynamic") {
                                                    const text = value.messageBody;
                                                    const Obj = {
                                                        "#Caller": removed_sip,
                                                        "#OnlyTenDigit": customer_number_only_10_deigits,
                                                        "#Time": time,
                                                        "#Digits": lastDigits,
                                                    };
                                                    const Obj2 = {
                                                        ...Obj,
                                                        ...dataBaseVariables,
                                                    };
                                                    var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
                                                    const x = text.replace(RE, function (matched) {
                                                        // console.log("matched : ",matched)
                                                        //@ts-ignore
                                                        return Obj2[matched];
                                                    });
                                                    const y = x
                                                        .replace(/\[/g, "")
                                                        .replace(/\]/g, "")
                                                        .replace(/\#/g, ""); //value of string after replacing [] from the messageBody
                                                    // console.log("y : ",y)
                                                    if (value.carrierType.toLowerCase() === "domestic") {
                                                        const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, removed_sip);
                                                        const json_result = JSON.parse(string_result);
                                                        const sms_data = new smsModel_1.default(json_result);
                                                        await sms_data.save();
                                                    }
                                                    if (value.carrierType.toLowerCase() === "international") {
                                                        const string_result = await this.sendCompletedMessageThree(value.AuthId, value.AuthSecret, value.senderId, value.peId, y, removed_sip);
                                                        const json_result = JSON.parse(string_result);
                                                        const sms_data = new smsModel_1.default(json_result);
                                                        await sms_data.save();
                                                    }
                                                }
                                            }
                                            if (targetNode.type == "PlayAudioNode") {
                                                makePlayXml = true;
                                                loop = targetNode.data.loop;
                                                audioUrl = targetNode.data.audioUrl;
                                                playAudioPause = targetNode.data.playAudioPause;
                                            }
                                            // voice.say("Message Sent")
                                            // return res.send(voice.toString())
                                        }
                                        if (makePlayXml == true) {
                                            voice.play({ loop: loop }, audioUrl);
                                            voice.pause({ length: playAudioPause });
                                            console.log("xml is : ", voice.toString());
                                            return res.send(voice.toString());
                                        }
                                        voice.hangup();
                                        console.log("xml is : ", voice.toString());
                                        return res.send(voice.toString());
                                    }
                                    if (connectorWithTargetId.length == 1) {
                                        // console.log("targetNodeMore is one : ", connectorWithTargetId.length , connectorWithTargetId)
                                        const value = targetNode.data;
                                        // console.log("value : ",value )
                                        let ParentCallSid;
                                        if (req.body.ParentCallSid) {
                                            ParentCallSid = req.body.ParentCallSid;
                                        }
                                        else {
                                            ParentCallSid = conferenceIdFromRoomId.ParentCallSid
                                                ? conferenceIdFromRoomId.ParentCallSid
                                                : req.query.ParentCallSid;
                                        }
                                        const myQuery = { ParentCallSid: ParentCallSid };
                                        const customer = await ivrStudiosModelCallBacks_1.default.find(myQuery);
                                        // console.log("customer : ",customer)
                                        const time = customer[0].subscribeDate;
                                        const call_back_with_digits = customer.filter((customer) => {
                                            if (customer.source === "gather_response_body_ivr_flow") {
                                                let Digits = customer.Digits;
                                                return Digits;
                                            }
                                        });
                                        const array_of_selected_Digits = call_back_with_digits.map((customer) => {
                                            return customer.Digits;
                                        });
                                        let lastDigits;
                                        // console.log("call_back_with_digits.slice(-1)[0] : ",call_back_with_digits.slice(-1)[0])
                                        if (call_back_with_digits.slice(-1)[0] === undefined) {
                                            lastDigits = "";
                                        }
                                        if (call_back_with_digits.slice(-1)[0] !== undefined) {
                                            lastDigits = call_back_with_digits.slice(-1)[0].Digits;
                                        }
                                        let removed_sip; //customer number
                                        let customer_number_only_10_deigits;
                                        if (customer[0].From) {
                                            if (customer[0].From.includes("sip:")) {
                                                let removed_ip = customer[0].From.split("@")[0];
                                                removed_sip = removed_ip.split(":")[1];
                                            }
                                            else {
                                                removed_sip = customer[0].From;
                                                removed_sip = removed_sip.replace(/^0+/, "");
                                                customer_number_only_10_deigits = removed_sip.substr(removed_sip.length - 10);
                                            }
                                        }
                                        console.log("array_of_selected_Digits : ", array_of_selected_Digits);
                                        // console.log("lastDigits : ",lastDigits)
                                        // console.log("time : ",time)
                                        // console.log("customer : ", removed_sip)
                                        // console.log("value.body : ",value.messageBody)
                                        // console.log("customer number 720 : ", removed_sip , ParentCallSid , customer)
                                        if (value.smsTo.toLowerCase() === "specific") {
                                            console.log("value.body : ", value.messageBody);
                                            const text = value.messageBody;
                                            const Obj = {
                                                "#Caller": removed_sip,
                                                "#OnlyTenDigit": customer_number_only_10_deigits,
                                                "#Time": time,
                                                "#Digits": lastDigits,
                                            };
                                            var RE = new RegExp(Object.keys(Obj).join("|"), "gi");
                                            const x = text.replace(RE, function (matched) {
                                                //@ts-ignore
                                                return Obj[matched];
                                            });
                                            // console.log("x : ",x)
                                            const y = x.replace(/\[/g, "").replace(/\]/g, ""); //value of string after replacing [] from the messageBody
                                            if (value.carrierType.toLowerCase() === "domestic") {
                                                Promise.all(value.toNumbers.map(async (to) => {
                                                    console.log("to : ", to.number);
                                                    const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                    const json_result = JSON.parse(string_result);
                                                    const sms_data = new smsModel_1.default(json_result);
                                                    await sms_data.save();
                                                }));
                                            }
                                            if (value.carrierType.toLowerCase() === "international") {
                                                Promise.all(value.toNumbers.map(async (to) => {
                                                    // console.log("to : ",to.number)
                                                    const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                    const json_result = JSON.parse(string_result);
                                                    const sms_data = new smsModel_1.default(json_result);
                                                    await sms_data.save();
                                                }));
                                            }
                                        }
                                        if (value.smsTo.toLowerCase() === "dynamic") {
                                            const text = value.messageBody;
                                            const Obj = {
                                                "#Caller": removed_sip,
                                                "#OnlyTenDigit": customer_number_only_10_deigits,
                                                "#Time": time,
                                                "#Digits": lastDigits,
                                            };
                                            var RE = new RegExp(Object.keys(Obj).join("|"), "gi");
                                            const x = text.replace(RE, function (matched) {
                                                console.log("matched : ", matched);
                                                //@ts-ignore
                                                return Obj[matched];
                                            });
                                            const y = x.replace(/\[/g, "").replace(/\]/g, ""); //value of string after replacing [] from the messageBody
                                            // console.log("y : ",y)
                                            if (value.carrierType.toLowerCase() === "domestic") {
                                                const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, removed_sip);
                                                const json_result = JSON.parse(string_result);
                                                const sms_data = new smsModel_1.default(json_result);
                                                await sms_data.save();
                                            }
                                            if (value.carrierType.toLowerCase() === "international") {
                                                const string_result = await this.sendCompletedMessageThree(value.AuthId, value.AuthSecret, value.senderId, value.peId, y, removed_sip);
                                                const json_result = JSON.parse(string_result);
                                                const sms_data = new smsModel_1.default(json_result);
                                                await sms_data.save();
                                            }
                                        }
                                        voice.hangup();
                                        console.log("xml is : ", voice.toString());
                                        return res.send(voice.toString());
                                    }
                                    console.log("parentCallSid : ", req.query.ParentCallSid);
                                    voice.hangup();
                                    console.log("xml is : ", voice.toString());
                                    return res.send(voice.toString());
                                }
                            }
                            if (targetNode.type === "SpeakNode") {
                                const nextNodeToAction = allNodes.filter((node) => {
                                    if (node.source == targetNode.id) {
                                        return node;
                                    }
                                });
                                const detailsOfNextNodeToAction = allNodes.filter((node) => {
                                    if (node.id == nextNodeToAction[0].target) {
                                        return node;
                                    }
                                });
                                // console.log("detailsOfNextNodeToAction : ",detailsOfNextNodeToAction)
                                // console.log("nextNodeToAction multi target: ",nextNodeToAction)
                                let nextTargetNode = nextNodeToAction;
                                if (nextTargetNode.length > 0) {
                                    if (detailsOfNextNodeToAction.length > 0) {
                                        if (detailsOfNextNodeToAction[0].type == "HangUpNode") {
                                            nextTargetNode = nextNodeToAction;
                                            voice.say({
                                                voice: targetNode.data.speakVoiceType,
                                                language: targetNode.data.languageCode,
                                            }, targetNode.data.speakBody);
                                            voice.hangup();
                                            console.log("xml is : ", voice.toString());
                                            return res.send(voice.toString());
                                        }
                                        else {
                                            voice.say({
                                                voice: targetNode.data.speakVoiceType,
                                                language: targetNode.data.languageCode,
                                            }, targetNode.data.speakBody);
                                            voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNodeToAction[0].target}/${targetNode.id}`);
                                            console.log("xml is : ", voice.toString());
                                            return res.send(voice.toString());
                                        }
                                    }
                                }
                                // const deletedValue  :any= await ConferenceModel.findOneAndDelete({"FriendlyName" : roomId})
                                // console.log("delete : ",deletedValue)
                                voice.say({
                                    voice: targetNode.data.speakVoiceType,
                                    language: targetNode.data.languageCode,
                                }, targetNode.data.speakBody);
                                console.log("xml is : ", voice.toString());
                                return res.send(voice.toString());
                            }
                            if (targetNode.type === "BusinessHourNode") {
                                console.log("Write Logic for bussiness hour after reading call backs of previous calls ");
                                let timeAfterThreeHour;
                                timeAfterThreeHour = (0, moment_1.default)().add(3, "hours").toDate();
                                const newRealTime = new IvrStudiousRealTime_1.default({
                                    ...req.query,
                                    source: "Web",
                                    expireDate: timeAfterThreeHour,
                                });
                                await newRealTime.save();
                                let nodeDetails = targetNode.data;
                                console.log("nodeDetails : ", nodeDetails);
                                const connectors = allNodes.filter((item) => {
                                    if (item.type == "buttonedge") {
                                        return item;
                                    }
                                });
                                console.log("Connectors : ", connectors);
                                const filteredNextNodeData = this.findTargetsFromSource(allNodes, targetNode.id);
                                console.log("filteredNextNodeData : ", filteredNextNodeData);
                                if (filteredNextNodeData.length > 0) {
                                    if (nodeDetails.bHourOption == "anytime") {
                                        let bussinessHourNodeId = filteredNextNodeData[0].id;
                                        const nextNodeConnectedToBussinessHourNodeOn = connectors.filter((item) => {
                                            if (item.source === bussinessHourNodeId &&
                                                item.sourceHandle == "businesshourOn") {
                                                return item;
                                            }
                                        });
                                        const nextNodeIfSuccess = data.input?.filter((item) => {
                                            if (item.id ===
                                                nextNodeConnectedToBussinessHourNodeOn[0].target) {
                                                return item;
                                            }
                                        });
                                        if (nextNodeIfSuccess.length > 0) {
                                            console.log("next node if succes ", nextNodeIfSuccess[0]);
                                            if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                let numDigits = nextNodeIfSuccess[0].data.inputLength
                                                    ? nextNodeIfSuccess[0].data.inputLength
                                                    : "1";
                                                let Parent;
                                                Parent = voice.gather({
                                                    action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNodeIfSuccess[0].id}/${source}`,
                                                    method: "POST",
                                                    numDigits: numDigits,
                                                });
                                                if (nextNodeIfSuccess[0].data.ivrAudioUrl) {
                                                    Parent.play({ loop: nextNodeIfSuccess[0].data.loop }, nextNodeIfSuccess[0].data.ivrAudioUrl);
                                                    voice.pause({
                                                        length: nextNodeIfSuccess[0].data.ivrPlayAudioPause,
                                                    });
                                                }
                                                return res.send(voice.toString());
                                            }
                                            if (nextNodeIfSuccess[0].type === "PlayAudioNode") {
                                                const newRealTime = new IvrStudiousRealTime_1.default({
                                                    ...req.query,
                                                    source: "Web",
                                                });
                                                await newRealTime.save();
                                                // const nextNode_for_action = connectors.filter((item : any)=>{
                                                //     if(item.source === nextNodeIfSuccess[0].id){
                                                //         return item
                                                //     }
                                                // })
                                                const nextNode_for_action_id = connectors.filter((item) => {
                                                    if (item.source === nextNodeIfSuccess[0].id) {
                                                        return item;
                                                    }
                                                });
                                                const nextNode_for_action_id_data = nextNode_for_action_id[0].target;
                                                // console.log("nextNode_for_action : ",nextNode_for_action_id_data)
                                                voice.play({
                                                    loop: nextNodeIfSuccess[0].data.loop,
                                                    digits: "wwww3",
                                                }, nextNodeIfSuccess[0].data.audioUrl);
                                                voice.pause({
                                                    length: nextNodeIfSuccess[0].data.playAudioPause,
                                                });
                                                voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNode_for_action_id_data}/${source}`);
                                                return res.send(voice.toString());
                                            }
                                        }
                                    }
                                    else {
                                        for (let i = 0; i < targetNode.data.bHourDays.length; i++) {
                                            if (nodeDetails.bHourDays[i].isWorking === true) {
                                                const currentTime = new Date();
                                                const currentDay = this.getNameOfDay(currentTime.getDay());
                                                // console.log("currentDay : ",currentDay , nodeDetails.bHourDays[i].day )
                                                if (currentDay.toLowerCase() ==
                                                    nodeDetails.bHourDays[i].day.toLowerCase()) {
                                                    const now = (0, moment_1.default)()
                                                        .add(5, "hours")
                                                        .add(30, "minutes")
                                                        .format(); // in local it is fine but in live it is giving actual time so dont need to add hours
                                                    //const now = moment().format()
                                                    const tempStartEndObj = await this.getStartAndEndTimeFromMultipleTimeInSingleDay(nodeDetails.bHourDays[i], now);
                                                    console.log("tempStartEndObj 2395 : ", tempStartEndObj);
                                                    let { startTime, endTime } = tempStartEndObj;
                                                    const start = startTime;
                                                    const end = endTime;
                                                    let bussinessHourNodeId = targetNode.id;
                                                    // console.log("bussinessHourNodeId : ",bussinessHourNodeId)
                                                    if ((0, moment_1.default)(now).isBetween(start, end)) {
                                                        console.log("is between  now : ", now, "start : ", start, "end : ", end);
                                                        // console.log("connectors : ", connectors)
                                                        const nextNodeConnectedToBussinessHourNodeOn = connectors.filter((item) => {
                                                            if (item.source === bussinessHourNodeId &&
                                                                item.sourceHandle == "businesshourOn") {
                                                                return item;
                                                            }
                                                        });
                                                        console.log("nextNodeConnectedToBussinessHourNode 2411: ", nextNodeConnectedToBussinessHourNodeOn);
                                                        const nextNodeIfSuccess = data.input?.filter((item) => {
                                                            if (item.id ===
                                                                nextNodeConnectedToBussinessHourNodeOn[0]
                                                                    .target) {
                                                                return item;
                                                            }
                                                        });
                                                        console.log("nextNodeIfSuccess : ", nextNodeIfSuccess);
                                                        if (nextNodeIfSuccess.length > 0) {
                                                            console.log("next node if not succes 2421 ", nextNodeIfSuccess[0]);
                                                            if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                                const newRealTime = new IvrStudiousRealTime_1.default({
                                                                    ...req.query,
                                                                    source: "Web",
                                                                });
                                                                await newRealTime.save();
                                                                let numDigits = nextNodeIfSuccess[0].data
                                                                    .inputLength
                                                                    ? nextNodeIfSuccess[0].data.inputLength
                                                                    : "1";
                                                                let Parent;
                                                                Parent = voice.gather({
                                                                    action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNodeIfSuccess[0].id}/${source}`,
                                                                    method: "POST",
                                                                    numDigits: numDigits,
                                                                });
                                                                if (nextNodeIfSuccess[0].data.ivrAudioUrl) {
                                                                    Parent.play({ loop: nextNodeIfSuccess[0].data.loop }, nextNodeIfSuccess[0].data.ivrAudioUrl);
                                                                    voice.pause({
                                                                        length: nextNodeIfSuccess[0].data
                                                                            .ivrPlayAudioPause,
                                                                    });
                                                                }
                                                                return res.send(voice.toString());
                                                            }
                                                            if (nextNodeIfSuccess[0].type === "PlayAudioNode") {
                                                                const newRealTime = new IvrStudiousRealTime_1.default({
                                                                    ...req.query,
                                                                    source: "Web",
                                                                });
                                                                await newRealTime.save();
                                                                // const nextNode_for_action = connectors.filter((item : any)=>{
                                                                //     if(item.source === nextNodeIfSuccess[0].id){
                                                                //         return item
                                                                //     }
                                                                // })
                                                                const nextNode_for_action_id = connectors.filter((item) => {
                                                                    if (item.source === nextNodeIfSuccess[0].id) {
                                                                        return item;
                                                                    }
                                                                });
                                                                const nextNode_for_action_id_data = nextNode_for_action_id[0].target;
                                                                // console.log("nextNode_for_action : ",nextNode_for_action_id_data)
                                                                voice.play({
                                                                    loop: nextNodeIfSuccess[0].data.loop,
                                                                    digits: "wwww3",
                                                                }, nextNodeIfSuccess[0].data.audioUrl);
                                                                voice.pause({
                                                                    length: nextNodeIfSuccess[0].data.playAudioPause,
                                                                });
                                                                voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNode_for_action_id_data}/${source}`);
                                                                return res.send(voice.toString());
                                                            }
                                                            if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                                const nextNodeToAction = allNodes.filter((node) => {
                                                                    if (node.source == nextNodeIfSuccess[0].id) {
                                                                        return node;
                                                                    }
                                                                });
                                                                if (nextNodeToAction.length > 0) {
                                                                    let ParentGather;
                                                                    let numDigits = nextNodeIfSuccess[0].data
                                                                        .inputLength
                                                                        ? nextNodeIfSuccess[0].data.inputLength
                                                                        : "1";
                                                                    ParentGather = voice.gather({
                                                                        action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNodeIfSuccess[0].id}/${target}`,
                                                                        method: "POST",
                                                                        numDigits: numDigits,
                                                                    });
                                                                    ParentGather.play({ loop: nextNodeIfSuccess[0].data.loop }, nextNodeIfSuccess[0].data.ivrAudioUrl);
                                                                    voice.pause({
                                                                        length: nextNodeIfSuccess[0].data
                                                                            .ivrPlayAudioPause,
                                                                    });
                                                                    console.log("xml is : ", voice.toString());
                                                                    return res.send(voice.toString());
                                                                }
                                                                voice.play({ loop: nextNodeIfSuccess[0].data.loop }, nextNodeIfSuccess[0].data.ivrAudioUrl);
                                                                voice.pause({
                                                                    length: nextNodeIfSuccess[0].data.ivrPlayAudioPause,
                                                                });
                                                                console.log("xml is : ", voice.toString());
                                                                return res.send(voice.toString());
                                                            }
                                                            if (nextNodeIfSuccess[0].type ===
                                                                "MultiPartyCallNode") {
                                                                const targetNode = nextNodeIfSuccess[0];
                                                                const randomId = Math.random()
                                                                    .toString(36)
                                                                    .substr(2, 25);
                                                                const roomName = "Room_" + randomId;
                                                                if (targetNode.data.mpcCallDistribustion ===
                                                                    "RoundRobin") {
                                                                    console.log("write the logic of round robin here ");
                                                                    let dataFromVibconnect = JSON.stringify(req.body) !== "{}"
                                                                        ? req.body
                                                                        : req.query;
                                                                    const xml = await this.handleMultiPartyCallDistributionOfTypeRoundRobin(targetNode, dataFromVibconnect, id);
                                                                    console.log("xml is : 2491 ", xml);
                                                                    return res.send(xml);
                                                                }
                                                                if (targetNode.data.mpcCallDistribustion ===
                                                                    "Parallel") {
                                                                    let dataFromVibconnect = JSON.stringify(req.body) !== "{}"
                                                                        ? req.body
                                                                        : req.query;
                                                                    const xml = await this.handleMultiPartyCallDistributionProcess(targetNode, dataFromVibconnect, id);
                                                                    console.log("xml is 2498 : ", xml);
                                                                    return res.send(xml);
                                                                }
                                                                else {
                                                                    let Parent;
                                                                    Parent = voice.dial({
                                                                        action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/conference|${roomName}/${nextNodeIfSuccess[0].id}`,
                                                                        method: "GET",
                                                                    });
                                                                    Parent.conference({
                                                                        waitUrl: nextNodeIfSuccess[0].data.mpcAudio,
                                                                        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
                                                                        statusCallbackEvent: "start end join leave mute hold",
                                                                    }, `${roomName}`);
                                                                    let url = "empty";
                                                                    if (nextNodeIfSuccess[0].data.url) {
                                                                        let fullUrl = nextNodeIfSuccess[0].data.url;
                                                                        // let removedHttpsUrl = fullUrl.replace("https://vibtreedan.s3.amazonaws.com/public/","")
                                                                        let removedHttpsUrl = fullUrl.split("public/");
                                                                        url = removedHttpsUrl[1];
                                                                    }
                                                                    let timeOut = "60";
                                                                    if (nextNodeIfSuccess[0].data
                                                                        .mpcCallUsingNumbers[0]) {
                                                                        timeOut =
                                                                            nextNodeIfSuccess[0].data
                                                                                .mpcCallUsingNumbers[0].ringTimeOut;
                                                                    }
                                                                    let correctNumberArray;
                                                                    if (nextNodeIfSuccess[0].data.mpcCallUsing ===
                                                                        "User") {
                                                                        console.log("this is not number this is user typ calling system");
                                                                        let detailsOfNumbersFromUI = nextNodeIfSuccess[0].data
                                                                            .mpcCallUsingNumbers;
                                                                        const numbersFromUerID = await this.extractAllNumberOfCorrespondingUser(detailsOfNumbersFromUI);
                                                                        console.log("List of numbers from user : ", numbersFromUerID);
                                                                        correctNumberArray = numbersFromUerID;
                                                                    }
                                                                    if (nextNodeIfSuccess[0].data.mpcCallUsing ===
                                                                        "Number") {
                                                                        correctNumberArray =
                                                                            nextNodeIfSuccess[0].data
                                                                                .mpcCallUsingNumbers;
                                                                    }
                                                                    let From = req.body.To
                                                                        ? req.body.To
                                                                        : req.query.To;
                                                                    if (nextNodeIfSuccess[0].data.callType ===
                                                                        "default") {
                                                                        From = "+912235315936";
                                                                    }
                                                                    console.log("Correct Number : ", correctNumberArray, nextNodeIfSuccess[0].data
                                                                        .mpcCallUsingNumbers);
                                                                    //For Testing only
                                                                    // Parent.conference({waitUrl : detailsOfTargetNode.data.mpcAudio , statusCallback :'https://dataneuronbackend.herokuapp.com/subscribers' , statusCallbackEvent : 'start end join leave mute hold' },`Room_${req.body.ParentCallSid}`)
                                                                    const body = {
                                                                        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call`,
                                                                        // "statusCallback":`https://dataneuronbackend.herokuapp.com/subscribers`, //For testing Only
                                                                        statusCallbackEvent: "initiated, ringing, answered, completed",
                                                                        Record: "true",
                                                                        // "To": nextNodeIfSuccess[0].data.mpcCallUsingNumbers[0].number,
                                                                        To: correctNumberArray[0].number,
                                                                        From: From,
                                                                        Timeout: timeOut,
                                                                        Method: "GET",
                                                                        // "Url" : `${conf.BaseUrl}/api/getConferenceRoom/Room_${req.body.ParentCallSid}/${url}`
                                                                        Url: `${conf.BaseUrl}/api/checkIfCustomerInLine/${roomName}/${url}`,
                                                                        recordingStatusCallback: `${conf.BaseUrl}/api//vibconnect/webhook/recordings`,
                                                                        recordingStatusCallbackEvent: "in-progress, completed, absent",
                                                                        recordingStatusCallbackMethod: "POST",
                                                                        record: "true",
                                                                    };
                                                                    console.log("node credentials : ", nextNodeIfSuccess[0].data.authId, " : ", nextNodeIfSuccess[0].data.authSecret);
                                                                    const call_details = await this.MakeConferenceCall(nextNodeIfSuccess[0].data.authId, nextNodeIfSuccess[0].data.authSecret, body);
                                                                    const call_details_json = JSON.parse(call_details);
                                                                    let parentCallSid = req.body.ParentCallSid
                                                                        ? req.body.ParentCallSid
                                                                        : req.query.ParentCallSid;
                                                                    const data_required_to_filter_conference_details = {
                                                                        AccountSid: req.body.AccountSid
                                                                            ? req.body.AccountSid
                                                                            : req.query.AccountSid,
                                                                        ParentCallSid: req.body.ParentCallSid
                                                                            ? req.body.ParentCallSid
                                                                            : req.query.ParentCallSid,
                                                                        ConferenceId: "",
                                                                        CallSid: call_details_json.sid,
                                                                        FriendlyName: roomName,
                                                                        ChildCallSid: call_details_json.sid,
                                                                        source: nextNodeIfSuccess[0].id,
                                                                        id: id,
                                                                        listOfChildCallSid: [
                                                                            call_details_json.sid,
                                                                        ],
                                                                        whispherUrl: url,
                                                                    };
                                                                    console.log("data_required_to_filter_conference_details 2783 : ", data_required_to_filter_conference_details);
                                                                    const conference = new ConferenceModel_1.default(data_required_to_filter_conference_details);
                                                                    await conference.save();
                                                                    let queryToSend = {
                                                                        ParentCallSid: parentCallSid,
                                                                    };
                                                                    let updateToSend = {
                                                                        $set: {
                                                                            CallSidOfConferenceChildCall: call_details_json.sid,
                                                                        },
                                                                    };
                                                                    this.updateRealTimeDataOfIvrStudiousForApiCall(queryToSend, updateToSend);
                                                                    console.log("xml is : ", voice.toString());
                                                                    return res.send(voice.toString());
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        const nextNodeConnectedToBussinessHourNodeOff = connectors.filter((item) => {
                                                            if (item.source === bussinessHourNodeId &&
                                                                item.sourceHandle == "businesshourOff") {
                                                                return item;
                                                            }
                                                        });
                                                        console.log("is not between now : ", now, "start : ", start, "end : ", end);
                                                        const nextNodeIfSuccess = data.input?.filter((item) => {
                                                            if (item.id ===
                                                                nextNodeConnectedToBussinessHourNodeOff[0]
                                                                    .target) {
                                                                return item;
                                                            }
                                                        });
                                                        console.log("nextNodeIfSuccess 2609: ", nextNodeIfSuccess);
                                                        if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                            const nextNodeToAction = allNodes.filter((node) => {
                                                                if (node.source == nextNodeIfSuccess[0].id) {
                                                                    return node;
                                                                }
                                                            });
                                                            if (nextNodeToAction.length > 0) {
                                                                let ParentGather;
                                                                let numDigits = nextNodeIfSuccess[0].data
                                                                    .inputLength
                                                                    ? nextNodeIfSuccess[0].data.inputLength
                                                                    : "1";
                                                                ParentGather = voice.gather({
                                                                    action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNodeIfSuccess[0].id}/${target}`,
                                                                    method: "POST",
                                                                    numDigits: numDigits,
                                                                });
                                                                ParentGather.play({ loop: nextNodeIfSuccess[0].data.loop }, nextNodeIfSuccess[0].data.ivrAudioUrl);
                                                                voice.pause({
                                                                    length: nextNodeIfSuccess[0].data.ivrPlayAudioPause,
                                                                });
                                                                console.log("xml is : ", voice.toString());
                                                                return res.send(voice.toString());
                                                            }
                                                            voice.play({ loop: nextNodeIfSuccess[0].data.loop }, nextNodeIfSuccess[0].data.ivrAudioUrl);
                                                            voice.pause({
                                                                length: nextNodeIfSuccess[0].data.ivrPlayAudioPause,
                                                            });
                                                            console.log("xml is : ", voice.toString());
                                                            return res.send(voice.toString());
                                                        }
                                                        if (nextNodeIfSuccess[0].type === "PlayAudioNode") {
                                                            const newRealTime = new IvrStudiousRealTime_1.default({
                                                                ...req.query,
                                                                source: "Web",
                                                            });
                                                            await newRealTime.save();
                                                            // const nextNode_for_action = connectors.filter((item : any)=>{
                                                            //     if(item.source === nextNodeIfSuccess[0].id){
                                                            //         return item
                                                            //     }
                                                            // })
                                                            const nextNode_for_action_id = connectors.filter((item) => {
                                                                if (item.source === nextNodeIfSuccess[0].id) {
                                                                    return item;
                                                                }
                                                            });
                                                            let nextNode_for_action_id_data = "hangup";
                                                            if (nextNode_for_action_id.length > 0) {
                                                                nextNode_for_action_id_data =
                                                                    nextNode_for_action_id[0].target;
                                                            }
                                                            // console.log("nextNode_for_action : ",nextNode_for_action_id_data)
                                                            voice.play({
                                                                loop: nextNodeIfSuccess[0].data.loop,
                                                                digits: "wwww3",
                                                            }, nextNodeIfSuccess[0].data.audioUrl);
                                                            voice.pause({
                                                                length: nextNodeIfSuccess[0].data.playAudioPause,
                                                            });
                                                            voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNode_for_action_id_data}/${source}`);
                                                            return res.send(voice.toString());
                                                        }
                                                        if (nextNodeIfSuccess[0].type === "MultiPartyCallNode") {
                                                            const targetNode = nextNodeIfSuccess[0];
                                                            const randomId = Math.random()
                                                                .toString(36)
                                                                .substr(2, 25);
                                                            const roomName = "Room_" + randomId;
                                                            if (targetNode.data.mpcCallDistribustion ===
                                                                "RoundRobin") {
                                                                console.log("write the logic of round robin here ");
                                                                let dataFromVibconnect = JSON.stringify(req.body) !== "{}"
                                                                    ? req.body
                                                                    : req.query;
                                                                const xml = await this.handleMultiPartyCallDistributionOfTypeRoundRobin(targetNode, dataFromVibconnect, id);
                                                                console.log("xml is : 2668 ", xml);
                                                                return res.send(xml);
                                                            }
                                                            if (targetNode.data.mpcCallDistribustion ===
                                                                "Parallel") {
                                                                let dataFromVibconnect = JSON.stringify(req.body) !== "{}"
                                                                    ? req.body
                                                                    : req.query;
                                                                const xml = await this.handleMultiPartyCallDistributionProcess(targetNode, dataFromVibconnect, id);
                                                                console.log("xml is 2675 : ", xml);
                                                                return res.send(xml);
                                                            }
                                                            else {
                                                                let Parent;
                                                                Parent = voice.dial({
                                                                    action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/conference|${roomName}/${nextNodeIfSuccess[0].id}`,
                                                                    method: "GET",
                                                                });
                                                                Parent.conference({
                                                                    waitUrl: nextNodeIfSuccess[0].data.mpcAudio,
                                                                    statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
                                                                    statusCallbackEvent: "start end join leave mute hold",
                                                                }, `${roomName}`);
                                                                let url = "empty";
                                                                if (nextNodeIfSuccess[0].data.url) {
                                                                    let fullUrl = nextNodeIfSuccess[0].data.url;
                                                                    // let removedHttpsUrl = fullUrl.replace("https://vibtreedan.s3.amazonaws.com/public/","")
                                                                    let removedHttpsUrl = fullUrl.split("public/");
                                                                    url = removedHttpsUrl[1];
                                                                }
                                                                let timeOut = "60";
                                                                if (nextNodeIfSuccess[0].data
                                                                    .mpcCallUsingNumbers[0]) {
                                                                    timeOut =
                                                                        nextNodeIfSuccess[0].data
                                                                            .mpcCallUsingNumbers[0].ringTimeOut;
                                                                }
                                                                let correctNumberArray;
                                                                if (nextNodeIfSuccess[0].data.mpcCallUsing ===
                                                                    "User") {
                                                                    console.log("this is not number this is user typ calling system");
                                                                    let detailsOfNumbersFromUI = nextNodeIfSuccess[0].data
                                                                        .mpcCallUsingNumbers;
                                                                    const numbersFromUerID = await this.extractAllNumberOfCorrespondingUser(detailsOfNumbersFromUI);
                                                                    console.log("List of numbers from user : ", numbersFromUerID);
                                                                    correctNumberArray = numbersFromUerID;
                                                                }
                                                                if (nextNodeIfSuccess[0].data.mpcCallUsing ===
                                                                    "Number") {
                                                                    correctNumberArray =
                                                                        nextNodeIfSuccess[0].data
                                                                            .mpcCallUsingNumbers;
                                                                }
                                                                let From = req.body.To
                                                                    ? req.body.To
                                                                    : req.query.To;
                                                                if (nextNodeIfSuccess[0].data.callType ===
                                                                    "default") {
                                                                    From = "+912235315936";
                                                                }
                                                                console.log("Correct Number : ", correctNumberArray, nextNodeIfSuccess[0].data.mpcCallUsingNumbers);
                                                                //For Testing only
                                                                // Parent.conference({waitUrl : detailsOfTargetNode.data.mpcAudio , statusCallback :'https://dataneuronbackend.herokuapp.com/subscribers' , statusCallbackEvent : 'start end join leave mute hold' },`Room_${req.body.ParentCallSid}`)
                                                                const body = {
                                                                    statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call`,
                                                                    // "statusCallback":`https://dataneuronbackend.herokuapp.com/subscribers`, //For testing Only
                                                                    statusCallbackEvent: "initiated, ringing, answered, completed",
                                                                    Record: "true",
                                                                    // "To": nextNodeIfSuccess[0].data.mpcCallUsingNumbers[0].number,
                                                                    To: correctNumberArray[0].number,
                                                                    From: From,
                                                                    Timeout: timeOut,
                                                                    Method: "GET",
                                                                    // "Url" : `${conf.BaseUrl}/api/getConferenceRoom/Room_${req.body.ParentCallSid}/${url}`
                                                                    Url: `${conf.BaseUrl}/api/checkIfCustomerInLine/${roomName}/${url}`,
                                                                    recordingStatusCallback: `${conf.BaseUrl}/api//vibconnect/webhook/recordings`,
                                                                    recordingStatusCallbackEvent: "in-progress, completed, absent",
                                                                    recordingStatusCallbackMethod: "POST",
                                                                    record: "true",
                                                                };
                                                                console.log("node credentials : ", nextNodeIfSuccess[0].data.authId, " : ", nextNodeIfSuccess[0].data.authSecret);
                                                                const call_details = await this.MakeConferenceCall(nextNodeIfSuccess[0].data.authId, nextNodeIfSuccess[0].data.authSecret, body);
                                                                const call_details_json = JSON.parse(call_details);
                                                                let parentCallSid = req.body.ParentCallSid
                                                                    ? req.body.ParentCallSid
                                                                    : req.query.ParentCallSid;
                                                                const data_required_to_filter_conference_details = {
                                                                    AccountSid: req.body.AccountSid
                                                                        ? req.body.AccountSid
                                                                        : req.query.AccountSid,
                                                                    ParentCallSid: req.body.ParentCallSid
                                                                        ? req.body.ParentCallSid
                                                                        : req.query.ParentCallSid,
                                                                    ConferenceId: "",
                                                                    CallSid: call_details_json.sid,
                                                                    FriendlyName: `${roomName}`,
                                                                    ChildCallSid: call_details_json.sid,
                                                                    source: nextNodeIfSuccess[0].id,
                                                                    id: id,
                                                                    listOfChildCallSid: [call_details_json.sid],
                                                                    whispherUrl: url,
                                                                };
                                                                console.log("data_required_to_filter_conference_details 2783 : ", data_required_to_filter_conference_details);
                                                                const conference = new ConferenceModel_1.default(data_required_to_filter_conference_details);
                                                                await conference.save();
                                                                let queryToSend = {
                                                                    ParentCallSid: parentCallSid,
                                                                };
                                                                let updateToSend = {
                                                                    $set: {
                                                                        CallSidOfConferenceChildCall: call_details_json.sid,
                                                                    },
                                                                };
                                                                this.updateRealTimeDataOfIvrStudiousForApiCall(queryToSend, updateToSend);
                                                                console.log("xml is 2760 : ", voice.toString());
                                                                return res.send(voice.toString());
                                                            }
                                                        }
                                                    }
                                                    // console.log("currentTime : ",currentTime , now)
                                                    // console.log("now : ", now)
                                                    // console.log("start : ",start )
                                                    // console.log("end : ",end )
                                                    // console.log("currentDay : ",currentDay)
                                                }
                                            }
                                        }
                                    }
                                }
                                voice.say("processing...");
                                console.log("xml is : ", voice.toString());
                                return res.send(voice.toString());
                            }
                        }
                    }
                }
                if (target.includes("checkValue")) {
                    const variablesFromUrl = target.split("|");
                    const jsonVariablesFromUrl = JSON.parse(variablesFromUrl[1]);
                    let targetOfNodeIfValueOfVariableExists;
                    let targetOfNodeIfValueOfVariableDoesNotExist;
                    for (let i = 0; i < jsonVariablesFromUrl.length; i++) {
                        if (jsonVariablesFromUrl[i].sourceHandle == "functionSuccess") {
                            //  targetOfNodeIfValueOfVariableExists=  jsonVariablesFromUrl[i].target
                            targetOfNodeIfValueOfVariableExists = allNodes.filter((x) => {
                                if (x.id == jsonVariablesFromUrl[i].target) {
                                    return x;
                                }
                            });
                        }
                        else {
                            targetOfNodeIfValueOfVariableDoesNotExist = allNodes.filter((x) => {
                                if (x.id == jsonVariablesFromUrl[i].target) {
                                    return x;
                                }
                            });
                        }
                    }
                    // console.log("targetOfNodeIfValueOfVariableExists : ",targetOfNodeIfValueOfVariableExists)
                    // console.log("targetOfNodeIfValueOfVariableDoesNotExist : ",targetOfNodeIfValueOfVariableDoesNotExist)
                    let ParentCallSid = variablesFromUrl[2];
                    const valuesAvailableFromRequest = await IvrStudiousRealTime_1.default.find({ ParentCallSid: ParentCallSid });
                    let tempVariables = [];
                    if (valuesAvailableFromRequest.length > 0) {
                        let variables = valuesAvailableFromRequest[0].variables;
                        for (let i = 0; i < variables.length; i++) {
                            if (variables[i].value !== undefined ||
                                variables[i].value !== null ||
                                variables[i].value !== "") {
                                tempVariables.push(variables[i]);
                            }
                        }
                    }
                    // console.log("variables : ",tempVariables)
                    // console.log("valuesAvailableFromRequest : ",valuesAvailableFromRequest)
                    if (tempVariables.length > 0) {
                        let detailsOfTargetNode = targetOfNodeIfValueOfVariableExists[0];
                        console.log("detailsOfTargetNode 1104 : ", detailsOfTargetNode);
                        if (detailsOfTargetNode.type === "MessageNode") {
                            const customerVariablesDetails = await IvrStudiousRealTime_1.default.findOne({ ParentCallSid: ParentCallSid });
                            let dataBaseVariables = {};
                            if (customerVariablesDetails) {
                                if (customerVariablesDetails.variables) {
                                    // console.log("customerVariablesDetails : ",customerVariablesDetails.variables)
                                    const tempObj = customerVariablesDetails.variables.map((variable) => {
                                        const stringObj = `{"${variable.key}":"${variable.value}"}`;
                                        return JSON.parse(stringObj);
                                    });
                                    // console.log("tempObj : ",tempObj)
                                    const a = tempObj.reduce((acc, obj) => Object.assign(acc, obj), {});
                                    // console.log("a : ",a)
                                    dataBaseVariables = a;
                                }
                            }
                            const value = detailsOfTargetNode.data;
                            // console.log("value : ",value)
                            const myQuery = { ParentCallSid: ParentCallSid };
                            const customer = await ivrStudiosModelCallBacks_1.default.find(myQuery);
                            // console.log("customer : ",customer)
                            const time = customer[0].subscribeDate;
                            const call_back_with_digits = customer.filter((customer) => {
                                if (customer.source === "gather_response_body_ivr_flow") {
                                    let Digits = customer.Digits;
                                    return Digits;
                                }
                            });
                            const array_of_selected_Digits = call_back_with_digits.map((customer) => {
                                return customer.Digits;
                            });
                            let lastDigits;
                            console.log("call_back_with_digits.slice(-1)[0] : ", call_back_with_digits.slice(-1)[0]);
                            if (call_back_with_digits.slice(-1)[0] === undefined) {
                                lastDigits = "";
                            }
                            if (call_back_with_digits.slice(-1)[0] !== undefined) {
                                lastDigits = call_back_with_digits.slice(-1)[0].Digits;
                            }
                            let removed_sip; //customer number
                            let customer_number_only_10_deigits;
                            if (customer[0].From) {
                                if (customer[0].From.includes("sip:")) {
                                    let removed_ip = customer[0].From.split("@")[0];
                                    removed_sip = removed_ip.split(":")[1];
                                }
                                else {
                                    removed_sip = customer[0].From;
                                    removed_sip = removed_sip.replace(/^0+/, "");
                                    customer_number_only_10_deigits = removed_sip.substr(removed_sip.length - 10);
                                }
                            }
                            console.log("array_of_selected_Digits : ", array_of_selected_Digits);
                            // console.log("lastDigits : ",lastDigits)
                            // console.log("time : ",time)
                            // console.log("customer : ", removed_sip)
                            // console.log("value.body : ",value.messageBody)
                            // console.log("customer number 1609 : ", removed_sip , ParentCallSid , customer)
                            if (value.smsTo.toLowerCase() === "specific") {
                                // console.log("value.body : ",value.messageBody)
                                const text = value.messageBody;
                                const Obj = {
                                    "#Caller": removed_sip,
                                    "#OnlyTenDigit": customer_number_only_10_deigits,
                                    "#Time": time,
                                    "#Digits": lastDigits,
                                };
                                const Obj2 = {
                                    ...Obj,
                                    ...dataBaseVariables,
                                };
                                var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
                                const x = text.replace(RE, function (matched) {
                                    //@ts-ignore
                                    return Obj2[matched];
                                });
                                // console.log("x : ",x)
                                const y = x
                                    .replace(/\[/g, "")
                                    .replace(/\]/g, "")
                                    .replace(/\#/g, ""); //value of string after replacing [] from the messageBody
                                if (value.carrierType.toLowerCase() === "domestic") {
                                    Promise.all(value.toNumbers.map(async (to) => {
                                        // console.log("to : ",to.number)
                                        const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                        const json_result = JSON.parse(string_result);
                                        const sms_data = new smsModel_1.default(json_result);
                                        await sms_data.save();
                                    }));
                                }
                                if (value.carrierType.toLowerCase() === "international") {
                                    Promise.all(value.toNumbers.map(async (to) => {
                                        // console.log("to : ",to.number)
                                        const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                        const json_result = JSON.parse(string_result);
                                        const sms_data = new smsModel_1.default(json_result);
                                        await sms_data.save();
                                    }));
                                }
                            }
                            if (value.smsTo.toLowerCase() === "dynamic") {
                                const text = value.messageBody;
                                const Obj = {
                                    "#Caller": removed_sip,
                                    "#OnlyTenDigit": customer_number_only_10_deigits,
                                    "#Time": time,
                                    "#Digits": lastDigits,
                                };
                                const Obj2 = {
                                    ...Obj,
                                    ...dataBaseVariables,
                                };
                                var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
                                const x = text.replace(RE, function (matched) {
                                    //@ts-ignore
                                    return Obj2[matched];
                                });
                                // console.log("x : ",x)
                                const y = x
                                    .replace(/\[/g, "")
                                    .replace(/\]/g, "")
                                    .replace(/\#/g, ""); //value of string after replacing [] from the messageBody
                                // console.log("y : ",y)
                                if (value.carrierType.toLowerCase() === "domestic") {
                                    const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, removed_sip);
                                    const json_result = JSON.parse(string_result);
                                    const sms_data = new smsModel_1.default(json_result);
                                    await sms_data.save();
                                }
                                if (value.carrierType.toLowerCase() === "international") {
                                    const string_result = await this.sendCompletedMessageThree(value.AuthId, value.AuthSecret, value.senderId, value.peId, y, removed_sip);
                                    const json_result = JSON.parse(string_result);
                                    const sms_data = new smsModel_1.default(json_result);
                                    await sms_data.save();
                                }
                            }
                            voice.hangup();
                            console.log("xml is : ", voice.toString());
                            return res.send(voice.toString());
                        }
                        if (detailsOfTargetNode.type === "SpeakNode") {
                            //replacing the variables in the speak body
                            const customerVariablesDetails = await IvrStudiousRealTime_1.default.findOne({ ParentCallSid: ParentCallSid });
                            let dataBaseVariables = {};
                            if (customerVariablesDetails) {
                                if (customerVariablesDetails.variables) {
                                    // console.log("customerVariablesDetails : ",customerVariablesDetails.variables)
                                    const tempObj = customerVariablesDetails.variables.map((variable) => {
                                        const stringObj = `{"${variable.key}":"${variable.value}"}`;
                                        return JSON.parse(stringObj);
                                    });
                                    // console.log("tempObj : ",tempObj)
                                    const a = tempObj.reduce((acc, obj) => Object.assign(acc, obj), {});
                                    // console.log("a : ",a)
                                    dataBaseVariables = a;
                                }
                            }
                            const text = detailsOfTargetNode.data.speakBody;
                            const myQuery = { ParentCallSid: ParentCallSid };
                            const customer = await ivrStudiosModelCallBacks_1.default.find(myQuery);
                            // console.log("customer : ",customer)
                            const time = customer[0].subscribeDate;
                            const call_back_with_digits = customer.filter((customer) => {
                                if (customer.source === "gather_response_body_ivr_flow") {
                                    let Digits = customer.Digits;
                                    return Digits;
                                }
                            });
                            const array_of_selected_Digits = call_back_with_digits.map((customer) => {
                                return customer.Digits;
                            });
                            let lastDigits;
                            // console.log("call_back_with_digits.slice(-1)[0] : ",call_back_with_digits.slice(-1)[0])
                            if (call_back_with_digits.slice(-1)[0] === undefined) {
                                lastDigits = "";
                            }
                            if (call_back_with_digits.slice(-1)[0] !== undefined) {
                                lastDigits = call_back_with_digits.slice(-1)[0].Digits;
                            }
                            let removed_sip; //customer number
                            let customer_number_only_10_deigits;
                            if (customer[0].From) {
                                if (customer[0].From.includes("sip:")) {
                                    let removed_ip = customer[0].From.split("@")[0];
                                    removed_sip = removed_ip.split(":")[1];
                                }
                                else {
                                    removed_sip = customer[0].From;
                                    removed_sip = removed_sip.replace(/^0+/, "");
                                    customer_number_only_10_deigits = removed_sip.substr(removed_sip.length - 10);
                                }
                            }
                            const Obj = {
                                "#Caller": removed_sip,
                                "#OnlyTenDigit": customer_number_only_10_deigits,
                                "#Time": time,
                                "#Digits": lastDigits,
                            };
                            const Obj2 = {
                                ...Obj,
                                ...dataBaseVariables,
                            };
                            var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
                            const x = text.replace(RE, function (matched) {
                                //@ts-ignore
                                return Obj2[matched];
                            });
                            // console.log("x : ",x)
                            const y = x
                                .replace(/\[/g, "")
                                .replace(/\]/g, "")
                                .replace(/\#/g, ""); //value of string after replacing [] from the messageBody
                            // console.log("y : ",y)
                            console.log("array_of_selected_Digits : ", array_of_selected_Digits);
                            const nextNode = allNodes.find((node) => node.source === detailsOfTargetNode.id);
                            console.log("SpeakNode");
                            voice.say(y);
                            voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNode.target}/${detailsOfTargetNode.id}`);
                            console.log("xml is : ", voice.toString());
                            return res.send(voice.toString());
                        }
                        if (detailsOfTargetNode.type === "PlayAudioNode") {
                            console.log("PlayNode");
                            const nextNode = allNodes.find((node) => node.source === detailsOfTargetNode.id);
                            // console.log("nextNode : ",nextNode)
                            // console.log("json : ",jsonVariablesFromUrl)
                            if (jsonVariablesFromUrl.length > 0) {
                                for (let i = 0; i < jsonVariablesFromUrl.length; i++) {
                                    if (jsonVariablesFromUrl[i].sourceHandle == "functionSuccess") {
                                        jsonVariablesFromUrl[i].target = nextNode.target;
                                    }
                                }
                                // console.log("modifiedArray : ",jsonVariablesFromUrl)
                            }
                            const stringyfy = encodeURIComponent(JSON.stringify(jsonVariablesFromUrl));
                            // console.log("stringyfy : ",stringyfy)
                            voice.play({ loop: detailsOfTargetNode.data.loop, digits: "wwww3" }, detailsOfTargetNode.data.playAudioUrl);
                            voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/checkValue|${stringyfy}|${variablesFromUrl[2]}/${detailsOfTargetNode.id}`);
                            console.log("xml is : ", voice.toString());
                            return res.send(voice.toString());
                        }
                        if (detailsOfTargetNode.type === "HangUpNode") {
                            console.log("HangUpNode");
                            voice.hangup();
                            console.log("xml is : ", voice.toString());
                            return res.send(voice.toString());
                        }
                        if (detailsOfTargetNode.type === "ivrNode") {
                            const nextNodeToAction = allNodes.filter((node) => {
                                if (node.source == detailsOfTargetNode.id) {
                                    return node;
                                }
                            });
                            if (nextNodeToAction.length > 0) {
                                let ParentGather;
                                let numDigits = detailsOfTargetNode.data.inputLength
                                    ? detailsOfTargetNode.data.inputLength
                                    : "1";
                                ParentGather = voice.gather({
                                    action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${detailsOfTargetNode.id}/${target}`,
                                    method: "POST",
                                    numDigits: numDigits,
                                });
                                ParentGather.play({ loop: detailsOfTargetNode.data.loop }, detailsOfTargetNode.data.ivrAudioUrl);
                                voice.pause({
                                    length: detailsOfTargetNode.data.ivrPlayAudioPause,
                                });
                                console.log("xml is : ", voice.toString());
                                return res.send(voice.toString());
                            }
                            voice.play({ loop: detailsOfTargetNode.data.loop }, detailsOfTargetNode.data.ivrAudioUrl);
                            voice.pause({
                                length: detailsOfTargetNode.data.ivrPlayAudioPause,
                            });
                            console.log("xml is : ", voice.toString());
                            return res.send(voice.toString());
                        }
                    }
                    if (tempVariables.length == 0) {
                        let detailsOfTargetNode = targetOfNodeIfValueOfVariableDoesNotExist[0];
                        // console.log("detailsOfTargetNode 1341 : ",detailsOfTargetNode)
                        if (detailsOfTargetNode.type === "MessageNode") {
                            const customerVariablesDetails = await IvrStudiousRealTime_1.default.findOne({ ParentCallSid: ParentCallSid });
                            let dataBaseVariables = {};
                            if (customerVariablesDetails) {
                                if (customerVariablesDetails.variables) {
                                    // console.log("customerVariablesDetails : ",customerVariablesDetails.variables)
                                    const tempObj = customerVariablesDetails.variables.map((variable) => {
                                        const stringObj = `{"${variable.key}":"${variable.value}"}`;
                                        return JSON.parse(stringObj);
                                    });
                                    // console.log("tempObj : ",tempObj)
                                    const a = tempObj.reduce((acc, obj) => Object.assign(acc, obj), {});
                                    // console.log("a : ",a)
                                    dataBaseVariables = a;
                                }
                            }
                            const value = detailsOfTargetNode.data;
                            // console.log("value : ",value)
                            const myQuery = { ParentCallSid: ParentCallSid };
                            const customer = await ivrStudiosModelCallBacks_1.default.find(myQuery);
                            // console.log("customer : ",customer)
                            const time = customer[0].subscribeDate;
                            const call_back_with_digits = customer.filter((customer) => {
                                if (customer.source === "gather_response_body_ivr_flow") {
                                    let Digits = customer.Digits;
                                    return Digits;
                                }
                            });
                            const array_of_selected_Digits = call_back_with_digits.map((customer) => {
                                return customer.Digits;
                            });
                            let lastDigits;
                            console.log("call_back_with_digits.slice(-1)[0] : ", call_back_with_digits.slice(-1)[0]);
                            if (call_back_with_digits.slice(-1)[0] === undefined) {
                                lastDigits = "";
                            }
                            if (call_back_with_digits.slice(-1)[0] !== undefined) {
                                lastDigits = call_back_with_digits.slice(-1)[0].Digits;
                            }
                            let removed_sip; //customer number
                            let customer_number_only_10_deigits;
                            if (customer[0].From) {
                                if (customer[0].From.includes("sip:")) {
                                    let removed_ip = customer[0].From.split("@")[0];
                                    removed_sip = removed_ip.split(":")[1];
                                }
                                else {
                                    removed_sip = customer[0].From;
                                    removed_sip = removed_sip.replace(/^0+/, "");
                                    customer_number_only_10_deigits = removed_sip.substr(removed_sip.length - 10);
                                }
                            }
                            console.log("array_of_selected_Digits : ", array_of_selected_Digits);
                            // console.log("lastDigits : ",lastDigits)
                            // console.log("time : ",time)
                            // console.log("customer : ", removed_sip)
                            // console.log("value.body : ",value.messageBody)
                            // console.log("customer number 1609 : ", removed_sip , ParentCallSid , customer)
                            if (value.smsTo.toLowerCase() === "specific") {
                                // console.log("value.body : ",value.messageBody)
                                const text = value.messageBody;
                                const Obj = {
                                    "#Caller": removed_sip,
                                    "#OnlyTenDigit": customer_number_only_10_deigits,
                                    "#Time": time,
                                    "#Digits": lastDigits,
                                };
                                const Obj2 = {
                                    ...Obj,
                                    ...dataBaseVariables,
                                };
                                var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
                                const x = text.replace(RE, function (matched) {
                                    //@ts-ignore
                                    return Obj2[matched];
                                });
                                // console.log("x : ",x)
                                const y = x
                                    .replace(/\[/g, "")
                                    .replace(/\]/g, "")
                                    .replace(/\#/g, ""); //value of string after replacing [] from the messageBody
                                if (value.carrierType.toLowerCase() === "domestic") {
                                    Promise.all(value.toNumbers.map(async (to) => {
                                        // console.log("to : ",to.number)
                                        const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                        const json_result = JSON.parse(string_result);
                                        const sms_data = new smsModel_1.default(json_result);
                                        await sms_data.save();
                                    }));
                                }
                                if (value.carrierType.toLowerCase() === "international") {
                                    Promise.all(value.toNumbers.map(async (to) => {
                                        // console.log("to : ",to.number)
                                        const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                        const json_result = JSON.parse(string_result);
                                        const sms_data = new smsModel_1.default(json_result);
                                        await sms_data.save();
                                    }));
                                }
                            }
                            if (value.smsTo.toLowerCase() === "dynamic") {
                                const text = value.messageBody;
                                const Obj = {
                                    "#Caller": removed_sip,
                                    "#OnlyTenDigit": customer_number_only_10_deigits,
                                    "#Time": time,
                                    "#Digits": lastDigits,
                                };
                                const Obj2 = {
                                    ...Obj,
                                    ...dataBaseVariables,
                                };
                                var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
                                const x = text.replace(RE, function (matched) {
                                    //@ts-ignore
                                    return Obj2[matched];
                                });
                                // console.log("x : ",x)
                                const y = x
                                    .replace(/\[/g, "")
                                    .replace(/\]/g, "")
                                    .replace(/\#/g, ""); //value of string after replacing [] from the messageBody
                                // console.log("y : ",y)
                                if (value.carrierType.toLowerCase() === "domestic") {
                                    const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, removed_sip);
                                    const json_result = JSON.parse(string_result);
                                    const sms_data = new smsModel_1.default(json_result);
                                    await sms_data.save();
                                }
                                if (value.carrierType.toLowerCase() === "international") {
                                    const string_result = await this.sendCompletedMessageThree(value.AuthId, value.AuthSecret, value.senderId, value.peId, y, removed_sip);
                                    const json_result = JSON.parse(string_result);
                                    const sms_data = new smsModel_1.default(json_result);
                                    await sms_data.save();
                                }
                            }
                            voice.hangup();
                            console.log("xml is : ", voice.toString());
                            return res.send(voice.toString());
                        }
                        if (detailsOfTargetNode.type === "SpeakNode") {
                            console.log("SpeakNode");
                            const nextNode = allNodes.find((node) => node.source === detailsOfTargetNode.id);
                            voice.say({
                                voice: detailsOfTargetNode.data.speakVoiceType,
                                language: detailsOfTargetNode.data.languageCode,
                            }, detailsOfTargetNode.data.speakBody);
                            voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNode.target}/${detailsOfTargetNode.id}`);
                            console.log("xml is : ", voice.toString());
                            return res.send(voice.toString());
                        }
                        if (detailsOfTargetNode.type === "PlayAudioNode") {
                            console.log("PlayNode");
                            const nextNode = allNodes.find((node) => node.source === detailsOfTargetNode.id);
                            // console.log("nextNode : ",nextNode)
                            // console.log("json : ",jsonVariablesFromUrl)
                            if (jsonVariablesFromUrl.length > 0) {
                                for (let i = 0; i < jsonVariablesFromUrl.length; i++) {
                                    if (jsonVariablesFromUrl[i].sourceHandle == "functionFailed") {
                                        jsonVariablesFromUrl[i].target = nextNode.target;
                                    }
                                }
                                // console.log("modifiedArray : ",jsonVariablesFromUrl)
                            }
                            const stringyfy = encodeURIComponent(JSON.stringify(jsonVariablesFromUrl));
                            console.log("stringyfy 1569 : ", typeof stringyfy, stringyfy);
                            voice.play({ loop: detailsOfTargetNode.data.loop, digits: "wwww3" }, detailsOfTargetNode.data.playAudioUrl);
                            voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/checkValue|${stringyfy}|${variablesFromUrl[2]}/${detailsOfTargetNode.id}`);
                            console.log("xml is : ", voice.toString());
                            return res.send(voice.toString());
                        }
                        if (detailsOfTargetNode.type === "HangUpNode") {
                            console.log("HangUpNode");
                            voice.hangup();
                            return res.send(voice.toString());
                        }
                        if (detailsOfTargetNode.type === "ivrNode") {
                            const nextNodeToAction = allNodes.filter((node) => {
                                if (node.source == detailsOfTargetNode.id) {
                                    return node;
                                }
                            });
                            if (nextNodeToAction.length > 0) {
                                let ParentGather;
                                let numDigits = detailsOfTargetNode.data.inputLength
                                    ? detailsOfTargetNode.data.inputLength
                                    : "1";
                                ParentGather = voice.gather({
                                    action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${detailsOfTargetNode.id}/${target}`,
                                    method: "POST",
                                    numDigits: numDigits,
                                });
                                ParentGather.play({ loop: detailsOfTargetNode.data.loop }, detailsOfTargetNode.data.ivrAudioUrl);
                                voice.pause({
                                    length: detailsOfTargetNode.data.ivrPlayAudioPause,
                                });
                                console.log("xml is : ", voice.toString());
                                return res.send(voice.toString());
                            }
                            voice.play({ loop: detailsOfTargetNode.data.loop }, detailsOfTargetNode.data.ivrAudioUrl);
                            voice.pause({
                                length: detailsOfTargetNode.data.ivrPlayAudioPause,
                            });
                            console.log("xml is : ", voice.toString());
                            return res.send(voice.toString());
                        }
                        if (detailsOfTargetNode.type === "PlayAudioNode") {
                            console.log("PlayNode");
                            const nextNode = allNodes.find((node) => node.source === detailsOfTargetNode.id);
                            // console.log("nextNode : ",nextNode)
                            // console.log("json : ",jsonVariablesFromUrl)
                            if (jsonVariablesFromUrl.length > 0) {
                                for (let i = 0; i < jsonVariablesFromUrl.length; i++) {
                                    if (jsonVariablesFromUrl[i].sourceHandle == "functionFailed") {
                                        jsonVariablesFromUrl[i].target = nextNode.target;
                                    }
                                }
                                // console.log("modifiedArray : ",jsonVariablesFromUrl)
                            }
                            const stringyfy = JSON.stringify(jsonVariablesFromUrl);
                            // console.log("stringyfy : ",stringyfy)
                            voice.play({ loop: detailsOfTargetNode.data.loop, digits: "wwww3" }, detailsOfTargetNode.data.playAudioUrl);
                            voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/checkValue|${stringyfy}|${variablesFromUrl[2]}/${detailsOfTargetNode.id}`);
                            console.log("xml is : ", voice.toString());
                            return res.send(voice.toString());
                        }
                        if (detailsOfTargetNode.type === "HangUpNode") {
                            console.log("HangUpNode");
                            voice.hangup();
                            return res.send(voice.toString());
                        }
                        if (detailsOfTargetNode.type === "ivrNode") {
                            const nextNodeToAction = allNodes.filter((node) => {
                                if (node.source == detailsOfTargetNode.id) {
                                    return node;
                                }
                            });
                            if (nextNodeToAction.length > 0) {
                                let ParentGather;
                                let numDigits = detailsOfTargetNode.data.inputLength
                                    ? detailsOfTargetNode.data.inputLength
                                    : "1";
                                ParentGather = voice.gather({
                                    action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${detailsOfTargetNode.id}/${target}`,
                                    method: "POST",
                                    numDigits: numDigits,
                                });
                                ParentGather.play({ loop: detailsOfTargetNode.data.loop }, detailsOfTargetNode.data.ivrAudioUrl);
                                voice.pause({
                                    length: detailsOfTargetNode.data.ivrPlayAudioPause,
                                });
                                console.log("xml is : ", voice.toString());
                                return res.send(voice.toString());
                            }
                            voice.play({ loop: detailsOfTargetNode.data.loop }, detailsOfTargetNode.data.ivrAudioUrl);
                            voice.pause({
                                length: detailsOfTargetNode.data.ivrPlayAudioPause,
                            });
                            console.log("xml is : ", voice.toString());
                            return res.send(voice.toString());
                        }
                        if (detailsOfTargetNode.type === "PlayAudioNode") {
                            console.log("PlayNode");
                            const nextNode = allNodes.find((node) => node.source === detailsOfTargetNode.id);
                            // console.log("nextNode : ",nextNode)
                            // console.log("json : ",jsonVariablesFromUrl)
                            if (jsonVariablesFromUrl.length > 0) {
                                for (let i = 0; i < jsonVariablesFromUrl.length; i++) {
                                    if (jsonVariablesFromUrl[i].sourceHandle == "functionFailed") {
                                        jsonVariablesFromUrl[i].target = nextNode.target;
                                    }
                                }
                                // console.log("modifiedArray : ",jsonVariablesFromUrl)
                            }
                            const stringyfy = JSON.stringify(jsonVariablesFromUrl);
                            // console.log("stringyfy : ",stringyfy)
                            voice.play({ loop: detailsOfTargetNode.data.loop }, detailsOfTargetNode.data.playAudioUrl);
                            voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/checkValue|${stringyfy}|${variablesFromUrl[2]}/${detailsOfTargetNode.id}`);
                            return res.send(voice.toString());
                        }
                        if (detailsOfTargetNode.type === "HangUpNode") {
                            console.log("HangUpNode");
                            voice.hangup();
                            return res.send(voice.toString());
                        }
                    }
                    return res.send(defaultVri.toString());
                }
                if (target === "hangup" || targetNode.type == "HangUpNode") {
                    voice.hangup();
                    console.log("xml is : ", voice.toString());
                    return res.send(voice.toString());
                }
                // console.log("targetNode : ",targetNode)
                //latest code after function
                let singleTargetEvenIfWeDoNotHaveDigits = targetNode;
                if (targetNode.type === "VoiceMailNode") {
                    const nextNodeToAction = allNodes.filter((node) => {
                        if (node.source == targetNode.id) {
                            return node;
                        }
                    });
                    let detailsFromVibconnect = req.query ? req.query : req.body;
                    const xml = await this.handleGenerateRecordXml(targetNode, detailsFromVibconnect, id, nextNodeToAction[0].target);
                    console.log("xml is : ", xml);
                    return res.send(xml);
                }
                if (targetNode.type === "PlayAudioNode") {
                    const nextNodeToAction = allNodes.find((node) => {
                        if (node.source == targetNode.id) {
                            return node;
                        }
                    });
                    const nextNode_for_action_id_data = nextNodeToAction.target;
                    const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(id, targetNode.id, nextNode_for_action_id_data, targetNode.data);
                    return res.send(xmlFromHelper);
                }
                if (targetNode.type === "ivrNode") {
                    const targetNode = allNodes.map((node) => {
                        if (node.source == target && node.sourceHandle === Digits) {
                            return node;
                        }
                    });
                    const filterTargetNode = targetNode.filter((node) => {
                        return node != null;
                    });
                    // console.log("targetNode if ivr : ", filterTargetNode)
                    //latest changes after function
                    let detailsOfTargetNode;
                    if (filterTargetNode.length > 0) {
                        detailsOfTargetNode = allNodes.find((node) => node.id === filterTargetNode[0].target);
                    }
                    else {
                        detailsOfTargetNode = singleTargetEvenIfWeDoNotHaveDigits;
                    }
                    //previous code before function
                    // const detailsOfTargetNode = allNodes.find((node : any) => node.id === filterTargetNode[0].target)
                    console.log("detailsOfTargetNode 2055 : ", detailsOfTargetNode);
                    const connectors = allNodes.filter((item) => {
                        if (item.type == "buttonedge") {
                            return item;
                        }
                    });
                    const filteredNextNodeData = this.findTargetsFromSource(allNodes, detailsOfTargetNode.id);
                    if (detailsOfTargetNode.type === "BusinessHourNode") {
                        let nodeDetails = detailsOfTargetNode.data;
                        console.log("nodeDetails : ", nodeDetails);
                        console.log("filteredNextNodeData : ", filteredNextNodeData);
                        if (filteredNextNodeData.length > 0) {
                            if (nodeDetails.bHourOption == "anytime") {
                                voice.hangup();
                                console.log("xml is : ", voice.toString());
                                return res.send(voice.toString());
                            }
                            else {
                                for (let i = 0; i < detailsOfTargetNode.data.bHourDays.length; i++) {
                                    if (nodeDetails.bHourDays[i].isWorking === true) {
                                        const currentTime = new Date();
                                        const currentDay = this.getNameOfDay(currentTime.getDay());
                                        // console.log("currentDay : ",currentDay , nodeDetails.bHourDays[i].day )
                                        if (currentDay.toLowerCase() ==
                                            nodeDetails.bHourDays[i].day.toLowerCase()) {
                                            const now = (0, moment_1.default)()
                                                .add(5, "hours")
                                                .add(30, "minutes")
                                                .format(); // in local it is fine but in live it is giving actual time so dont need to add hours
                                            //const now = moment().format()
                                            const tempStartEndObj = await this.getStartAndEndTimeFromMultipleTimeInSingleDay(nodeDetails.bHourDays[i], now);
                                            console.log("tempStartEndObj : ", tempStartEndObj);
                                            let { startTime, endTime } = tempStartEndObj;
                                            const start = startTime;
                                            const end = endTime;
                                            let bussinessHourNodeId = detailsOfTargetNode.id;
                                            // console.log("bussinessHourNodeId : ",bussinessHourNodeId)
                                            if ((0, moment_1.default)(now).isBetween(start, end)) {
                                                console.log("is between  now : ", now, "start : ", start, "end : ", end);
                                                // console.log("connectors : ", connectors)
                                                const nextNodeConnectedToBussinessHourNodeOn = connectors.filter((item) => {
                                                    if (item.source === bussinessHourNodeId &&
                                                        item.sourceHandle == "businesshourOn") {
                                                        return item;
                                                    }
                                                });
                                                console.log("nextNodeConnectedToBussinessHourNode : ", nextNodeConnectedToBussinessHourNodeOn);
                                                const nextNodeIfSuccess = data.input?.filter((item) => {
                                                    if (item.id ===
                                                        nextNodeConnectedToBussinessHourNodeOn[0].target) {
                                                        return item;
                                                    }
                                                });
                                                console.log("nextNodeIfSuccess : ", nextNodeIfSuccess);
                                                if (nextNodeIfSuccess.length > 0) {
                                                    console.log("next node if not succes 17742 ", nextNodeIfSuccess[0]);
                                                    if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                        const xml = (0, callXmlGenerator_1.generateXmlForIvrNode)(id, nextNodeIfSuccess[0].id, target, nextNodeIfSuccess[0].data);
                                                        return res.send(xml);
                                                    }
                                                    if (nextNodeIfSuccess[0].type === "PlayAudioNode") {
                                                        const nextNode_for_action = connectors.find((item) => {
                                                            if (item.source === nextNodeIfSuccess[0].id) {
                                                                return item;
                                                            }
                                                        });
                                                        const nextNode_for_action_id_data = nextNode_for_action.target;
                                                        const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(id, nextNodeIfSuccess[0].id, nextNode_for_action_id_data, nextNodeIfSuccess[0].data);
                                                        return res.send(xmlFromHelper);
                                                    }
                                                    if (nextNodeIfSuccess[0].type === "MessageNode") {
                                                        let makePlayXml = false;
                                                        let playNodeDetails;
                                                        let playNodeId;
                                                        if (nextNodeConnectedToBussinessHourNodeOn.length ===
                                                            1) {
                                                            const dataFromVibconnect = req.query;
                                                            const xml = await (0, callXmlGenerator_1.generateXmlForMessage)(nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                            return res.send(xml);
                                                        }
                                                        if (nextNodeConnectedToBussinessHourNodeOn.length > 1) {
                                                            console.log("Try to search play node it will be there.");
                                                            for (let i = 0; i <
                                                                nextNodeConnectedToBussinessHourNodeOn.length; i++) {
                                                                const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                                    nextNodeConnectedToBussinessHourNodeOn[i]
                                                                        .target);
                                                                if (detailsOfTargetNode.type == "MessageNode") {
                                                                    const dataFromVibconnect = req.query;
                                                                    //not making it async await because it is making API response slow and we dont need to send message first then play
                                                                    (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                                                }
                                                                if (detailsOfTargetNode.type == "PlayAudioNode") {
                                                                    makePlayXml = true;
                                                                    playNodeDetails = detailsOfTargetNode.data;
                                                                    playNodeId = detailsOfTargetNode.id;
                                                                }
                                                            }
                                                        }
                                                        if (makePlayXml) {
                                                            const nextNode_for_action = connectors.find((item) => {
                                                                if (item.source === playNodeId) {
                                                                    return item;
                                                                }
                                                            });
                                                            const nextNode_for_action_id_data = nextNode_for_action.target;
                                                            const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                                                            return res.send(xmlFromHelper);
                                                        }
                                                    }
                                                    if (nextNodeIfSuccess[0].type === "MultiPartyCallNode") {
                                                        const dataFromVibconnect = req.query;
                                                        const xml = await (0, callXmlGenerator_1.generateXmlForMultiPartyCallNode)(id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                        return res.send(xml);
                                                    }
                                                }
                                            }
                                            else {
                                                const nextNodeConnectedToBussinessHourNodeOff = connectors.filter((item) => {
                                                    if (item.source === bussinessHourNodeId &&
                                                        item.sourceHandle == "businesshourOff") {
                                                        return item;
                                                    }
                                                });
                                                console.log("is not between now : ", now, "start : ", start, "end : ", end);
                                                const nextNodeIfSuccess = data.input?.filter((item) => {
                                                    if (item.id ===
                                                        nextNodeConnectedToBussinessHourNodeOff[0].target) {
                                                        return item;
                                                    }
                                                });
                                                console.log("nextNodeIfSuccess : ", nextNodeIfSuccess);
                                                if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                    const xml = (0, callXmlGenerator_1.generateXmlForIvrNode)(id, nextNodeIfSuccess[0].id, target, nextNodeIfSuccess[0].data);
                                                    return res.send(xml);
                                                }
                                                if (nextNodeIfSuccess[0].type === "PlayAudioNode") {
                                                    let makePlayXml = false;
                                                    let playNodeDetails;
                                                    let playNodeId;
                                                    if (nextNodeConnectedToBussinessHourNodeOff.length === 1) {
                                                        const nextNode_for_action = connectors.find((item) => {
                                                            if (item.source === nextNodeIfSuccess[0].id) {
                                                                return item;
                                                            }
                                                        });
                                                        const nextNode_for_action_id_data = nextNode_for_action.target;
                                                        const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(id, nextNodeIfSuccess[0].id, nextNode_for_action_id_data, nextNodeIfSuccess[0].data);
                                                        return res.send(xmlFromHelper);
                                                    }
                                                    if (nextNodeConnectedToBussinessHourNodeOff.length > 1) {
                                                        console.log("Try to search play node it will be there.");
                                                        for (let i = 0; i <
                                                            nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                            const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                                nextNodeConnectedToBussinessHourNodeOff[i]
                                                                    .target);
                                                            if (detailsOfTargetNode.type == "MessageNode") {
                                                                const dataFromVibconnect = req.query;
                                                                //not making it async await because it is making API response slow and we dont need to send message first then play
                                                                (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                                            }
                                                            if (detailsOfTargetNode.type == "PlayAudioNode") {
                                                                makePlayXml = true;
                                                                playNodeDetails = detailsOfTargetNode.data;
                                                                playNodeId = detailsOfTargetNode.id;
                                                            }
                                                        }
                                                    }
                                                    if (makePlayXml) {
                                                        const nextNode_for_action = connectors.find((item) => {
                                                            if (item.source === playNodeId) {
                                                                return item;
                                                            }
                                                        });
                                                        const nextNode_for_action_id_data = nextNode_for_action.target;
                                                        const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                                                        return res.send(xmlFromHelper);
                                                    }
                                                }
                                                if (nextNodeIfSuccess[0].type === "MultiPartyCallNode") {
                                                    const dataFromVibconnect = req.body
                                                        ? req.body
                                                        : req.query;
                                                    const xml = await (0, callXmlGenerator_1.generateXmlForMultiPartyCallNode)(id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].id, nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                    return res.send(xml);
                                                }
                                                if (nextNodeIfSuccess[0].type === "MessageNode") {
                                                    let makePlayXml = false;
                                                    let playNodeDetails;
                                                    let playNodeId;
                                                    if (nextNodeConnectedToBussinessHourNodeOff.length === 1) {
                                                        const dataFromVibconnect = req.query;
                                                        const xml = await (0, callXmlGenerator_1.generateXmlForMessage)(nextNodeIfSuccess[0].data, dataFromVibconnect);
                                                        return res.send(xml);
                                                    }
                                                    if (nextNodeConnectedToBussinessHourNodeOff.length > 1) {
                                                        console.log("Try to search play node it will be there.");
                                                        for (let i = 0; i <
                                                            nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                            const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                                nextNodeConnectedToBussinessHourNodeOff[i]
                                                                    .target);
                                                            if (detailsOfTargetNode.type == "MessageNode") {
                                                                const dataFromVibconnect = req.query;
                                                                //not making it async await because it is making API response slow and we dont need to send message first then play
                                                                (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                                            }
                                                            if (detailsOfTargetNode.type == "PlayAudioNode") {
                                                                makePlayXml = true;
                                                                playNodeDetails = detailsOfTargetNode.data;
                                                                playNodeId = detailsOfTargetNode.id;
                                                            }
                                                        }
                                                    }
                                                    if (makePlayXml) {
                                                        const nextNode_for_action = connectors.find((item) => {
                                                            if (item.source === playNodeId) {
                                                                return item;
                                                            }
                                                        });
                                                        const nextNode_for_action_id_data = nextNode_for_action.target;
                                                        const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                                                        return res.send(xmlFromHelper);
                                                    }
                                                }
                                                if (nextNodeIfSuccess[0].type === "BusinessHourNode") {
                                                    let nodeDetails = nextNodeIfSuccess[0].data;
                                                    console.log("nodeDetails : ", nodeDetails);
                                                    if (nextNodeIfSuccess.length > 0) {
                                                        if (nodeDetails.bHourOption == "anytime") {
                                                            let bussinessHourNodeId = nodeDetails.id;
                                                            const nextNodeConnectedToBussinessHourNodeOn = connectors.filter((item) => {
                                                                if (item.source === bussinessHourNodeId &&
                                                                    item.sourceHandle == "businesshourOn") {
                                                                    return item;
                                                                }
                                                            });
                                                            const nextNodeIfSuccess = data.input?.filter((item) => {
                                                                if (item.id ===
                                                                    nextNodeConnectedToBussinessHourNodeOn[0]
                                                                        .target) {
                                                                    return item;
                                                                }
                                                            });
                                                            if (nextNodeIfSuccess.length > 0) {
                                                                console.log("next node if succes ", nextNodeIfSuccess[0]);
                                                                if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                                    const newRealTime = new IvrStudiousRealTime_1.default({
                                                                        ...req.query,
                                                                        source: "Web",
                                                                    });
                                                                    await newRealTime.save();
                                                                    let Parent;
                                                                    let numDigits = nextNodeIfSuccess[0].data
                                                                        .inputLength
                                                                        ? nextNodeIfSuccess[0].data.inputLength
                                                                        : "1";
                                                                    Parent = voice.gather({
                                                                        action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNodeIfSuccess[0].id}/${target}`,
                                                                        method: "POST",
                                                                        numDigits: numDigits,
                                                                    });
                                                                    if (nextNodeIfSuccess[0].data.ivrAudioUrl) {
                                                                        Parent.play({ loop: nextNodeIfSuccess[0].data.loop }, nextNodeIfSuccess[0].data.ivrAudioUrl);
                                                                        voice.pause({
                                                                            length: nextNodeIfSuccess[0].data
                                                                                .ivrPlayAudioPause,
                                                                        });
                                                                    }
                                                                    return res.send(voice.toString());
                                                                }
                                                                if (nextNodeIfSuccess[0].type === "PlayAudioNode") {
                                                                    const newRealTime = new IvrStudiousRealTime_1.default({
                                                                        ...req.query,
                                                                        source: "Web",
                                                                    });
                                                                    await newRealTime.save();
                                                                    // const nextNode_for_action = connectors.filter((item : any)=>{
                                                                    //     if(item.source === nextNodeIfSuccess[0].id){
                                                                    //         return item
                                                                    //     }
                                                                    // })
                                                                    const nextNode_for_action_id = connectors.filter((item) => {
                                                                        if (item.source === nextNodeIfSuccess[0].id) {
                                                                            return item;
                                                                        }
                                                                    });
                                                                    const nextNode_for_action_id_data = nextNode_for_action_id[0].target;
                                                                    // console.log("nextNode_for_action : ",nextNode_for_action_id_data)
                                                                    voice.play({
                                                                        loop: nextNodeIfSuccess[0].data.loop,
                                                                        digits: "wwww3",
                                                                    }, nextNodeIfSuccess[0].data.audioUrl);
                                                                    voice.pause({
                                                                        length: nextNodeIfSuccess[0].data.playAudioPause,
                                                                    });
                                                                    voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNode_for_action_id_data}/${target}`);
                                                                    return res.send(voice.toString());
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            for (let i = 0; i < nextNodeIfSuccess[0].data.bHourDays.length; i++) {
                                                                if (nodeDetails.bHourDays[i].isWorking === true) {
                                                                    const currentTime = new Date();
                                                                    const currentDay = this.getNameOfDay(currentTime.getDay());
                                                                    console.log("currentDay : ", currentDay, nodeDetails.bHourDays[i].day);
                                                                    if (currentDay.toLowerCase() ==
                                                                        nodeDetails.bHourDays[i].day.toLowerCase()) {
                                                                        console.log("nodeDetails.bHourDays[i] : ", nodeDetails.bHourDays[i]);
                                                                        const now = (0, moment_1.default)()
                                                                            .add(5, "hours")
                                                                            .add(30, "minutes")
                                                                            .format(); // in local it is fine but in live it is giving actual time so dont need to add hours
                                                                        //const now = moment().format()
                                                                        const tempStartEndObj = await this.getStartAndEndTimeFromMultipleTimeInSingleDay(nodeDetails.bHourDays[i], now);
                                                                        console.log("tempStartEndObj : ", tempStartEndObj);
                                                                        let { startTime, endTime } = tempStartEndObj;
                                                                        const start = startTime;
                                                                        const end = endTime;
                                                                        let bussinessHourNodeId = nextNodeIfSuccess[0].id;
                                                                        // console.log("bussinessHourNodeId : ",bussinessHourNodeId)
                                                                        if ((0, moment_1.default)(now).isBetween(start, end)) {
                                                                            console.log("is between  now : ", now, "start : ", start, "end : ", end);
                                                                            // console.log("connectors : ", connectors)
                                                                            const nextNodeConnectedToBussinessHourNodeOn = connectors.filter((item) => {
                                                                                if (item.source ===
                                                                                    bussinessHourNodeId &&
                                                                                    item.sourceHandle ==
                                                                                        "businesshourOn") {
                                                                                    return item;
                                                                                }
                                                                            });
                                                                            console.log("nextNodeConnectedToBussinessHourNode : ", nextNodeConnectedToBussinessHourNodeOn);
                                                                            const nextNodeIfSuccess = data.input?.filter((item) => {
                                                                                if (item.id ===
                                                                                    nextNodeConnectedToBussinessHourNodeOn[0]
                                                                                        .target) {
                                                                                    return item;
                                                                                }
                                                                            });
                                                                            console.log("nextNodeIfSuccess : ", nextNodeIfSuccess);
                                                                            if (nextNodeIfSuccess.length > 0) {
                                                                                console.log("next node if not succes 4254 ", nextNodeIfSuccess[0]);
                                                                                if (nextNodeIfSuccess[0].type ===
                                                                                    "ivrNode") {
                                                                                    const newRealTime = new IvrStudiousRealTime_1.default({
                                                                                        ...req.query,
                                                                                        source: "Web",
                                                                                    });
                                                                                    await newRealTime.save();
                                                                                    let numDigits = nextNodeIfSuccess[0]
                                                                                        .data.inputLength
                                                                                        ? nextNodeIfSuccess[0].data
                                                                                            .inputLength
                                                                                        : "1";
                                                                                    let Parent;
                                                                                    Parent = voice.gather({
                                                                                        action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNodeIfSuccess[0].id}/${target}`,
                                                                                        method: "POST",
                                                                                        numDigits: numDigits,
                                                                                    });
                                                                                    if (nextNodeIfSuccess[0].data
                                                                                        .ivrAudioUrl) {
                                                                                        Parent.play({
                                                                                            loop: nextNodeIfSuccess[0].data
                                                                                                .loop,
                                                                                        }, nextNodeIfSuccess[0].data
                                                                                            .ivrAudioUrl);
                                                                                        voice.pause({
                                                                                            length: nextNodeIfSuccess[0].data
                                                                                                .ivrPlayAudioPause,
                                                                                        });
                                                                                    }
                                                                                    return res.send(voice.toString());
                                                                                }
                                                                                if (nextNodeIfSuccess[0].type ===
                                                                                    "MultiPartyCallNode") {
                                                                                    const targetNode = nextNodeIfSuccess[0];
                                                                                    if (targetNode.data
                                                                                        .mpcCallDistribustion ===
                                                                                        "RoundRobin") {
                                                                                        console.log("write the logic of round robin here ");
                                                                                        let dataFromVibconnect = JSON.stringify(req.body) !== "{}"
                                                                                            ? req.body
                                                                                            : req.query;
                                                                                        const xml = await this.handleMultiPartyCallDistributionOfTypeRoundRobin(targetNode, dataFromVibconnect, id);
                                                                                        console.log("xml is : 5138 ", xml);
                                                                                        return res.send(xml);
                                                                                    }
                                                                                    if (targetNode.data
                                                                                        .mpcCallDistribustion ===
                                                                                        "Parallel") {
                                                                                        let dataFromVibconnect = JSON.stringify(req.body) !== "{}"
                                                                                            ? req.body
                                                                                            : req.query;
                                                                                        const xml = await this.handleMultiPartyCallDistributionProcess(targetNode, dataFromVibconnect, id);
                                                                                        console.log("xml is 4943 : ", xml);
                                                                                        return res.send(xml);
                                                                                    }
                                                                                    else {
                                                                                        // console.log("detailsOfTargetNode if conference : ",detailsOfTargetNode)
                                                                                        // if(nextNodeIfSuccess[0].data.url){
                                                                                        //     console.log("whispher url is : ", nextNodeIfSuccess[0].data.url)
                                                                                        //     let whispherUrl = nextNodeIfSuccess[0].data.url
                                                                                        //     let Parent : any
                                                                                        //     voice.play(whispherUrl)
                                                                                        //     Parent = voice.dial({"action": `${conf.BaseUrl}/api/ivrstudios/convert/${id}/conference|Room_${req.body.ParentCallSid}/${nextNodeIfSuccess[0].id}` , "method" : "GET" } )
                                                                                        //     Parent.conference({waitUrl : nextNodeIfSuccess[0].data.mpcAudio , statusCallback :`${conf.BaseUrl}/api/webhook/vibconnect/conference` , statusCallbackEvent : 'start end join leave mute hold' },`Room_${req.body.ParentCallSid}`)
                                                                                        // }else{
                                                                                        //     let Parent : any
                                                                                        //     Parent = voice.dial({"action": `${conf.BaseUrl}/api/ivrstudios/convert/${id}/conference|Room_${req.body.ParentCallSid}/${nextNodeIfSuccess[0].id}` , "method" : "GET" } )
                                                                                        //     Parent.conference({waitUrl : nextNodeIfSuccess[0].data.mpcAudio , statusCallback :`${conf.BaseUrl}/api/webhook/vibconnect/conference` , statusCallbackEvent : 'start end join leave mute hold' },`Room_${req.body.ParentCallSid}`)
                                                                                        // }
                                                                                        let Parent;
                                                                                        Parent = voice.dial({
                                                                                            action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/conference|Room_${req.body.ParentCallSid}/${nextNodeIfSuccess[0].id}`,
                                                                                            method: "GET",
                                                                                        });
                                                                                        Parent.conference({
                                                                                            waitUrl: nextNodeIfSuccess[0].data
                                                                                                .mpcAudio,
                                                                                            statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
                                                                                            statusCallbackEvent: "start end join leave mute hold",
                                                                                        }, `Room_${req.body.ParentCallSid}`);
                                                                                        let url = "empty";
                                                                                        if (nextNodeIfSuccess[0].data.url) {
                                                                                            let fullUrl = nextNodeIfSuccess[0].data.url;
                                                                                            // let removedHttpsUrl = fullUrl.replace("https://vibtreedan.s3.amazonaws.com/public/","")
                                                                                            let removedHttpsUrl = fullUrl.split("public/");
                                                                                            url = removedHttpsUrl[1];
                                                                                        }
                                                                                        let timeOut = "60";
                                                                                        if (nextNodeIfSuccess[0].data
                                                                                            .mpcCallUsingNumbers[0]) {
                                                                                            timeOut =
                                                                                                nextNodeIfSuccess[0].data
                                                                                                    .mpcCallUsingNumbers[0]
                                                                                                    .ringTimeOut;
                                                                                        }
                                                                                        let correctNumberArray;
                                                                                        if (nextNodeIfSuccess[0].data
                                                                                            .mpcCallUsing === "User") {
                                                                                            console.log("this is not number this is user typ calling system");
                                                                                            let detailsOfNumbersFromUI = nextNodeIfSuccess[0].data
                                                                                                .mpcCallUsingNumbers;
                                                                                            const numbersFromUerID = await this.extractAllNumberOfCorrespondingUser(detailsOfNumbersFromUI);
                                                                                            console.log("List of numbers from user : ", numbersFromUerID);
                                                                                            correctNumberArray =
                                                                                                numbersFromUerID;
                                                                                        }
                                                                                        if (nextNodeIfSuccess[0].data
                                                                                            .mpcCallUsing === "Number") {
                                                                                            correctNumberArray =
                                                                                                nextNodeIfSuccess[0].data
                                                                                                    .mpcCallUsingNumbers;
                                                                                        }
                                                                                        //For Testing only
                                                                                        // Parent.conference({waitUrl : nextNodeIfSuccess[0].data.mpcAudio , statusCallback :'https://dataneuronbackend.herokuapp.com/subscribers' , statusCallbackEvent : 'start end join leave mute hold' },`Room_${req.body.ParentCallSid}`)
                                                                                        const body = {
                                                                                            statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call`,
                                                                                            // "statusCallback":`https://dataneuronbackend.herokuapp.com/subscribers`, //For testing Only
                                                                                            statusCallbackEvent: "initiated, ringing, answered, completed",
                                                                                            Record: "true",
                                                                                            // "To": nextNodeIfSuccess[0].data.mpcCallUsingNumbers[0].number,
                                                                                            To: correctNumberArray[0].number,
                                                                                            From: req.body.To,
                                                                                            Timeout: timeOut,
                                                                                            Method: "GET",
                                                                                            // "Url" : `${conf.BaseUrl}/api/getConferenceRoom/Room_${req.body.ParentCallSid}/${url}`
                                                                                            Url: `${conf.BaseUrl}/api/checkIfCustomerInLine/Room_${req.body.ParentCallSid}/${url}`,
                                                                                            recordingStatusCallback: `${conf.BaseUrl}/api//vibconnect/webhook/recordings`,
                                                                                            recordingStatusCallbackEvent: "in-progress, completed, absent",
                                                                                            recordingStatusCallbackMethod: "POST",
                                                                                            record: "true",
                                                                                        };
                                                                                        console.log("node credentials : ", nextNodeIfSuccess[0].data.authId, " : ", nextNodeIfSuccess[0].data
                                                                                            .authSecret);
                                                                                        const call_details = await this.MakeConferenceCall(nextNodeIfSuccess[0].data
                                                                                            .authId, nextNodeIfSuccess[0].data
                                                                                            .authSecret, body);
                                                                                        const call_details_json = JSON.parse(call_details);
                                                                                        const data_required_to_filter_conference_details = {
                                                                                            AccountSid: req.body.AccountSid,
                                                                                            ParentCallSid: req.body.ParentCallSid,
                                                                                            ConferenceId: "",
                                                                                            CallSid: call_details_json.sid,
                                                                                            FriendlyName: `Room_${req.body.ParentCallSid}`,
                                                                                            ChildCallSid: call_details_json.sid,
                                                                                            source: nextNodeIfSuccess[0].id,
                                                                                            id: id,
                                                                                            listOfChildCallSid: [
                                                                                                call_details_json.sid,
                                                                                            ],
                                                                                            whispherUrl: url,
                                                                                        };
                                                                                        console.log("data_required_to_filter_conference_details 3290 : ", data_required_to_filter_conference_details);
                                                                                        const conference = new ConferenceModel_1.default(data_required_to_filter_conference_details);
                                                                                        await conference.save();
                                                                                        let queryToSend = {
                                                                                            ParentCallSid: req.body.ParentCallSid,
                                                                                        };
                                                                                        let updateToSend = {
                                                                                            $set: {
                                                                                                CallSidOfConferenceChildCall: call_details_json.sid,
                                                                                            },
                                                                                        };
                                                                                        this.updateRealTimeDataOfIvrStudiousForApiCall(queryToSend, updateToSend);
                                                                                        console.log("xml is : ", voice.toString());
                                                                                        return res.send(voice.toString());
                                                                                    }
                                                                                }
                                                                                if (nextNodeIfSuccess[0].type ===
                                                                                    "PlayAudioNode") {
                                                                                    const newRealTime = new IvrStudiousRealTime_1.default({
                                                                                        ...req.query,
                                                                                        source: "Web",
                                                                                    });
                                                                                    await newRealTime.save();
                                                                                    // const nextNode_for_action = connectors.filter((item : any)=>{
                                                                                    //     if(item.source === nextNodeIfSuccess[0].id){
                                                                                    //         return item
                                                                                    //     }
                                                                                    // })
                                                                                    const nextNode_for_action_id = connectors.filter((item) => {
                                                                                        if (item.source ===
                                                                                            nextNodeIfSuccess[0].id) {
                                                                                            return item;
                                                                                        }
                                                                                    });
                                                                                    const nextNode_for_action_id_data = nextNode_for_action_id[0].target;
                                                                                    // console.log("nextNode_for_action : ",nextNode_for_action_id_data)
                                                                                    voice.play({
                                                                                        loop: nextNodeIfSuccess[0].data
                                                                                            .loop,
                                                                                        digits: "wwww3",
                                                                                    }, nextNodeIfSuccess[0].data.audioUrl);
                                                                                    voice.pause({
                                                                                        length: nextNodeIfSuccess[0].data
                                                                                            .playAudioPause,
                                                                                    });
                                                                                    voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNode_for_action_id_data}/${target}`);
                                                                                    return res.send(voice.toString());
                                                                                }
                                                                                if (nextNodeIfSuccess[0].type ===
                                                                                    "MessageNode") {
                                                                                    console.log("nextNodeIfSuccess[0].data.message : ", nextNodeIfSuccess[0]);
                                                                                    let targetNode = nextNodeIfSuccess[0];
                                                                                    let ParentCallSid;
                                                                                    if (req.body.ParentCallSid) {
                                                                                        ParentCallSid =
                                                                                            req.body.ParentCallSid;
                                                                                    }
                                                                                    else {
                                                                                        ParentCallSid =
                                                                                            req.query.ParentCallSid;
                                                                                    }
                                                                                    const customerVariablesDetails = await IvrStudiousRealTime_1.default.findOne({
                                                                                        ParentCallSid: ParentCallSid,
                                                                                    });
                                                                                    let dataBaseVariables = {};
                                                                                    if (customerVariablesDetails) {
                                                                                        // console.log("customerVariablesDetails : ",customerVariablesDetails.variables)
                                                                                        const tempObj = customerVariablesDetails.variables.map((variable) => {
                                                                                            const stringObj = `{"${variable.key}":"${variable.value}"}`;
                                                                                            return JSON.parse(stringObj);
                                                                                        });
                                                                                        // console.log("tempObj : ",tempObj)
                                                                                        const a = tempObj.reduce((acc, obj) => Object.assign(acc, obj), {});
                                                                                        // console.log("a : ",a)
                                                                                        dataBaseVariables = a;
                                                                                    }
                                                                                    const value = targetNode.data;
                                                                                    // console.log("value : ",value)
                                                                                    const myQuery = {
                                                                                        ParentCallSid: ParentCallSid,
                                                                                    };
                                                                                    const customer = await ivrStudiosModelCallBacks_1.default.find(myQuery);
                                                                                    // console.log("customer : ",customer)
                                                                                    const time = customer[0].subscribeDate;
                                                                                    const call_back_with_digits = customer.filter((customer) => {
                                                                                        if (customer.source ===
                                                                                            "gather_response_body_ivr_flow") {
                                                                                            let Digits = customer.Digits;
                                                                                            return Digits;
                                                                                        }
                                                                                    });
                                                                                    const array_of_selected_Digits = call_back_with_digits.map((customer) => {
                                                                                        return customer.Digits;
                                                                                    });
                                                                                    let lastDigits;
                                                                                    // console.log("call_back_with_digits.slice(-1)[0] : ",call_back_with_digits.slice(-1)[0])
                                                                                    if (call_back_with_digits.slice(-1)[0] === undefined) {
                                                                                        lastDigits = "";
                                                                                    }
                                                                                    if (call_back_with_digits.slice(-1)[0] !== undefined) {
                                                                                        lastDigits =
                                                                                            call_back_with_digits.slice(-1)[0]
                                                                                                .Digits;
                                                                                    }
                                                                                    let removed_sip; //customer number
                                                                                    let customer_number_only_10_deigits;
                                                                                    if (customer[0].From) {
                                                                                        if (customer[0].From.includes("sip:")) {
                                                                                            let removed_ip = customer[0].From.split("@")[0];
                                                                                            removed_sip =
                                                                                                removed_ip.split(":")[1];
                                                                                        }
                                                                                        else {
                                                                                            removed_sip = customer[0].From;
                                                                                            removed_sip = removed_sip.replace(/^0+/, "");
                                                                                            customer_number_only_10_deigits =
                                                                                                removed_sip.substr(removed_sip.length - 10);
                                                                                        }
                                                                                    }
                                                                                    console.log("array_of_selected_Digits : ", array_of_selected_Digits);
                                                                                    // console.log("lastDigits : ",lastDigits)
                                                                                    // console.log("time : ",time)
                                                                                    // console.log("customer : ", removed_sip)
                                                                                    // console.log("value.body : ",value.messageBody)
                                                                                    // console.log("customer number 1904 : ", removed_sip , ParentCallSid, customer)
                                                                                    if (value.smsTo.toLowerCase() ===
                                                                                        "specific") {
                                                                                        // console.log("value.body : ",value.messageBody)
                                                                                        const text = value.messageBody;
                                                                                        const Obj = {
                                                                                            "#Caller": removed_sip,
                                                                                            "#OnlyTenDigit": customer_number_only_10_deigits,
                                                                                            "#Time": time,
                                                                                            "#Digits": lastDigits,
                                                                                        };
                                                                                        const Obj2 = {
                                                                                            ...Obj,
                                                                                            ...dataBaseVariables,
                                                                                        };
                                                                                        var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
                                                                                        const x = text.replace(RE, function (matched) {
                                                                                            //@ts-ignore
                                                                                            return Obj2[matched];
                                                                                        });
                                                                                        // console.log("x : ",x)
                                                                                        const y = x
                                                                                            .replace(/\[/g, "")
                                                                                            .replace(/\]/g, "")
                                                                                            .replace(/\#/g, ""); //value of string after replacing [] from the messageBody
                                                                                        if (value.carrierType.toLowerCase() ===
                                                                                            "domestic") {
                                                                                            Promise.all(value.toNumbers.map(async (to) => {
                                                                                                console.log("to : ", to);
                                                                                                const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                                                                const json_result = JSON.parse(string_result);
                                                                                                const sms_data = new smsModel_1.default(json_result);
                                                                                                await sms_data.save();
                                                                                            }));
                                                                                        }
                                                                                        if (value.carrierType.toLowerCase() ===
                                                                                            "international") {
                                                                                            Promise.all(value.toNumbers.map(async (to) => {
                                                                                                // console.log("to : ",to)
                                                                                                const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                                                                const json_result = JSON.parse(string_result);
                                                                                                const sms_data = new smsModel_1.default(json_result);
                                                                                                await sms_data.save();
                                                                                            }));
                                                                                        }
                                                                                    }
                                                                                    if (value.smsTo.toLowerCase() ===
                                                                                        "dynamic") {
                                                                                        const text = value.messageBody;
                                                                                        const Obj = {
                                                                                            "#Caller": removed_sip,
                                                                                            "#OnlyTenDigit": customer_number_only_10_deigits,
                                                                                            "#Time": time,
                                                                                            "#Digits": lastDigits,
                                                                                        };
                                                                                        var RE = new RegExp(Object.keys(Obj).join("|"), "gi");
                                                                                        const x = text.replace(RE, function (matched) {
                                                                                            // console.log("matched : ",matched)
                                                                                            //@ts-ignore
                                                                                            return Obj[matched];
                                                                                        });
                                                                                        const y = x
                                                                                            .replace(/\[/g, "")
                                                                                            .replace(/\]/g, ""); //value of string after replacing [] from the messageBody
                                                                                        // console.log("y : ",y)
                                                                                        if (value.carrierType.toLowerCase() ===
                                                                                            "domestic") {
                                                                                            const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, removed_sip);
                                                                                            const json_result = JSON.parse(string_result);
                                                                                            const sms_data = new smsModel_1.default(json_result);
                                                                                            await sms_data.save();
                                                                                        }
                                                                                        if (value.carrierType.toLowerCase() ===
                                                                                            "international") {
                                                                                            const string_result = await this.sendCompletedMessageThree(value.AuthId, value.AuthSecret, value.senderId, value.peId, y, removed_sip);
                                                                                            const json_result = JSON.parse(string_result);
                                                                                            const sms_data = new smsModel_1.default(json_result);
                                                                                            await sms_data.save();
                                                                                        }
                                                                                    }
                                                                                    voice.hangup();
                                                                                    console.log("xml is : ", voice.toString());
                                                                                    return res.send(voice.toString());
                                                                                }
                                                                            }
                                                                        }
                                                                        else {
                                                                            const nextNodeConnectedToBussinessHourNodeOff = connectors.filter((item) => {
                                                                                if (item.source ===
                                                                                    bussinessHourNodeId &&
                                                                                    item.sourceHandle ==
                                                                                        "businesshourOff") {
                                                                                    return item;
                                                                                }
                                                                            });
                                                                            // console.log("nextNodeConnectedToBussinessHourNodeOff : ", nextNodeConnectedToBussinessHourNodeOff)
                                                                            console.log("is not between now : ", now, "start : ", start, "end : ", end);
                                                                            const nextNodeIfSuccess = data.input?.filter((item) => {
                                                                                for (let i = 0; i <
                                                                                    nextNodeConnectedToBussinessHourNodeOff.length; i++) {
                                                                                    if (item.id ===
                                                                                        nextNodeConnectedToBussinessHourNodeOff[i].target) {
                                                                                        return item;
                                                                                    }
                                                                                }
                                                                                // if(item.id === nextNodeConnectedToBussinessHourNodeOff[0].target){
                                                                                //     return item
                                                                                // }
                                                                            });
                                                                            console.log("if bussiness hour off nextNodeIfSuccess 4602: ", nextNodeIfSuccess);
                                                                            if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                                                const newRealTime = new IvrStudiousRealTime_1.default({
                                                                                    ...req.query,
                                                                                    source: "Web",
                                                                                });
                                                                                await newRealTime.save();
                                                                                let numDigits = nextNodeIfSuccess[0]
                                                                                    .data.inputLength
                                                                                    ? nextNodeIfSuccess[0].data
                                                                                        .inputLength
                                                                                    : "1";
                                                                                let Parent;
                                                                                Parent = voice.gather({
                                                                                    action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNodeIfSuccess[0].id}/${target}`,
                                                                                    method: "POST",
                                                                                    numDigits: numDigits,
                                                                                });
                                                                                if (nextNodeIfSuccess[0].data.ivrAudioUrl) {
                                                                                    Parent.play({
                                                                                        loop: nextNodeIfSuccess[0].data
                                                                                            .loop,
                                                                                    }, nextNodeIfSuccess[0].data
                                                                                        .ivrAudioUrl);
                                                                                    voice.pause({
                                                                                        length: nextNodeIfSuccess[0].data
                                                                                            .ivrPlayAudioPause,
                                                                                    });
                                                                                }
                                                                                return res.send(voice.toString());
                                                                            }
                                                                            if (nextNodeIfSuccess[0].type ===
                                                                                "PlayAudioNode") {
                                                                                if (nextNodeIfSuccess.length > 1) {
                                                                                    if (nextNodeIfSuccess[1].type ===
                                                                                        "MessageNode") {
                                                                                        console.log("nextNodeIfSuccess[1].data.message : ", nextNodeIfSuccess[1]);
                                                                                        let targetNode = nextNodeIfSuccess[1];
                                                                                        let ParentCallSid;
                                                                                        if (req.body.ParentCallSid) {
                                                                                            ParentCallSid =
                                                                                                req.body.ParentCallSid;
                                                                                        }
                                                                                        else {
                                                                                            ParentCallSid =
                                                                                                req.query.ParentCallSid;
                                                                                        }
                                                                                        const customerVariablesDetails = await IvrStudiousRealTime_1.default.findOne({
                                                                                            ParentCallSid: ParentCallSid,
                                                                                        });
                                                                                        let dataBaseVariables = {};
                                                                                        if (customerVariablesDetails) {
                                                                                            // console.log("customerVariablesDetails : ",customerVariablesDetails.variables)
                                                                                            const tempObj = customerVariablesDetails.variables.map((variable) => {
                                                                                                const stringObj = `{"${variable.key}":"${variable.value}"}`;
                                                                                                return JSON.parse(stringObj);
                                                                                            });
                                                                                            // console.log("tempObj : ",tempObj)
                                                                                            const a = tempObj.reduce((acc, obj) => Object.assign(acc, obj), {});
                                                                                            // console.log("a : ",a)
                                                                                            dataBaseVariables = a;
                                                                                        }
                                                                                        const value = targetNode.data;
                                                                                        // console.log("value : ",value)
                                                                                        const myQuery = {
                                                                                            ParentCallSid: ParentCallSid,
                                                                                        };
                                                                                        const customer = await ivrStudiosModelCallBacks_1.default.find(myQuery);
                                                                                        // console.log("customer : ",customer)
                                                                                        const time = customer[0].subscribeDate;
                                                                                        const call_back_with_digits = customer.filter((customer) => {
                                                                                            if (customer.source ===
                                                                                                "gather_response_body_ivr_flow") {
                                                                                                let Digits = customer.Digits;
                                                                                                return Digits;
                                                                                            }
                                                                                        });
                                                                                        const array_of_selected_Digits = call_back_with_digits.map((customer) => {
                                                                                            return customer.Digits;
                                                                                        });
                                                                                        let lastDigits;
                                                                                        // console.log("call_back_with_digits.slice(-1)[0] : ",call_back_with_digits.slice(-1)[0])
                                                                                        if (call_back_with_digits.slice(-1)[0] === undefined) {
                                                                                            lastDigits = "";
                                                                                        }
                                                                                        if (call_back_with_digits.slice(-1)[0] !== undefined) {
                                                                                            lastDigits =
                                                                                                call_back_with_digits.slice(-1)[0].Digits;
                                                                                        }
                                                                                        let removed_sip; //customer number
                                                                                        let customer_number_only_10_deigits;
                                                                                        if (customer[0].From) {
                                                                                            if (customer[0].From.includes("sip:")) {
                                                                                                let removed_ip = customer[0].From.split("@")[0];
                                                                                                removed_sip =
                                                                                                    removed_ip.split(":")[1];
                                                                                            }
                                                                                            else {
                                                                                                removed_sip = customer[0].From;
                                                                                                removed_sip =
                                                                                                    removed_sip.replace(/^0+/, "");
                                                                                                customer_number_only_10_deigits =
                                                                                                    removed_sip.substr(removed_sip.length - 10);
                                                                                            }
                                                                                        }
                                                                                        console.log("array_of_selected_Digits : ", array_of_selected_Digits);
                                                                                        // console.log("lastDigits : ",lastDigits)
                                                                                        // console.log("time : ",time)
                                                                                        // console.log("customer : ", removed_sip)
                                                                                        // console.log("value.body : ",value.messageBody)
                                                                                        // console.log("customer number 1904 : ", removed_sip , ParentCallSid, customer)
                                                                                        if (value.smsTo.toLowerCase() ===
                                                                                            "specific") {
                                                                                            // console.log("value.body : ",value.messageBody)
                                                                                            const text = value.messageBody;
                                                                                            const Obj = {
                                                                                                "#Caller": removed_sip,
                                                                                                "#OnlyTenDigit": customer_number_only_10_deigits,
                                                                                                "#Time": time,
                                                                                                "#Digits": lastDigits,
                                                                                            };
                                                                                            const Obj2 = {
                                                                                                ...Obj,
                                                                                                ...dataBaseVariables,
                                                                                            };
                                                                                            var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
                                                                                            const x = text.replace(RE, function (matched) {
                                                                                                //@ts-ignore
                                                                                                return Obj2[matched];
                                                                                            });
                                                                                            // console.log("x : ",x)
                                                                                            const y = x
                                                                                                .replace(/\[/g, "")
                                                                                                .replace(/\]/g, "")
                                                                                                .replace(/\#/g, ""); //value of string after replacing [] from the messageBody
                                                                                            if (value.carrierType.toLowerCase() ===
                                                                                                "domestic") {
                                                                                                Promise.all(value.toNumbers.map(async (to) => {
                                                                                                    console.log("to : ", to);
                                                                                                    const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                                                                    const json_result = JSON.parse(string_result);
                                                                                                    const sms_data = new smsModel_1.default(json_result);
                                                                                                    await sms_data.save();
                                                                                                }));
                                                                                            }
                                                                                            if (value.carrierType.toLowerCase() ===
                                                                                                "international") {
                                                                                                Promise.all(value.toNumbers.map(async (to) => {
                                                                                                    // console.log("to : ",to)
                                                                                                    const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                                                                    const json_result = JSON.parse(string_result);
                                                                                                    const sms_data = new smsModel_1.default(json_result);
                                                                                                    await sms_data.save();
                                                                                                }));
                                                                                            }
                                                                                        }
                                                                                        if (value.smsTo.toLowerCase() ===
                                                                                            "dynamic") {
                                                                                            const text = value.messageBody;
                                                                                            const Obj = {
                                                                                                "#Caller": removed_sip,
                                                                                                "#OnlyTenDigit": customer_number_only_10_deigits,
                                                                                                "#Time": time,
                                                                                                "#Digits": lastDigits,
                                                                                            };
                                                                                            var RE = new RegExp(Object.keys(Obj).join("|"), "gi");
                                                                                            const x = text.replace(RE, function (matched) {
                                                                                                // console.log("matched : ",matched)
                                                                                                //@ts-ignore
                                                                                                return Obj[matched];
                                                                                            });
                                                                                            const y = x
                                                                                                .replace(/\[/g, "")
                                                                                                .replace(/\]/g, ""); //value of string after replacing [] from the messageBody
                                                                                            // console.log("y : ",y)
                                                                                            if (value.carrierType.toLowerCase() ===
                                                                                                "domestic") {
                                                                                                const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, removed_sip);
                                                                                                const json_result = JSON.parse(string_result);
                                                                                                const sms_data = new smsModel_1.default(json_result);
                                                                                                await sms_data.save();
                                                                                            }
                                                                                            if (value.carrierType.toLowerCase() ===
                                                                                                "international") {
                                                                                                const string_result = await this.sendCompletedMessageThree(value.AuthId, value.AuthSecret, value.senderId, value.peId, y, removed_sip);
                                                                                                const json_result = JSON.parse(string_result);
                                                                                                const sms_data = new smsModel_1.default(json_result);
                                                                                                await sms_data.save();
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                                const newRealTime = new IvrStudiousRealTime_1.default({
                                                                                    ...req.query,
                                                                                    source: "Web",
                                                                                });
                                                                                await newRealTime.save();
                                                                                // const nextNode_for_action = connectors.filter((item : any)=>{
                                                                                //     if(item.source === nextNodeIfSuccess[0].id){
                                                                                //         return item
                                                                                //     }
                                                                                // })
                                                                                const nextNode_for_action_id = connectors.filter((item) => {
                                                                                    if (item.source ===
                                                                                        nextNodeIfSuccess[0].id) {
                                                                                        return item;
                                                                                    }
                                                                                });
                                                                                let nextNode_for_action_id_data = "hangup";
                                                                                if (nextNode_for_action_id.length > 0) {
                                                                                    nextNode_for_action_id_data =
                                                                                        nextNode_for_action_id[0].target;
                                                                                }
                                                                                // console.log("nextNode_for_action : ",nextNode_for_action_id_data)
                                                                                voice.play({
                                                                                    loop: nextNodeIfSuccess[0].data
                                                                                        .loop,
                                                                                    digits: "wwww3",
                                                                                }, nextNodeIfSuccess[0].data.audioUrl);
                                                                                voice.pause({
                                                                                    length: nextNodeIfSuccess[0].data
                                                                                        .playAudioPause,
                                                                                });
                                                                                voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNode_for_action_id_data}/${target}`);
                                                                                return res.send(voice.toString());
                                                                            }
                                                                            let filterTargetNode = nextNodeIfSuccess;
                                                                            if (nextNodeIfSuccess[0].type ===
                                                                                "MessageNode") {
                                                                                let detailsOfTargetNode = nextNodeIfSuccess[0];
                                                                                let loop;
                                                                                let audioUrl;
                                                                                let playAudioPause;
                                                                                let makePlayXml = false;
                                                                                let ParentCallSid;
                                                                                if (req.body.ParentCallSid) {
                                                                                    ParentCallSid =
                                                                                        req.body.ParentCallSid;
                                                                                }
                                                                                else {
                                                                                    ParentCallSid =
                                                                                        req.query.ParentCallSid;
                                                                                }
                                                                                const customerVariablesDetails = await IvrStudiousRealTime_1.default.findOne({
                                                                                    ParentCallSid: ParentCallSid,
                                                                                });
                                                                                let dataBaseVariables = {};
                                                                                if (customerVariablesDetails) {
                                                                                    if (customerVariablesDetails.variables) {
                                                                                        // console.log("customerVariablesDetails : ",customerVariablesDetails.variables)
                                                                                        const tempObj = customerVariablesDetails.variables.map((variable) => {
                                                                                            const stringObj = `{"${variable.key}":"${variable.value}"}`;
                                                                                            return JSON.parse(stringObj);
                                                                                        });
                                                                                        // console.log("tempObj : ",tempObj)
                                                                                        const a = tempObj.reduce((acc, obj) => Object.assign(acc, obj), {});
                                                                                        // console.log("a : ",a)
                                                                                        dataBaseVariables = a;
                                                                                    }
                                                                                }
                                                                                if (filterTargetNode.length > 1) {
                                                                                    console.log("targetNodeMoreThatnOne : ", filterTargetNode.length, filterTargetNode);
                                                                                    for (let i = 0; i < filterTargetNode.length; i++) {
                                                                                        // console.log("targetNode_id[i] : ",filterTargetNode[i])
                                                                                        const detailsOfTargetNode = data.input?.find((node) => node.id ===
                                                                                            filterTargetNode[i].id);
                                                                                        // console.log("detailsOfTargetNode : ",detailsOfTargetNode)
                                                                                        if (detailsOfTargetNode.type ==
                                                                                            "MessageNode") {
                                                                                            const value = detailsOfTargetNode.data;
                                                                                            // console.log("value : ",value)
                                                                                            let ParentCallSid;
                                                                                            if (req.body.ParentCallSid) {
                                                                                                ParentCallSid =
                                                                                                    req.body.ParentCallSid;
                                                                                            }
                                                                                            else {
                                                                                                ParentCallSid =
                                                                                                    req.query.ParentCallSid;
                                                                                            }
                                                                                            const myQuery = {
                                                                                                ParentCallSid: ParentCallSid,
                                                                                            };
                                                                                            const customer = await ivrStudiosModelCallBacks_1.default.find(myQuery);
                                                                                            // console.log("customer : ",customer)
                                                                                            const time = customer[0].subscribeDate;
                                                                                            const call_back_with_digits = customer.filter((customer) => {
                                                                                                if (customer.source ===
                                                                                                    "gather_response_body_ivr_flow") {
                                                                                                    let Digits = customer.Digits;
                                                                                                    return Digits;
                                                                                                }
                                                                                            });
                                                                                            const array_of_selected_Digits = call_back_with_digits.map((customer) => {
                                                                                                return customer.Digits;
                                                                                            });
                                                                                            let lastDigits;
                                                                                            console.log("call_back_with_digits.slice(-1)[0] : ", call_back_with_digits.slice(-1)[0]);
                                                                                            if (call_back_with_digits.slice(-1)[0] === undefined) {
                                                                                                lastDigits = "";
                                                                                            }
                                                                                            if (call_back_with_digits.slice(-1)[0] !== undefined) {
                                                                                                lastDigits =
                                                                                                    call_back_with_digits.slice(-1)[0].Digits;
                                                                                            }
                                                                                            let removed_sip; //customer number
                                                                                            let customer_number_only_10_deigits;
                                                                                            if (customer[0].From) {
                                                                                                if (customer[0].From.includes("sip:")) {
                                                                                                    let removed_ip = customer[0].From.split("@")[0];
                                                                                                    removed_sip =
                                                                                                        removed_ip.split(":")[1];
                                                                                                }
                                                                                                else {
                                                                                                    removed_sip =
                                                                                                        customer[0].From;
                                                                                                    removed_sip =
                                                                                                        removed_sip.replace(/^0+/, "");
                                                                                                    customer_number_only_10_deigits =
                                                                                                        removed_sip.substr(removed_sip.length - 10);
                                                                                                }
                                                                                            }
                                                                                            console.log("array_of_selected_Digits : ", array_of_selected_Digits);
                                                                                            // console.log("lastDigits : ",lastDigits)
                                                                                            // console.log("time : ",time)
                                                                                            // console.log("customer : ", removed_sip)
                                                                                            // console.log("value.body : ",value.messageBody)
                                                                                            // console.log("customer number 1457 : ", removed_sip , ParentCallSid , customer)
                                                                                            if (value.smsTo.toLowerCase() ===
                                                                                                "specific") {
                                                                                                // console.log("value.body : ",value.messageBody)
                                                                                                const text = value.messageBody;
                                                                                                const Obj = {
                                                                                                    "#Caller": removed_sip,
                                                                                                    "#OnlyTenDigit": customer_number_only_10_deigits,
                                                                                                    "#Time": time,
                                                                                                    "#Digits": lastDigits,
                                                                                                };
                                                                                                const Obj2 = {
                                                                                                    ...Obj,
                                                                                                    ...dataBaseVariables,
                                                                                                };
                                                                                                var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
                                                                                                const x = text.replace(RE, function (matched) {
                                                                                                    //@ts-ignore
                                                                                                    return Obj2[matched];
                                                                                                });
                                                                                                // console.log("x : ",x)
                                                                                                const y = x
                                                                                                    .replace(/\[/g, "")
                                                                                                    .replace(/\]/g, "")
                                                                                                    .replace(/\#/g, ""); //value of string after replacing [] from the messageBody
                                                                                                if (value.carrierType.toLowerCase() ===
                                                                                                    "domestic") {
                                                                                                    Promise.all(value.toNumbers.map(async (to) => {
                                                                                                        // console.log("to : ",to.number)
                                                                                                        const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                                                                        const json_result = JSON.parse(string_result);
                                                                                                        const sms_data = new smsModel_1.default(json_result);
                                                                                                        await sms_data.save();
                                                                                                    }));
                                                                                                }
                                                                                                if (value.carrierType.toLowerCase() ===
                                                                                                    "international") {
                                                                                                    Promise.all(value.toNumbers.map(async (to) => {
                                                                                                        // console.log("to : ",to.number)
                                                                                                        const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                                                                        const json_result = JSON.parse(string_result);
                                                                                                        const sms_data = new smsModel_1.default(json_result);
                                                                                                        await sms_data.save();
                                                                                                    }));
                                                                                                }
                                                                                            }
                                                                                            if (value.smsTo.toLowerCase() ===
                                                                                                "dynamic") {
                                                                                                const text = value.messageBody;
                                                                                                const Obj = {
                                                                                                    "#Caller": removed_sip,
                                                                                                    "#OnlyTenDigit": customer_number_only_10_deigits,
                                                                                                    "#Time": time,
                                                                                                    "#Digits": lastDigits,
                                                                                                };
                                                                                                const Obj2 = {
                                                                                                    ...Obj,
                                                                                                    ...dataBaseVariables,
                                                                                                };
                                                                                                var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
                                                                                                const x = text.replace(RE, function (matched) {
                                                                                                    // console.log("matched : ",matched)
                                                                                                    //@ts-ignore
                                                                                                    return Obj2[matched];
                                                                                                });
                                                                                                const y = x
                                                                                                    .replace(/\[/g, "")
                                                                                                    .replace(/\]/g, "")
                                                                                                    .replace(/\#/g, ""); //value of string after replacing [] from the messageBody
                                                                                                // console.log("y : ",y)
                                                                                                if (value.carrierType.toLowerCase() ===
                                                                                                    "domestic") {
                                                                                                    const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, removed_sip);
                                                                                                    const json_result = JSON.parse(string_result);
                                                                                                    const sms_data = new smsModel_1.default(json_result);
                                                                                                    await sms_data.save();
                                                                                                }
                                                                                                if (value.carrierType.toLowerCase() ===
                                                                                                    "international") {
                                                                                                    const string_result = await this.sendCompletedMessageThree(value.AuthId, value.AuthSecret, value.senderId, value.peId, y, removed_sip);
                                                                                                    const json_result = JSON.parse(string_result);
                                                                                                    const sms_data = new smsModel_1.default(json_result);
                                                                                                    await sms_data.save();
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                        if (detailsOfTargetNode.type ==
                                                                                            "PlayAudioNode") {
                                                                                            makePlayXml = true;
                                                                                            loop =
                                                                                                detailsOfTargetNode.data.loop;
                                                                                            audioUrl =
                                                                                                detailsOfTargetNode.data
                                                                                                    .audioUrl;
                                                                                            playAudioPause =
                                                                                                detailsOfTargetNode.data
                                                                                                    .playAudioPause;
                                                                                        }
                                                                                        // voice.say("Message Sent")
                                                                                        // return res.send(voice.toString())
                                                                                    }
                                                                                    if (makePlayXml == true) {
                                                                                        voice.play({ loop: loop }, audioUrl);
                                                                                        voice.pause({
                                                                                            length: playAudioPause,
                                                                                        });
                                                                                        console.log("xml is : ", voice.toString());
                                                                                        return res.send(voice.toString());
                                                                                    }
                                                                                    voice.hangup();
                                                                                    console.log("xml is : ", voice.toString());
                                                                                    return res.send(voice.toString());
                                                                                }
                                                                                if (filterTargetNode.length == 1) {
                                                                                    // console.log("targetNodeMore is one : ", filterTargetNode.length , filterTargetNode)
                                                                                    const value = detailsOfTargetNode.data;
                                                                                    // console.log("value : ",value)
                                                                                    let ParentCallSid;
                                                                                    if (req.body.ParentCallSid) {
                                                                                        ParentCallSid =
                                                                                            req.body.ParentCallSid;
                                                                                    }
                                                                                    else {
                                                                                        ParentCallSid =
                                                                                            req.query.ParentCallSid;
                                                                                    }
                                                                                    const myQuery = {
                                                                                        ParentCallSid: ParentCallSid,
                                                                                    };
                                                                                    const customer = await ivrStudiosModelCallBacks_1.default.find(myQuery);
                                                                                    // console.log("customer : ",customer)
                                                                                    const time = customer[0].subscribeDate;
                                                                                    const call_back_with_digits = customer.filter((customer) => {
                                                                                        if (customer.source ===
                                                                                            "gather_response_body_ivr_flow") {
                                                                                            let Digits = customer.Digits;
                                                                                            return Digits;
                                                                                        }
                                                                                    });
                                                                                    const array_of_selected_Digits = call_back_with_digits.map((customer) => {
                                                                                        return customer.Digits;
                                                                                    });
                                                                                    let lastDigits;
                                                                                    // console.log("call_back_with_digits.slice(-1)[0] : ",call_back_with_digits.slice(-1)[0])
                                                                                    if (call_back_with_digits.slice(-1)[0] === undefined) {
                                                                                        lastDigits = "";
                                                                                    }
                                                                                    if (call_back_with_digits.slice(-1)[0] !== undefined) {
                                                                                        lastDigits =
                                                                                            call_back_with_digits.slice(-1)[0]
                                                                                                .Digits;
                                                                                    }
                                                                                    let removed_sip; //customer number
                                                                                    let customer_number_only_10_deigits;
                                                                                    if (customer[0].From) {
                                                                                        if (customer[0].From.includes("sip:")) {
                                                                                            let removed_ip = customer[0].From.split("@")[0];
                                                                                            removed_sip =
                                                                                                removed_ip.split(":")[1];
                                                                                        }
                                                                                        else {
                                                                                            removed_sip = customer[0].From;
                                                                                            removed_sip = removed_sip.replace(/^0+/, "");
                                                                                            customer_number_only_10_deigits =
                                                                                                removed_sip.substr(removed_sip.length - 10);
                                                                                        }
                                                                                    }
                                                                                    console.log("array_of_selected_Digits : ", array_of_selected_Digits);
                                                                                    // console.log("lastDigits : ",lastDigits)
                                                                                    // console.log("time : ",time)
                                                                                    // console.log("customer : ", removed_sip)
                                                                                    // console.log("value.body : ",value.messageBody)
                                                                                    // console.log("customer number 1609 : ", removed_sip , ParentCallSid , customer)
                                                                                    if (value.smsTo.toLowerCase() ===
                                                                                        "specific") {
                                                                                        // console.log("value.body : ",value.messageBody)
                                                                                        const text = value.messageBody;
                                                                                        const Obj = {
                                                                                            "#Caller": removed_sip,
                                                                                            "#OnlyTenDigit": customer_number_only_10_deigits,
                                                                                            "#Time": time,
                                                                                            "#Digits": lastDigits,
                                                                                        };
                                                                                        var RE = new RegExp(Object.keys(Obj).join("|"), "gi");
                                                                                        const x = text.replace(RE, function (matched) {
                                                                                            //@ts-ignore
                                                                                            return Obj[matched];
                                                                                        });
                                                                                        // console.log("x : ",x)
                                                                                        const y = x
                                                                                            .replace(/\[/g, "")
                                                                                            .replace(/\]/g, ""); //value of string after replacing [] from the messageBody
                                                                                        if (value.carrierType.toLowerCase() ===
                                                                                            "domestic") {
                                                                                            Promise.all(value.toNumbers.map(async (to) => {
                                                                                                // console.log("to : ",to.number)
                                                                                                const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                                                                const json_result = JSON.parse(string_result);
                                                                                                const sms_data = new smsModel_1.default(json_result);
                                                                                                await sms_data.save();
                                                                                            }));
                                                                                        }
                                                                                        if (value.carrierType.toLowerCase() ===
                                                                                            "international") {
                                                                                            Promise.all(value.toNumbers.map(async (to) => {
                                                                                                // console.log("to : ",to.number)
                                                                                                const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                                                                                const json_result = JSON.parse(string_result);
                                                                                                const sms_data = new smsModel_1.default(json_result);
                                                                                                await sms_data.save();
                                                                                            }));
                                                                                        }
                                                                                    }
                                                                                    if (value.smsTo.toLowerCase() ===
                                                                                        "dynamic") {
                                                                                        const text = value.messageBody;
                                                                                        const Obj = {
                                                                                            "#Caller": removed_sip,
                                                                                            "#OnlyTenDigit": customer_number_only_10_deigits,
                                                                                            "#Time": time,
                                                                                            "#Digits": lastDigits,
                                                                                        };
                                                                                        var RE = new RegExp(Object.keys(Obj).join("|"), "gi");
                                                                                        const x = text.replace(RE, function (matched) {
                                                                                            // console.log("matched : ",matched)
                                                                                            //@ts-ignore
                                                                                            return Obj[matched];
                                                                                        });
                                                                                        const y = x
                                                                                            .replace(/\[/g, "")
                                                                                            .replace(/\]/g, ""); //value of string after replacing [] from the messageBody
                                                                                        // console.log("y : ",y)
                                                                                        if (value.carrierType.toLowerCase() ===
                                                                                            "domestic") {
                                                                                            const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, removed_sip);
                                                                                            const json_result = JSON.parse(string_result);
                                                                                            const sms_data = new smsModel_1.default(json_result);
                                                                                            await sms_data.save();
                                                                                        }
                                                                                        if (value.carrierType.toLowerCase() ===
                                                                                            "international") {
                                                                                            const string_result = await this.sendCompletedMessageThree(value.AuthId, value.AuthSecret, value.senderId, value.peId, y, removed_sip);
                                                                                            const json_result = JSON.parse(string_result);
                                                                                            const sms_data = new smsModel_1.default(json_result);
                                                                                            await sms_data.save();
                                                                                        }
                                                                                    }
                                                                                    voice.hangup();
                                                                                    console.log("xml is : ", voice.toString());
                                                                                    return res.send(voice.toString());
                                                                                }
                                                                                voice.hangup();
                                                                                console.log("xml is : ", voice.toString());
                                                                                return res.send(voice.toString());
                                                                            }
                                                                            if (nextNodeIfSuccess[0].type ===
                                                                                "MultiPartyCallNode") {
                                                                                const targetNode = nextNodeIfSuccess[0];
                                                                                if (targetNode.data
                                                                                    .mpcCallDistribustion ===
                                                                                    "RoundRobin") {
                                                                                    console.log("write the logic of round robin here ");
                                                                                    let dataFromVibconnect = JSON.stringify(req.body) !== "{}"
                                                                                        ? req.body
                                                                                        : req.query;
                                                                                    const xml = await this.handleMultiPartyCallDistributionOfTypeRoundRobin(targetNode, dataFromVibconnect, id);
                                                                                    console.log("xml is : 5138 ", xml);
                                                                                    return res.send(xml);
                                                                                }
                                                                                if (targetNode.data
                                                                                    .mpcCallDistribustion === "Parallel") {
                                                                                    let dataFromVibconnect = JSON.stringify(req.body) !== "{}"
                                                                                        ? req.body
                                                                                        : req.query;
                                                                                    const xml = await this.handleMultiPartyCallDistributionProcess(targetNode, dataFromVibconnect, id);
                                                                                    console.log("xml is 4943 : ", xml);
                                                                                    return res.send(xml);
                                                                                }
                                                                                else {
                                                                                    // console.log("detailsOfTargetNode if conference : ",detailsOfTargetNode)
                                                                                    // if(nextNodeIfSuccess[0].data.url){
                                                                                    //     console.log("whispher url is : ", nextNodeIfSuccess[0].data.url)
                                                                                    //     let whispherUrl = nextNodeIfSuccess[0].data.url
                                                                                    //     let Parent : any
                                                                                    //     voice.play(whispherUrl)
                                                                                    //     Parent = voice.dial({"action": `${conf.BaseUrl}/api/ivrstudios/convert/${id}/conference|Room_${req.body.ParentCallSid}/${nextNodeIfSuccess[0].id}` , "method" : "GET" } )
                                                                                    //     Parent.conference({waitUrl : nextNodeIfSuccess[0].data.mpcAudio , statusCallback :`${conf.BaseUrl}/api/webhook/vibconnect/conference` , statusCallbackEvent : 'start end join leave mute hold' },`Room_${req.body.ParentCallSid}`)
                                                                                    // }else{
                                                                                    //     let Parent : any
                                                                                    //     Parent = voice.dial({"action": `${conf.BaseUrl}/api/ivrstudios/convert/${id}/conference|Room_${req.body.ParentCallSid}/${nextNodeIfSuccess[0].id}` , "method" : "GET" } )
                                                                                    //     Parent.conference({waitUrl : nextNodeIfSuccess[0].data.mpcAudio , statusCallback :`${conf.BaseUrl}/api/webhook/vibconnect/conference` , statusCallbackEvent : 'start end join leave mute hold' },`Room_${req.body.ParentCallSid}`)
                                                                                    // }
                                                                                    let Parent;
                                                                                    Parent = voice.dial({
                                                                                        action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/conference|Room_${req.body.ParentCallSid}/${nextNodeIfSuccess[0].id}`,
                                                                                        method: "GET",
                                                                                    });
                                                                                    Parent.conference({
                                                                                        waitUrl: nextNodeIfSuccess[0].data
                                                                                            .mpcAudio,
                                                                                        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
                                                                                        statusCallbackEvent: "start end join leave mute hold",
                                                                                    }, `Room_${req.body.ParentCallSid}`);
                                                                                    let url = "empty";
                                                                                    if (nextNodeIfSuccess[0].data.url) {
                                                                                        let fullUrl = nextNodeIfSuccess[0].data.url;
                                                                                        // let removedHttpsUrl = fullUrl.replace("https://vibtreedan.s3.amazonaws.com/public/","")
                                                                                        let removedHttpsUrl = fullUrl.split("public/");
                                                                                        url = removedHttpsUrl[1];
                                                                                    }
                                                                                    let timeOut = "60";
                                                                                    if (nextNodeIfSuccess[0].data
                                                                                        .mpcCallUsingNumbers[0]) {
                                                                                        timeOut =
                                                                                            nextNodeIfSuccess[0].data
                                                                                                .mpcCallUsingNumbers[0]
                                                                                                .ringTimeOut;
                                                                                    }
                                                                                    let correctNumberArray;
                                                                                    if (nextNodeIfSuccess[0].data
                                                                                        .mpcCallUsing === "User") {
                                                                                        console.log("this is not number this is user typ calling system");
                                                                                        let detailsOfNumbersFromUI = nextNodeIfSuccess[0].data
                                                                                            .mpcCallUsingNumbers;
                                                                                        const numbersFromUerID = await this.extractAllNumberOfCorrespondingUser(detailsOfNumbersFromUI);
                                                                                        console.log("List of numbers from user : ", numbersFromUerID);
                                                                                        correctNumberArray =
                                                                                            numbersFromUerID;
                                                                                    }
                                                                                    if (nextNodeIfSuccess[0].data
                                                                                        .mpcCallUsing === "Number") {
                                                                                        correctNumberArray =
                                                                                            nextNodeIfSuccess[0].data
                                                                                                .mpcCallUsingNumbers;
                                                                                    }
                                                                                    //For Testing only
                                                                                    // Parent.conference({waitUrl : nextNodeIfSuccess[0].data.mpcAudio , statusCallback :'https://dataneuronbackend.herokuapp.com/subscribers' , statusCallbackEvent : 'start end join leave mute hold' },`Room_${req.body.ParentCallSid}`)
                                                                                    const body = {
                                                                                        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call`,
                                                                                        // "statusCallback":`https://dataneuronbackend.herokuapp.com/subscribers`, //For testing Only
                                                                                        statusCallbackEvent: "initiated, ringing, answered, completed",
                                                                                        Record: "true",
                                                                                        // "To": nextNodeIfSuccess[0].data.mpcCallUsingNumbers[0].number,
                                                                                        To: correctNumberArray[0].number,
                                                                                        From: req.body.To,
                                                                                        Timeout: timeOut,
                                                                                        Method: "GET",
                                                                                        // "Url" : `${conf.BaseUrl}/api/getConferenceRoom/Room_${req.body.ParentCallSid}/${url}`
                                                                                        Url: `${conf.BaseUrl}/api/checkIfCustomerInLine/Room_${req.body.ParentCallSid}/${url}`,
                                                                                        recordingStatusCallback: `${conf.BaseUrl}/api//vibconnect/webhook/recordings`,
                                                                                        recordingStatusCallbackEvent: "in-progress, completed, absent",
                                                                                        recordingStatusCallbackMethod: "POST",
                                                                                        record: "true",
                                                                                    };
                                                                                    console.log("node credentials : ", nextNodeIfSuccess[0].data.authId, " : ", nextNodeIfSuccess[0].data.authSecret);
                                                                                    const call_details = await this.MakeConferenceCall(nextNodeIfSuccess[0].data.authId, nextNodeIfSuccess[0].data
                                                                                        .authSecret, body);
                                                                                    const call_details_json = JSON.parse(call_details);
                                                                                    const data_required_to_filter_conference_details = {
                                                                                        AccountSid: req.body.AccountSid,
                                                                                        ParentCallSid: req.body.ParentCallSid,
                                                                                        ConferenceId: "",
                                                                                        CallSid: call_details_json.sid,
                                                                                        FriendlyName: `Room_${req.body.ParentCallSid}`,
                                                                                        ChildCallSid: call_details_json.sid,
                                                                                        source: nextNodeIfSuccess[0].id,
                                                                                        id: id,
                                                                                        listOfChildCallSid: [
                                                                                            call_details_json.sid,
                                                                                        ],
                                                                                        whispherUrl: url,
                                                                                    };
                                                                                    console.log("data_required_to_filter_conference_details 3290 : ", data_required_to_filter_conference_details);
                                                                                    const conference = new ConferenceModel_1.default(data_required_to_filter_conference_details);
                                                                                    await conference.save();
                                                                                    let queryToSend = {
                                                                                        ParentCallSid: req.body.ParentCallSid,
                                                                                    };
                                                                                    let updateToSend = {
                                                                                        $set: {
                                                                                            CallSidOfConferenceChildCall: call_details_json.sid,
                                                                                        },
                                                                                    };
                                                                                    this.updateRealTimeDataOfIvrStudiousForApiCall(queryToSend, updateToSend);
                                                                                    console.log("xml is : ", voice.toString());
                                                                                    return res.send(voice.toString());
                                                                                }
                                                                            }
                                                                        }
                                                                        // console.log("currentTime : ",currentTime , now)
                                                                        // console.log("now : ", now)
                                                                        // console.log("start : ",start )
                                                                        // console.log("end : ",end )
                                                                        // console.log("currentDay : ",currentDay)
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            // console.log("currentTime : ",currentTime , now)
                                            // console.log("now : ", now)
                                            // console.log("start : ",start )
                                            // console.log("end : ",end )
                                            // console.log("currentDay : ",currentDay)
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (detailsOfTargetNode.type === "SpeakNode") {
                        console.log("SpeakNode");
                        voice.say({
                            voice: detailsOfTargetNode.data.speakVoiceType,
                            language: detailsOfTargetNode.data.languageCode,
                        }, detailsOfTargetNode.data.speakBody);
                        voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${detailsOfTargetNode.target}/${detailsOfTargetNode.id}`);
                        console.log("xml is : ", voice.toString());
                        return res.send(voice.toString());
                    }
                    // New Logic to handle multiparty Call According to real time
                    if (detailsOfTargetNode.type === "MultiPartyCallNode") {
                        const dataFromVibconnect = req.body ? req.body : req.query;
                        const xml = await (0, callXmlGenerator_1.generateXmlForMultiPartyCallNode)(id, detailsOfTargetNode.id, detailsOfTargetNode.id, detailsOfTargetNode.data, dataFromVibconnect);
                        return res.send(xml);
                    }
                    if (detailsOfTargetNode.type === "FunctionRequestNode") {
                        const targetNodeForRedirect = allNodes.filter((node) => {
                            if (node.source == detailsOfTargetNode.id) {
                                return node.target;
                            }
                        });
                        // console.log("targetNodeForRedirect : ",targetNodeForRedirect)
                        const targetNodeOnlyWithSourceAndTarget = targetNodeForRedirect.map((node) => {
                            return {
                                sourceHandle: node.sourceHandle,
                                target: node.target,
                            };
                        });
                        console.log("targetNodeOnlyWithSourceAndTarget : ", targetNodeOnlyWithSourceAndTarget);
                        voice.play({
                            loop: detailsOfTargetNode.data.functionAudioLoop,
                            digits: "wwww3",
                        }, detailsOfTargetNode.data.functionAudio);
                        // const variableArrayInString = JSON.stringify(detailsOfTargetNode.data.variableArray)
                        const connectorsDetailsInString = encodeURIComponent(JSON.stringify(targetNodeOnlyWithSourceAndTarget));
                        console.log("connectorsDetailsInString : ", connectorsDetailsInString);
                        voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/checkValue|${connectorsDetailsInString}|${req.body.ParentCallSid}/${detailsOfTargetNode.id}`);
                        // const request : any  =  this.collectDetailsAndMakeRequest(detailsOfTargetNode)
                        // console.log("request : ",request)
                        // const jsonResponse = JSON.parse(request)
                        // const {variableArray} = detailsOfTargetNode.data
                        // const exactValueAfterFilter = this.filterVariablesFromResponse(variableArray , jsonResponse)
                        // console.log("exactValueAfterFilter : ",exactValueAfterFilter)
                        // console.log("jsonResponse : ",jsonResponse)
                        // await ivrFlowUIModel.findByIdAndUpdate(id,{$push : {variables : exactValueAfterFilter}})
                        const parentCallSid = req.body.ParentCallSid;
                        this.runApiRequestInBackground(detailsOfTargetNode, parentCallSid, req.body.From);
                        console.log("xml is : ", voice.toString());
                        return res.send(voice.toString());
                    }
                    if (detailsOfTargetNode.type === "PlayAudioNode") {
                        const nextNodeToAction = allNodes.find((node) => {
                            if (node.source === detailsOfTargetNode.id) {
                                return node;
                            }
                        });
                        const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(id, detailsOfTargetNode.id, nextNodeToAction.target, detailsOfTargetNode.data);
                        return res.send(xmlFromHelper);
                    }
                    if (detailsOfTargetNode.type === "ivrNode") {
                        const xml = (0, callXmlGenerator_1.generateXmlForIvrNode)(id, detailsOfTargetNode.id, target, detailsOfTargetNode.data);
                        return res.send(xml);
                    }
                    if (detailsOfTargetNode.type === "MessageNode") {
                        let makePlayXml = false;
                        let playNodeDetails;
                        let playNodeId;
                        if (filterTargetNode.length === 1) {
                            const dataFromVibconnect = req.body ? req.body : req.query;
                            const xml = await (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                            return res.send(xml);
                        }
                        if (filterTargetNode.length > 1) {
                            console.log("Try to search play node it will be there.");
                            for (let i = 0; i < filterTargetNode.length; i++) {
                                const detailsOfTargetNode = data.input?.find((node) => node.id === filterTargetNode[i].target);
                                if (detailsOfTargetNode.type == "MessageNode") {
                                    const dataFromVibconnect = req.query;
                                    //not making it async await because it is making API response slow and we dont need to send message first then play
                                    (0, callXmlGenerator_1.generateXmlForMessage)(detailsOfTargetNode.data, dataFromVibconnect);
                                }
                                if (detailsOfTargetNode.type == "PlayAudioNode") {
                                    makePlayXml = true;
                                    playNodeDetails = detailsOfTargetNode.data;
                                    playNodeId = detailsOfTargetNode.id;
                                }
                            }
                        }
                        if (makePlayXml) {
                            const nextNode_for_action = connectors.find((item) => {
                                if (item.source === playNodeId) {
                                    return item;
                                }
                            });
                            const nextNode_for_action_id_data = nextNode_for_action.target;
                            const xmlFromHelper = (0, callXmlGenerator_1.generateXmlForPlayNode)(id, playNodeId, nextNode_for_action_id_data, playNodeDetails);
                            return res.send(xmlFromHelper);
                        }
                    }
                }
                if (targetNode.type === "SpeakNode") {
                    console.log("SpeakNode");
                    voice.say({
                        voice: targetNode.data.speakVoiceType,
                        language: targetNode.data.languageCode,
                    }, targetNode.data.speakBody);
                    voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${targetNode.target}/${targetNode.id}`);
                    return res.send(voice.toString());
                }
                if (targetNode.type === "MultiPartyCallNode") {
                    console.log("targetNode if conference : ", targetNode, targetNode.data.mpcCallDistribustion);
                    let dataFromVibconnect = JSON.stringify(req.body) !== "{}"
                        ? req.body
                        : req.query;
                    const xml = await (0, callXmlGenerator_1.generateXmlForMultiPartyCallNode)(id, source, target, targetNode.data, dataFromVibconnect);
                    console.log("XML : ", xml);
                    return res.send(xml);
                }
                if (targetNode.type !== "ivrNode") {
                    // console.log("targetNode if not ivr : ",targetNode)
                    const nextNode = allNodes.find((node) => node.source === targetNode.target);
                    if (nextNode.type === "FunctionRequestNode") {
                        voice.play({ loop: nextNode.data.functionAudioLoop, digits: "wwww3" }, nextNode.data.functionAudio);
                        let customer;
                        if (req.query.From) {
                            customer = req.query.From;
                        }
                        if (req.body.From) {
                            customer = req.body.From;
                        }
                        const request = await this.collectDetailsAndMakeRequest(nextNode, customer);
                        const jsonResponse = JSON.parse(request);
                        const { variableArray } = nextNode.data;
                        const exactValueAfterFilter = this.filterVariablesFromResponse(variableArray, jsonResponse);
                        // console.log("exactValueAfterFilter 2086: ",exactValueAfterFilter)
                        // console.log("jsonResponse : ",jsonResponse)
                        let ParentCallSid;
                        if (req.body.ParentCallSid) {
                            ParentCallSid = req.body.ParentCallSid;
                        }
                        if (req.query.ParentCallSid) {
                            ParentCallSid = req.query.ParentCallSid;
                        }
                        await IvrStudiousRealTime_1.default.findOneAndUpdate({ ParentCallSid: ParentCallSid }, { $push: { variables: exactValueAfterFilter } });
                        console.log("xml is : ", voice.toString());
                        return res.send(voice.toString());
                    }
                    if (nextNode.type === "PlayAudioNode") {
                        voice.play({ loop: targetNode.data.loop }, targetNode.data.audioUrl);
                        voice.pause({ length: targetNode.data.playAudioPause });
                        console.log("xml is : ", voice.toString());
                        return res.send(voice.toString());
                    }
                    if (targetNode.type === "MessageNode") {
                        let ParentCallSid;
                        if (req.body.ParentCallSid) {
                            ParentCallSid = req.body.ParentCallSid;
                        }
                        else {
                            ParentCallSid = req.query.ParentCallSid;
                        }
                        const customerVariablesDetails = await IvrStudiousRealTime_1.default.findOne({
                            ParentCallSid: ParentCallSid,
                        });
                        let dataBaseVariables = {};
                        if (customerVariablesDetails) {
                            // console.log("customerVariablesDetails : ",customerVariablesDetails.variables)
                            const tempObj = customerVariablesDetails.variables.map((variable) => {
                                const stringObj = `{"${variable.key}":"${variable.value}"}`;
                                return JSON.parse(stringObj);
                            });
                            // console.log("tempObj : ",tempObj)
                            const a = tempObj.reduce((acc, obj) => Object.assign(acc, obj), {});
                            // console.log("a : ",a)
                            dataBaseVariables = a;
                        }
                        const value = targetNode.data;
                        // console.log("value : ",value)
                        const myQuery = { ParentCallSid: ParentCallSid };
                        const customer = await ivrStudiosModelCallBacks_1.default.find(myQuery);
                        // console.log("customer : ",customer)
                        const time = customer[0].subscribeDate;
                        const call_back_with_digits = customer.filter((customer) => {
                            if (customer.source === "gather_response_body_ivr_flow") {
                                let Digits = customer.Digits;
                                return Digits;
                            }
                        });
                        const array_of_selected_Digits = call_back_with_digits.map((customer) => {
                            return customer.Digits;
                        });
                        let lastDigits;
                        // console.log("call_back_with_digits.slice(-1)[0] : ",call_back_with_digits.slice(-1)[0])
                        if (call_back_with_digits.slice(-1)[0] === undefined) {
                            lastDigits = "";
                        }
                        if (call_back_with_digits.slice(-1)[0] !== undefined) {
                            lastDigits = call_back_with_digits.slice(-1)[0].Digits;
                        }
                        let removed_sip; //customer number
                        let customer_number_only_10_deigits;
                        if (customer[0].From) {
                            if (customer[0].From.includes("sip:")) {
                                let removed_ip = customer[0].From.split("@")[0];
                                removed_sip = removed_ip.split(":")[1];
                            }
                            else {
                                removed_sip = customer[0].From;
                                removed_sip = removed_sip.replace(/^0+/, "");
                                customer_number_only_10_deigits = removed_sip.substr(removed_sip.length - 10);
                            }
                        }
                        console.log("array_of_selected_Digits : ", array_of_selected_Digits);
                        // console.log("lastDigits : ",lastDigits)
                        // console.log("time : ",time)
                        // console.log("customer : ", removed_sip)
                        // console.log("value.body : ",value.messageBody)
                        // console.log("customer number 1904 : ", removed_sip , ParentCallSid, customer)
                        if (value.smsTo.toLowerCase() === "specific") {
                            // console.log("value.body : ",value.messageBody)
                            const text = value.messageBody;
                            const Obj = {
                                "#Caller": removed_sip,
                                "#OnlyTenDigit": customer_number_only_10_deigits,
                                "#Time": time,
                                "#Digits": lastDigits,
                            };
                            const Obj2 = {
                                ...Obj,
                                ...dataBaseVariables,
                            };
                            var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
                            const x = text.replace(RE, function (matched) {
                                //@ts-ignore
                                return Obj2[matched];
                            });
                            // console.log("x : ",x)
                            const y = x
                                .replace(/\[/g, "")
                                .replace(/\]/g, "")
                                .replace(/\#/g, ""); //value of string after replacing [] from the messageBody
                            if (value.carrierType.toLowerCase() === "domestic") {
                                Promise.all(value.toNumbers.map(async (to) => {
                                    console.log("to : ", to);
                                    const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                    const json_result = JSON.parse(string_result);
                                    const sms_data = new smsModel_1.default(json_result);
                                    await sms_data.save();
                                }));
                            }
                            if (value.carrierType.toLowerCase() === "international") {
                                Promise.all(value.toNumbers.map(async (to) => {
                                    // console.log("to : ",to)
                                    const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, to.number);
                                    const json_result = JSON.parse(string_result);
                                    const sms_data = new smsModel_1.default(json_result);
                                    await sms_data.save();
                                }));
                            }
                        }
                        if (value.smsTo.toLowerCase() === "dynamic") {
                            const text = value.messageBody;
                            const Obj = {
                                "#Caller": removed_sip,
                                "#OnlyTenDigit": customer_number_only_10_deigits,
                                "#Time": time,
                                "#Digits": lastDigits,
                            };
                            var RE = new RegExp(Object.keys(Obj).join("|"), "gi");
                            const x = text.replace(RE, function (matched) {
                                // console.log("matched : ",matched)
                                //@ts-ignore
                                return Obj[matched];
                            });
                            const y = x.replace(/\[/g, "").replace(/\]/g, ""); //value of string after replacing [] from the messageBody
                            // console.log("y : ",y)
                            if (value.carrierType.toLowerCase() === "domestic") {
                                const string_result = await this.sendMessageToDomestic(value.AuthId, value.AuthSecret, value.senderId, value.peId, value.templateId, y, removed_sip);
                                const json_result = JSON.parse(string_result);
                                const sms_data = new smsModel_1.default(json_result);
                                await sms_data.save();
                            }
                            if (value.carrierType.toLowerCase() === "international") {
                                const string_result = await this.sendCompletedMessageThree(value.AuthId, value.AuthSecret, value.senderId, value.peId, y, removed_sip);
                                const json_result = JSON.parse(string_result);
                                const sms_data = new smsModel_1.default(json_result);
                                await sms_data.save();
                            }
                        }
                        voice.hangup();
                        console.log("xml is : ", voice.toString());
                        return res.send(voice.toString());
                    }
                }
                if (targetNode.type === "BusinessHourNode") {
                    let timeAfterThreeHour;
                    timeAfterThreeHour = (0, moment_1.default)().add(3, "hours").toDate();
                    const newRealTime = new IvrStudiousRealTime_1.default({
                        ...req.query,
                        source: "Web",
                        expireDate: timeAfterThreeHour,
                    });
                    await newRealTime.save();
                    let nodeDetails = targetNode.data;
                    console.log("nodeDetails : ", nodeDetails);
                    const connectors = allNodes.filter((item) => {
                        if (item.type == "buttonedge") {
                            return item;
                        }
                    });
                    const filteredNextNodeData = this.findTargetsFromSource(allNodes, targetNode.id);
                    console.log("filteredNextNodeData : ", filteredNextNodeData);
                    if (filteredNextNodeData.length > 0) {
                        if (nodeDetails.bHourOption == "anytime") {
                            let bussinessHourNodeId = filteredNextNodeData[0].id;
                            const nextNodeConnectedToBussinessHourNodeOn = connectors.filter((item) => {
                                if (item.source === bussinessHourNodeId &&
                                    item.sourceHandle == "businesshourOn") {
                                    return item;
                                }
                            });
                            const nextNodeIfSuccess = data.input?.filter((item) => {
                                if (item.id === nextNodeConnectedToBussinessHourNodeOn[0].target) {
                                    return item;
                                }
                            });
                            if (nextNodeIfSuccess.length > 0) {
                                console.log("next node if succes ", nextNodeIfSuccess[0]);
                                if (nextNodeIfSuccess[0].type === "ivrNode") {
                                    let numDigits = nextNodeIfSuccess[0].data.inputLength
                                        ? nextNodeIfSuccess[0].data.inputLength
                                        : "1";
                                    let Parent;
                                    Parent = voice.gather({
                                        action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNodeIfSuccess[0].id}/${source}`,
                                        method: "POST",
                                        numDigits: numDigits,
                                    });
                                    if (nextNodeIfSuccess[0].data.ivrAudioUrl) {
                                        Parent.play({ loop: nextNodeIfSuccess[0].data.loop }, nextNodeIfSuccess[0].data.ivrAudioUrl);
                                        voice.pause({
                                            length: nextNodeIfSuccess[0].data.ivrPlayAudioPause,
                                        });
                                    }
                                    return res.send(voice.toString());
                                }
                                if (nextNodeIfSuccess[0].type === "PlayAudioNode") {
                                    const newRealTime = new IvrStudiousRealTime_1.default({
                                        ...req.query,
                                        source: "Web",
                                    });
                                    await newRealTime.save();
                                    // const nextNode_for_action = connectors.filter((item : any)=>{
                                    //     if(item.source === nextNodeIfSuccess[0].id){
                                    //         return item
                                    //     }
                                    // })
                                    const nextNode_for_action_id = connectors.filter((item) => {
                                        if (item.source === nextNodeIfSuccess[0].id) {
                                            return item;
                                        }
                                    });
                                    const nextNode_for_action_id_data = nextNode_for_action_id[0].target;
                                    // console.log("nextNode_for_action : ",nextNode_for_action_id_data)
                                    voice.play({ loop: nextNodeIfSuccess[0].data.loop, digits: "wwww3" }, nextNodeIfSuccess[0].data.audioUrl);
                                    voice.pause({
                                        length: nextNodeIfSuccess[0].data.playAudioPause,
                                    });
                                    voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNode_for_action_id_data}/${source}`);
                                    return res.send(voice.toString());
                                }
                            }
                        }
                        else {
                            for (let i = 0; i < targetNode.data.bHourDays.length; i++) {
                                if (nodeDetails.bHourDays[i].isWorking === true) {
                                    const currentTime = new Date();
                                    const currentDay = this.getNameOfDay(currentTime.getDay());
                                    // console.log("currentDay : ",currentDay , nodeDetails.bHourDays[i].day )
                                    if (currentDay.toLowerCase() ==
                                        nodeDetails.bHourDays[i].day.toLowerCase()) {
                                        const now = (0, moment_1.default)()
                                            .add(5, "hours")
                                            .add(30, "minutes")
                                            .format(); // in local it is fine but in live it is giving actual time so dont need to add hours
                                        //const now = moment().format()
                                        const tempStartEndObj = await this.getStartAndEndTimeFromMultipleTimeInSingleDay(nodeDetails.bHourDays[i], now);
                                        console.log("tempStartEndObj : ", tempStartEndObj);
                                        let { startTime, endTime } = tempStartEndObj;
                                        const start = startTime;
                                        const end = endTime;
                                        let bussinessHourNodeId = targetNode.id;
                                        // console.log("bussinessHourNodeId : ",bussinessHourNodeId)
                                        if ((0, moment_1.default)(now).isBetween(start, end)) {
                                            console.log("is between  now : ", now, "start : ", start, "end : ", end);
                                            // console.log("connectors : ", connectors)
                                            const nextNodeConnectedToBussinessHourNodeOn = connectors.filter((item) => {
                                                if (item.source === bussinessHourNodeId &&
                                                    item.sourceHandle == "businesshourOn") {
                                                    return item;
                                                }
                                            });
                                            console.log("nextNodeConnectedToBussinessHourNode : ", nextNodeConnectedToBussinessHourNodeOn);
                                            const nextNodeIfSuccess = data.input?.filter((item) => {
                                                if (item.id ===
                                                    nextNodeConnectedToBussinessHourNodeOn[0].target) {
                                                    return item;
                                                }
                                            });
                                            console.log("nextNodeIfSuccess : ", nextNodeIfSuccess);
                                            if (nextNodeIfSuccess.length > 0) {
                                                console.log("next node if not succes 19606 ", nextNodeIfSuccess[0]);
                                                if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                    const newRealTime = new IvrStudiousRealTime_1.default({
                                                        ...req.query,
                                                        source: "Web",
                                                    });
                                                    await newRealTime.save();
                                                    let numDigits = nextNodeIfSuccess[0].data.inputLength
                                                        ? nextNodeIfSuccess[0].data.inputLength
                                                        : "1";
                                                    let Parent;
                                                    Parent = voice.gather({
                                                        action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNodeIfSuccess[0].id}/${source}`,
                                                        method: "POST",
                                                        numDigits: numDigits,
                                                    });
                                                    if (nextNodeIfSuccess[0].data.ivrAudioUrl) {
                                                        Parent.play({ loop: nextNodeIfSuccess[0].data.loop }, nextNodeIfSuccess[0].data.ivrAudioUrl);
                                                        voice.pause({
                                                            length: nextNodeIfSuccess[0].data.ivrPlayAudioPause,
                                                        });
                                                    }
                                                    return res.send(voice.toString());
                                                }
                                                if (nextNodeIfSuccess[0].type === "PlayAudioNode") {
                                                    const newRealTime = new IvrStudiousRealTime_1.default({
                                                        ...req.query,
                                                        source: "Web",
                                                    });
                                                    await newRealTime.save();
                                                    // const nextNode_for_action = connectors.filter((item : any)=>{
                                                    //     if(item.source === nextNodeIfSuccess[0].id){
                                                    //         return item
                                                    //     }
                                                    // })
                                                    const nextNode_for_action_id = connectors.filter((item) => {
                                                        if (item.source === nextNodeIfSuccess[0].id) {
                                                            return item;
                                                        }
                                                    });
                                                    const nextNode_for_action_id_data = nextNode_for_action_id[0].target;
                                                    // console.log("nextNode_for_action : ",nextNode_for_action_id_data)
                                                    voice.play({
                                                        loop: nextNodeIfSuccess[0].data.loop,
                                                        digits: "wwww3",
                                                    }, nextNodeIfSuccess[0].data.audioUrl);
                                                    voice.pause({
                                                        length: nextNodeIfSuccess[0].data.playAudioPause,
                                                    });
                                                    voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNode_for_action_id_data}/${source}`);
                                                    return res.send(voice.toString());
                                                }
                                                if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                    const nextNodeToAction = allNodes.filter((node) => {
                                                        if (node.source == nextNodeIfSuccess[0].id) {
                                                            return node;
                                                        }
                                                    });
                                                    if (nextNodeToAction.length > 0) {
                                                        let ParentGather;
                                                        let numDigits = nextNodeIfSuccess[0].data
                                                            .inputLength
                                                            ? nextNodeIfSuccess[0].data.inputLength
                                                            : "1";
                                                        ParentGather = voice.gather({
                                                            action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNodeIfSuccess[0].id}/${target}`,
                                                            method: "POST",
                                                            numDigits: numDigits,
                                                        });
                                                        ParentGather.play({ loop: nextNodeIfSuccess[0].data.loop }, nextNodeIfSuccess[0].data.ivrAudioUrl);
                                                        voice.pause({
                                                            length: nextNodeIfSuccess[0].data.ivrPlayAudioPause,
                                                        });
                                                        console.log("xml is : ", voice.toString());
                                                        return res.send(voice.toString());
                                                    }
                                                    voice.play({ loop: nextNodeIfSuccess[0].data.loop }, nextNodeIfSuccess[0].data.ivrAudioUrl);
                                                    voice.pause({
                                                        length: nextNodeIfSuccess[0].data.ivrPlayAudioPause,
                                                    });
                                                    console.log("xml is : ", voice.toString());
                                                    return res.send(voice.toString());
                                                }
                                                if (nextNodeIfSuccess[0].type === "MultiPartyCallNode") {
                                                    const targetNode = nextNodeIfSuccess[0];
                                                    const randomId = Math.random()
                                                        .toString(36)
                                                        .substr(2, 25);
                                                    const roomName = "Room_" + randomId;
                                                    if (targetNode.data.mpcCallDistribustion ===
                                                        "RoundRobin") {
                                                        console.log("write the logic of round robin here ");
                                                        let dataFromVibconnect = req.body
                                                            ? req.body
                                                            : req.query;
                                                        const xml = await this.handleMultiPartyCallDistributionOfTypeRoundRobin(targetNode, dataFromVibconnect, id);
                                                        console.log("xml is : 5138 ", xml);
                                                        return res.send(xml);
                                                    }
                                                    if (targetNode.data.mpcCallDistribustion === "Parallel") {
                                                        console.log("Body : ", req.body);
                                                        console.log("Query : ", req.query);
                                                        let dataFromVibconnect = JSON.stringify(req.body) !== "{}"
                                                            ? req.body
                                                            : req.query;
                                                        const xml = await this.handleMultiPartyCallDistributionProcess(targetNode, dataFromVibconnect, id);
                                                        console.log("xml is 2978 : ", xml);
                                                        return res.send(xml);
                                                    }
                                                    else {
                                                        let Parent;
                                                        Parent = voice.dial({
                                                            action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/conference|${roomName}/${nextNodeIfSuccess[0].id}`,
                                                            method: "GET",
                                                        });
                                                        Parent.conference({
                                                            waitUrl: nextNodeIfSuccess[0].data.mpcAudio,
                                                            statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
                                                            statusCallbackEvent: "start end join leave mute hold",
                                                        }, `${roomName}`);
                                                        let url = "empty";
                                                        if (nextNodeIfSuccess[0].data.url) {
                                                            let fullUrl = nextNodeIfSuccess[0].data.url;
                                                            // let removedHttpsUrl = fullUrl.replace("https://vibtreedan.s3.amazonaws.com/public/","")
                                                            let removedHttpsUrl = fullUrl.split("public/");
                                                            url = removedHttpsUrl[1];
                                                        }
                                                        let timeOut = "60";
                                                        if (nextNodeIfSuccess[0].data.mpcCallUsingNumbers[0]) {
                                                            timeOut =
                                                                nextNodeIfSuccess[0].data.mpcCallUsingNumbers[0]
                                                                    .ringTimeOut;
                                                        }
                                                        let correctNumberArray;
                                                        if (nextNodeIfSuccess[0].data.mpcCallUsing === "User") {
                                                            console.log("this is not number this is user typ calling system");
                                                            let detailsOfNumbersFromUI = nextNodeIfSuccess[0].data.mpcCallUsingNumbers;
                                                            const numbersFromUerID = await this.extractAllNumberOfCorrespondingUser(detailsOfNumbersFromUI);
                                                            console.log("List of numbers from user : ", numbersFromUerID);
                                                            correctNumberArray = numbersFromUerID;
                                                        }
                                                        if (nextNodeIfSuccess[0].data.mpcCallUsing ===
                                                            "Number") {
                                                            correctNumberArray =
                                                                nextNodeIfSuccess[0].data.mpcCallUsingNumbers;
                                                        }
                                                        let From = req.body.To ? req.body.To : req.query.To;
                                                        if (nextNodeIfSuccess[0].data.callType === "default") {
                                                            From = "+912235315936";
                                                        }
                                                        console.log("Correct Number : ", correctNumberArray, nextNodeIfSuccess[0].data.mpcCallUsingNumbers);
                                                        //For Testing only
                                                        // Parent.conference({waitUrl : detailsOfTargetNode.data.mpcAudio , statusCallback :'https://dataneuronbackend.herokuapp.com/subscribers' , statusCallbackEvent : 'start end join leave mute hold' },`Room_${req.body.ParentCallSid}`)
                                                        const body = {
                                                            statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call`,
                                                            // "statusCallback":`https://dataneuronbackend.herokuapp.com/subscribers`, //For testing Only
                                                            statusCallbackEvent: "initiated, ringing, answered, completed",
                                                            Record: "true",
                                                            // "To": nextNodeIfSuccess[0].data.mpcCallUsingNumbers[0].number,
                                                            To: correctNumberArray[0].number,
                                                            From: From,
                                                            Timeout: timeOut,
                                                            Method: "GET",
                                                            // "Url" : `${conf.BaseUrl}/api/getConferenceRoom/Room_${req.body.ParentCallSid}/${url}`
                                                            Url: `${conf.BaseUrl}/api/checkIfCustomerInLine/${roomName}/${url}`,
                                                            recordingStatusCallback: `${conf.BaseUrl}/api//vibconnect/webhook/recordings`,
                                                            recordingStatusCallbackEvent: "in-progress, completed, absent",
                                                            recordingStatusCallbackMethod: "POST",
                                                            record: "true",
                                                        };
                                                        console.log("node credentials : ", nextNodeIfSuccess[0].data.authId, " : ", nextNodeIfSuccess[0].data.authSecret);
                                                        const call_details = await this.MakeConferenceCall(nextNodeIfSuccess[0].data.authId, nextNodeIfSuccess[0].data.authSecret, body);
                                                        const call_details_json = JSON.parse(call_details);
                                                        let parentCallSid = req.body.ParentCallSid
                                                            ? req.body.ParentCallSid
                                                            : roomName;
                                                        const data_required_to_filter_conference_details = {
                                                            AccountSid: req.body.AccountSid
                                                                ? req.body.AccountSid
                                                                : req.query.AccountSid,
                                                            ParentCallSid: req.body.ParentCallSid
                                                                ? req.body.ParentCallSid
                                                                : req.query.ParentCallSid,
                                                            ConferenceId: "",
                                                            CallSid: call_details_json.sid,
                                                            FriendlyName: roomName,
                                                            ChildCallSid: call_details_json.sid,
                                                            source: nextNodeIfSuccess[0].id,
                                                            id: id,
                                                            listOfChildCallSid: [call_details_json.sid],
                                                            whispherUrl: url,
                                                        };
                                                        console.log("data_required_to_filter_conference_details 2783 : ", data_required_to_filter_conference_details);
                                                        const conference = new ConferenceModel_1.default(data_required_to_filter_conference_details);
                                                        await conference.save();
                                                        let queryToSend = { ParentCallSid: parentCallSid };
                                                        let updateToSend = {
                                                            $set: {
                                                                CallSidOfConferenceChildCall: call_details_json.sid,
                                                            },
                                                        };
                                                        this.updateRealTimeDataOfIvrStudiousForApiCall(queryToSend, updateToSend);
                                                        console.log("xml is : ", voice.toString());
                                                        return res.send(voice.toString());
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            const nextNodeConnectedToBussinessHourNodeOff = connectors.filter((item) => {
                                                if (item.source === bussinessHourNodeId &&
                                                    item.sourceHandle == "businesshourOff") {
                                                    return item;
                                                }
                                            });
                                            console.log("is not between now : ", now, "start : ", start, "end : ", end);
                                            const nextNodeIfSuccess = data.input?.filter((item) => {
                                                if (item.id ===
                                                    nextNodeConnectedToBussinessHourNodeOff[0].target) {
                                                    return item;
                                                }
                                            });
                                            console.log("nextNodeIfSuccess : ", nextNodeIfSuccess);
                                            if (nextNodeIfSuccess[0].type === "ivrNode") {
                                                const nextNodeToAction = allNodes.filter((node) => {
                                                    if (node.source == nextNodeIfSuccess[0].id) {
                                                        return node;
                                                    }
                                                });
                                                if (nextNodeToAction.length > 0) {
                                                    let ParentGather;
                                                    let numDigits = nextNodeIfSuccess[0].data.inputLength
                                                        ? nextNodeIfSuccess[0].data.inputLength
                                                        : "1";
                                                    ParentGather = voice.gather({
                                                        action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNodeIfSuccess[0].id}/${target}`,
                                                        method: "POST",
                                                        numDigits: numDigits,
                                                    });
                                                    ParentGather.play({ loop: nextNodeIfSuccess[0].data.loop }, nextNodeIfSuccess[0].data.ivrAudioUrl);
                                                    voice.pause({
                                                        length: nextNodeIfSuccess[0].data.ivrPlayAudioPause,
                                                    });
                                                    console.log("xml is : ", voice.toString());
                                                    return res.send(voice.toString());
                                                }
                                                voice.play({ loop: nextNodeIfSuccess[0].data.loop }, nextNodeIfSuccess[0].data.ivrAudioUrl);
                                                voice.pause({
                                                    length: nextNodeIfSuccess[0].data.ivrPlayAudioPause,
                                                });
                                                console.log("xml is : ", voice.toString());
                                                return res.send(voice.toString());
                                            }
                                            if (nextNodeIfSuccess[0].type === "PlayAudioNode") {
                                                const newRealTime = new IvrStudiousRealTime_1.default({
                                                    ...req.query,
                                                    source: "Web",
                                                });
                                                await newRealTime.save();
                                                // const nextNode_for_action = connectors.filter((item : any)=>{
                                                //     if(item.source === nextNodeIfSuccess[0].id){
                                                //         return item
                                                //     }
                                                // })
                                                const nextNode_for_action_id = connectors.filter((item) => {
                                                    if (item.source === nextNodeIfSuccess[0].id) {
                                                        return item;
                                                    }
                                                });
                                                let nextNode_for_action_id_data = "hangup";
                                                if (nextNode_for_action_id.length > 0) {
                                                    nextNode_for_action_id_data =
                                                        nextNode_for_action_id[0].target;
                                                }
                                                // console.log("nextNode_for_action : ",nextNode_for_action_id_data)
                                                voice.play({
                                                    loop: nextNodeIfSuccess[0].data.loop,
                                                    digits: "wwww3",
                                                }, nextNodeIfSuccess[0].data.audioUrl);
                                                voice.pause({
                                                    length: nextNodeIfSuccess[0].data.playAudioPause,
                                                });
                                                voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/ivrstudios/convert/${id}/${nextNode_for_action_id_data}/${source}`);
                                                return res.send(voice.toString());
                                            }
                                            if (nextNodeIfSuccess[0].type === "MultiPartyCallNode") {
                                                const targetNode = nextNodeIfSuccess[0];
                                                const randomId = Math.random()
                                                    .toString(36)
                                                    .substr(2, 25);
                                                const roomName = "Room_" + randomId;
                                                if (targetNode.data.mpcCallDistribustion === "RoundRobin") {
                                                    console.log("write the logic of round robin here ");
                                                    let dataFromVibconnect = JSON.stringify(req.body) !== "{}"
                                                        ? req.body
                                                        : req.query;
                                                    const xml = await this.handleMultiPartyCallDistributionOfTypeRoundRobin(targetNode, dataFromVibconnect, id);
                                                    console.log("xml is : 5138 ", xml);
                                                    return res.send(xml);
                                                }
                                                if (targetNode.data.mpcCallDistribustion === "Parallel") {
                                                    let dataFromVibconnect = JSON.stringify(req.body) !== "{}"
                                                        ? req.body
                                                        : req.query;
                                                    const xml = await this.handleMultiPartyCallDistributionProcess(targetNode, dataFromVibconnect, id);
                                                    console.log("xml is 2978 : ", xml);
                                                    return res.send(xml);
                                                }
                                                else {
                                                    let Parent;
                                                    Parent = voice.dial({
                                                        action: `${conf.BaseUrl}/api/ivrstudios/convert/${id}/conference|${roomName}/${nextNodeIfSuccess[0].id}`,
                                                        method: "GET",
                                                    });
                                                    Parent.conference({
                                                        waitUrl: nextNodeIfSuccess[0].data.mpcAudio,
                                                        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
                                                        statusCallbackEvent: "start end join leave mute hold",
                                                    }, `${roomName}`);
                                                    let url = "empty";
                                                    if (nextNodeIfSuccess[0].data.url) {
                                                        let fullUrl = nextNodeIfSuccess[0].data.url;
                                                        // let removedHttpsUrl = fullUrl.replace("https://vibtreedan.s3.amazonaws.com/public/","")
                                                        let removedHttpsUrl = fullUrl.split("public/");
                                                        url = removedHttpsUrl[1];
                                                    }
                                                    let timeOut = "60";
                                                    if (nextNodeIfSuccess[0].data.mpcCallUsingNumbers[0]) {
                                                        timeOut =
                                                            nextNodeIfSuccess[0].data.mpcCallUsingNumbers[0]
                                                                .ringTimeOut;
                                                    }
                                                    let correctNumberArray;
                                                    if (nextNodeIfSuccess[0].data.mpcCallUsing === "User") {
                                                        console.log("this is not number this is user typ calling system");
                                                        let detailsOfNumbersFromUI = nextNodeIfSuccess[0].data.mpcCallUsingNumbers;
                                                        const numbersFromUerID = await this.extractAllNumberOfCorrespondingUser(detailsOfNumbersFromUI);
                                                        console.log("List of numbers from user : ", numbersFromUerID);
                                                        correctNumberArray = numbersFromUerID;
                                                    }
                                                    if (nextNodeIfSuccess[0].data.mpcCallUsing === "Number") {
                                                        correctNumberArray =
                                                            nextNodeIfSuccess[0].data.mpcCallUsingNumbers;
                                                    }
                                                    let From = req.body.To ? req.body.To : req.query.To;
                                                    if (nextNodeIfSuccess[0].data.callType === "default") {
                                                        From = "+912235315936";
                                                    }
                                                    console.log("Correct Number : ", correctNumberArray, nextNodeIfSuccess[0].data.mpcCallUsingNumbers);
                                                    //For Testing only
                                                    // Parent.conference({waitUrl : detailsOfTargetNode.data.mpcAudio , statusCallback :'https://dataneuronbackend.herokuapp.com/subscribers' , statusCallbackEvent : 'start end join leave mute hold' },`Room_${req.body.ParentCallSid}`)
                                                    const body = {
                                                        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call`,
                                                        // "statusCallback":`https://dataneuronbackend.herokuapp.com/subscribers`, //For testing Only
                                                        statusCallbackEvent: "initiated, ringing, answered, completed",
                                                        Record: "true",
                                                        // "To": nextNodeIfSuccess[0].data.mpcCallUsingNumbers[0].number,
                                                        To: correctNumberArray[0].number,
                                                        From: From,
                                                        Timeout: timeOut,
                                                        Method: "GET",
                                                        // "Url" : `${conf.BaseUrl}/api/getConferenceRoom/Room_${req.body.ParentCallSid}/${url}`
                                                        Url: `${conf.BaseUrl}/api/checkIfCustomerInLine/${roomName}/${url}`,
                                                        recordingStatusCallback: `${conf.BaseUrl}/api//vibconnect/webhook/recordings`,
                                                        recordingStatusCallbackEvent: "in-progress, completed, absent",
                                                        recordingStatusCallbackMethod: "POST",
                                                        record: "true",
                                                    };
                                                    console.log("node credentials : ", nextNodeIfSuccess[0].data.authId, " : ", nextNodeIfSuccess[0].data.authSecret);
                                                    const call_details = await this.MakeConferenceCall(nextNodeIfSuccess[0].data.authId, nextNodeIfSuccess[0].data.authSecret, body);
                                                    const call_details_json = JSON.parse(call_details);
                                                    let parentCallSid = req.body.ParentCallSid
                                                        ? req.body.ParentCallSid
                                                        : req.query.ParentCallSid;
                                                    const data_required_to_filter_conference_details = {
                                                        AccountSid: req.body.AccountSid
                                                            ? req.body.AccountSid
                                                            : req.query.AccountSid,
                                                        ParentCallSid: req.body.ParentCallSid
                                                            ? req.body.ParentCallSid
                                                            : req.query.ParentCallSid,
                                                        ConferenceId: "",
                                                        CallSid: call_details_json.sid,
                                                        FriendlyName: `${roomName}`,
                                                        ChildCallSid: call_details_json.sid,
                                                        source: nextNodeIfSuccess[0].id,
                                                        id: id,
                                                        listOfChildCallSid: [call_details_json.sid],
                                                        whispherUrl: url,
                                                    };
                                                    console.log("data_required_to_filter_conference_details 2783 : ", data_required_to_filter_conference_details);
                                                    const conference = new ConferenceModel_1.default(data_required_to_filter_conference_details);
                                                    await conference.save();
                                                    let queryToSend = { ParentCallSid: parentCallSid };
                                                    let updateToSend = {
                                                        $set: {
                                                            CallSidOfConferenceChildCall: call_details_json.sid,
                                                        },
                                                    };
                                                    this.updateRealTimeDataOfIvrStudiousForApiCall(queryToSend, updateToSend);
                                                    console.log("xml is : ", voice.toString());
                                                    return res.send(voice.toString());
                                                }
                                            }
                                        }
                                        // console.log("currentTime : ",currentTime , now)
                                        // console.log("now : ", now)
                                        // console.log("start : ",start )
                                        // console.log("end : ",end )
                                        // console.log("currentDay : ",currentDay)
                                    }
                                }
                            }
                        }
                    }
                }
                console.log("xml is : ", voice.toString());
                return res.send(voice.toString());
            }
        }
        catch (error) {
            this.message = error.message;
            this.code = 200;
            this.status = false;
            this.data = [];
            defaultVri.say(error.message);
        }
        return res.send(defaultVri.toString());
    }
}
exports.default = IvrStudiosController;
//# sourceMappingURL=IvrStudiosControllers.js.map