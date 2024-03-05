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
exports.generateXMLForStickyAgentNode = exports.makeCallToAssignedAgent = exports.checkIsAgentIsAssignedToCustomer = exports.getOrCreateContact = exports.generateXmlForMessage = exports.generateXmlForMultiPartyCallNode = exports.generateXmlForIvrNode = exports.generateXmlForPlayNode = void 0;
const VoiceResponse_1 = __importDefault(require("twilio/lib/twiml/VoiceResponse"));
const conf = __importStar(require("../config/index"));
const logger_1 = __importDefault(require("../config/logger"));
const UserPermissionUserModel_1 = __importDefault(require("../models/UserPermissionUserModel"));
const index_1 = __importDefault(require("../services/Vibconnect/index"));
const ConferenceModel_1 = __importDefault(require("../models/ConferenceModel"));
const IvrStudiousRealTime_1 = __importDefault(require("../models/IvrStudiousRealTime"));
const ivrFlowUIModel_1 = __importDefault(require("../models/ivrFlowUIModel"));
const ivrStudiosModelCallBacks_1 = __importDefault(require("../models/ivrStudiosModelCallBacks"));
const smsModel_1 = __importDefault(require("../models/smsModel"));
const { contactModel } = require("../models/ContactsModel");
function generateXmlForPlayNode(id, source, target, data) {
    const voice = new VoiceResponse_1.default();
    try {
        voice.play({ loop: data.loop, digits: "wwwww3" }, data.audioUrl);
        voice.pause({ length: data.playAudioPause });
        voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/v2/ivrstudios/convert/${id}/${target}/${source}`);
        let xml = voice.toString();
        logger_1.default.info(xml);
        return xml;
    }
    catch (err) {
        voice.say(err.message);
        const xml = voice.toString();
        logger_1.default.error(xml);
        return xml;
    }
}
exports.generateXmlForPlayNode = generateXmlForPlayNode;
function generateXmlForIvrNode(id, source, target, data) {
    const voice = new VoiceResponse_1.default();
    try {
        const numDigits = data.inputLength ? data.inputLength : "1";
        let Parent;
        Parent = voice.gather({
            action: `${conf.BaseUrl}/api/v2/ivrstudios/convert/${id}/${source}/${target}`,
            method: "POST",
            numDigits: numDigits,
        });
        if (data.ivrAudioUrl) {
            Parent.play({ loop: data.loop }, data.ivrAudioUrl);
            voice.pause({ length: data.ivrPlayAudioPause });
        }
        const xml = voice.toString();
        logger_1.default.info(xml);
        return xml;
    }
    catch (err) {
        voice.say(err.message);
        let xml = voice.toString();
        logger_1.default.error(xml);
        return xml;
    }
}
exports.generateXmlForIvrNode = generateXmlForIvrNode;
function checkTheNumberContainsSymbolOrNOT(number) {
    number = decodeURIComponent(number);
    if (number.includes("+")) {
        return number.replace(/[^0-9]/g, "");
    }
    return number;
}
function correctFormatOfCloudNumberAccordingToState(cloudNumber) {
    cloudNumber = cloudNumber.slice(-12);
    if (cloudNumber.includes("223531")) {
        return `+${cloudNumber}`;
    }
    else if (cloudNumber.includes("336811")) {
        return `${cloudNumber}`;
    }
    else if (cloudNumber.includes("806937")) {
        return `+${cloudNumber}`;
    }
    else {
        return cloudNumber;
    }
}
async function extractAllNumberOfCorrespondingUser(detailsOfNumbersFromUI) {
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
}
async function extractAllSipOfCorrespondingUser(detailsOfNumbersFromUI) {
    console.log("this is the details of call extract numbers using this : ", detailsOfNumbersFromUI);
    let x = Promise.all(detailsOfNumbersFromUI.map(async (val) => {
        const detailsOfUser = await UserPermissionUserModel_1.default.findOne({
            _id: val.userId,
        });
        let tempObj = {
            number: detailsOfUser.sip_user,
            ringTimeOut: val.ringTimeOut,
        };
        return await tempObj;
    }));
    //  console.log("numbers of users : " , await x);
    return await x;
}
async function updateRealTimeDataOfIvrStudiousForApiCall(query, updates) {
    try {
        await IvrStudiousRealTime_1.default.findOneAndUpdate(query, updates);
    }
    catch (err) {
        logger_1.default.error(err);
    }
}
async function handleMultiPartyCallDistributionOfTypePriority(id, source, target, data, dataFromVibconnect) {
    const voice = new VoiceResponse_1.default();
    if (!data.authId || !data.authSecret) {
        logger_1.default.error("No Auth ID or Auth Secret is present : " + JSON.stringify(dataFromVibconnect));
        voice.hangup();
        let xml = voice.toString();
        return xml;
    }
    let Parent;
    Parent = voice.dial({
        action: `${conf.BaseUrl}/api/v2/ivrstudios/convert/${id}/conference|Room_${dataFromVibconnect.ParentCallSid}/${target}`,
        method: "GET",
    });
    Parent.conference({
        waitUrl: data.mpcAudio,
        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
        statusCallbackEvent: "start end join leave mute hold",
    }, `Room_${dataFromVibconnect.ParentCallSid}`);
    let timeOut = "60";
    let To;
    let purchasedNumber;
    let correctNumberArray;
    let url = "empty";
    if (data.mpcCallUsingNumbers.length > 0) {
        timeOut = data.mpcCallUsingNumbers[0].ringTimeOut;
        To = data.mpcCallUsingNumbers[0].number;
    }
    const cloudNumber = dataFromVibconnect.To;
    purchasedNumber = checkTheNumberContainsSymbolOrNOT(cloudNumber);
    purchasedNumber = correctFormatOfCloudNumberAccordingToState(purchasedNumber);
    if (data.mpcCallUsing.toLowerCase() === "user") {
        //without dialing pattern
        // const numbersFromUerID = await extractAllNumberOfCorrespondingUser(
        //   data.mpcCallUsingNumbers
        // );
        // correctNumberArray = numbersFromUerID;
        let dialingPattern = "number";
        if (data) {
            if (data.dialingPattern) {
                dialingPattern = data.dialingPattern;
            }
        }
        if (dialingPattern === "number") {
            const numbersFromUerID = await extractAllNumberOfCorrespondingUser(data.mpcCallUsingNumbers);
            console.log("List of numbers from user : ", numbersFromUerID);
            correctNumberArray = numbersFromUerID;
        }
        else if (dialingPattern === "sip") {
            console.log("Dialing Pattern is Sip fetch sip user");
            const numbersFromUerID = await extractAllSipOfCorrespondingUser(data.mpcCallUsingNumbers);
            console.log("List of sip from user : ", numbersFromUerID);
            correctNumberArray = numbersFromUerID;
        }
    }
    if (data.mpcCallUsing.toLowerCase() === "number") {
        correctNumberArray = data.mpcCallUsingNumbers;
    }
    if (data.url) {
        let fullUrl = data.url;
        let removedHttpsUrl = fullUrl.split("public/");
        url = removedHttpsUrl[1];
    }
    if (data.SendDigits) {
        url = `SendDigits|${data.SendDigits}`;
    }
    // we will write condition based on realtime checking in DB thats why extra decleration is here
    const nextNumberIfbusy = correctNumberArray[0]
        ? correctNumberArray[0].number
        : "";
    To = nextNumberIfbusy;
    const sendDigitsObj = data.SendDigits ? { "SendDigits": data.SendDigits } : {};
    const body = {
        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call`,
        statusCallbackEvent: "initiated, ringing, answered, completed",
        Record: "true",
        To: To,
        From: purchasedNumber,
        Timeout: timeOut,
        Method: "GET",
        Url: `${conf.BaseUrl}/api/checkIfCustomerInLine/Room_${dataFromVibconnect.ParentCallSid}/${url}`,
        recordingStatusCallback: `${conf.BaseUrl}/api/vibconnect/webhook/recordings`,
        recordingStatusCallbackEvent: "in-progress, completed, absent",
        recordingStatusCallbackMethod: "POST",
        record: "true",
        ...sendDigitsObj
    };
    const vibconnect = new index_1.default();
    const call_details = await vibconnect.makeCall(data.authId ? data.authId : dataFromVibconnect.AccountSid, data.authSecret, body);
    if (call_details.length === 0) {
        voice.hangup();
        let xml = voice.toString();
        return xml;
    }
    console.log("call details from vibconnect : ", typeof call_details, call_details);
    logger_1.default.info("call details from vibconnect : ", typeof call_details, call_details);
    const call_details_json = JSON.parse(call_details);
    const data_required_to_filter_conference_details = {
        AccountSid: dataFromVibconnect.AccountSid,
        ParentCallSid: dataFromVibconnect.ParentCallSid,
        ConferenceId: "",
        CallSid: call_details_json.sid,
        FriendlyName: `Room_${dataFromVibconnect.ParentCallSid}`,
        ChildCallSid: call_details_json.sid,
        source: target,
        id: id,
        listOfChildCallSid: [call_details_json.sid],
        whispherUrl: url,
    };
    const conference = new ConferenceModel_1.default(data_required_to_filter_conference_details);
    await conference.save();
    let queryToSend = { ParentCallSid: dataFromVibconnect.ParentCallSid };
    let updateToSend = {
        $set: { CallSidOfConferenceChildCall: call_details_json.sid },
    };
    updateRealTimeDataOfIvrStudiousForApiCall(queryToSend, updateToSend);
    let xml = voice.toString();
    logger_1.default.info("xml is : " + xml);
    return xml;
}
async function handleMultiPartyCallDistributionProcess(id, source, target, targetNode, dataFromVibconnect) {
    const voice = new VoiceResponse_1.default();
    logger_1.default.info(`call type is parallel : ${targetNode} :::: details receive from vibconnect : ${dataFromVibconnect}`);
    try {
        //send customer in conference
        let Parent;
        Parent = voice.dial({
            action: `${conf.BaseUrl}/api/v2/ivrstudios/convert/${id}/conference|Room_${dataFromVibconnect.ParentCallSid}/${source}`,
            method: "GET",
        });
        Parent.conference({
            waitUrl: targetNode.mpcAudio,
            statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
            statusCallbackEvent: "start end join leave mute hold",
        }, `Room_${dataFromVibconnect.ParentCallSid}`);
        //send Api request of call to every agent
        let purchasedNumber = dataFromVibconnect.To;
        purchasedNumber = checkTheNumberContainsSymbolOrNOT(dataFromVibconnect.To);
        if (purchasedNumber.includes("223531")) {
            purchasedNumber = "+" + purchasedNumber;
        }
        let url = "empty";
        if (targetNode.url) {
            let fullUrl = targetNode.url;
            let removedHttpsUrl = fullUrl.split("public/");
            url = removedHttpsUrl[1];
        }
        let callSidOfAgents = [];
        if (targetNode.mpcCallUsing === "User") {
            let detailsOfNumbersFromUI = targetNode.mpcCallUsingNumbers;
            const numbersFromUerID = await extractAllNumberOfCorrespondingUser(detailsOfNumbersFromUI);
            logger_1.default.info(`list of number if customer select call using User : ${numbersFromUerID}`);
            const sendDigitsObj = targetNode.SendDigits ? { "SendDigits": targetNode.SendDigits } : {};
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
                    ...sendDigitsObj
                };
                console.log("node credentials : ", targetNode.authId, " : ", targetNode.authSecret);
                const vibconnect = new index_1.default();
                const call_details = await vibconnect.makeCall(targetNode.authId, targetNode.authSecret, body);
                const callDetailsJson = JSON.parse(call_details);
                callSidOfAgents = [...callSidOfAgents, callDetailsJson.sid];
            }));
        }
        const sendDigitsObj = targetNode.SendDigits ? { "SendDigits": targetNode.SendDigits } : {};
        if (targetNode.mpcCallUsing === "Number") {
            await Promise.all(targetNode.mpcCallUsingNumbers.map(async (number) => {
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
                    ...sendDigitsObj
                };
                console.log("node credentials : ", targetNode.authId, " : ", targetNode.authSecret);
                const vibconnect = new index_1.default();
                const call_details = await vibconnect.makeCall(targetNode.authId, targetNode.authSecret, body);
                const callDetailsJson = JSON.parse(call_details);
                callSidOfAgents = [...callSidOfAgents, callDetailsJson.sid];
            }));
        }
        const data_required_to_filter_conference_details = {
            AccountSid: dataFromVibconnect.AccountSid,
            ParentCallSid: dataFromVibconnect.ParentCallSid,
            ConferenceId: "",
            FriendlyName: `Room_${dataFromVibconnect.ParentCallSid}`,
            source: source,
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
}
async function handleMultiPartyCallDistributionOfTypeRoundRobin(id, source, target, targetNode, dataFromVibconnect) {
    const voice = new VoiceResponse_1.default();
    try {
        let numbersArray;
        let lastCalledNumber;
        let To = targetNode.mpcCallUsingNumbers[0].number;
        let From = dataFromVibconnect.To;
        let timeOut = "60";
        let url = "empty";
        if (targetNode.url) {
            let fullUrl = targetNode.url;
            let removedHttpsUrl = fullUrl.split("public/");
            url = removedHttpsUrl[1];
        }
        if (targetNode.mpcCallUsingNumbers[0]) {
            timeOut = targetNode.mpcCallUsingNumbers[0].ringTimeOut;
        }
        if (targetNode.mpcCallUsing === "User") {
            let detailsOfNumbersFromUI = targetNode.mpcCallUsingNumbers;
            const numbersFromUerID = await extractAllNumberOfCorrespondingUser(detailsOfNumbersFromUI);
            numbersArray = numbersFromUerID;
        }
        if (targetNode.mpcCallUsing === "Number") {
            numbersArray = targetNode.mpcCallUsingNumbers;
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
        To = nextNumberIfbusy;
        const sendDigitsObj = targetNode.SendDigits ? { "SendDigits": targetNode.SendDigits } : {};
        const body = {
            statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call`,
            statusCallbackEvent: "initiated, ringing, answered, completed",
            Record: "true",
            To: To,
            From: From,
            Timeout: timeOut,
            Method: "GET",
            Url: `${conf.BaseUrl}/api/getConferenceRoom/Room_${dataFromVibconnect.ParentCallSid}/${url}`,
            callDistributionType: "RoundRobin",
            recordingStatusCallback: `${conf.BaseUrl}/api/vibconnect/webhook/recordings`,
            recordingStatusCallbackEvent: "in-progress, completed, absent",
            recordingStatusCallbackMethod: "POST",
            record: "true",
            ...sendDigitsObj
        };
        const vibconnect = new index_1.default();
        const call_details = await vibconnect.makeCall(targetNode.authId, targetNode.authSecret, body);
        const call_details_json = JSON.parse(call_details);
        const data_required_to_filter_conference_details = {
            AccountSid: dataFromVibconnect.AccountSid,
            ParentCallSid: dataFromVibconnect.ParentCallSid,
            ConferenceId: "",
            CallSid: call_details_json.sid,
            FriendlyName: `Room_${dataFromVibconnect.ParentCallSid}`,
            ChildCallSid: call_details_json.sid,
            source: source,
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
        updateRealTimeDataOfIvrStudiousForApiCall(queryToSend, updateToSend);
        let Parent;
        Parent = voice.dial({
            action: `${conf.BaseUrl}/api/v2/ivrstudios/convert/${id}/conference|Room_${dataFromVibconnect.ParentCallSid}/${source}`,
            method: "GET",
        });
        Parent.conference({
            waitUrl: targetNode.mpcAudio,
            statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
            statusCallbackEvent: "start end join leave mute hold",
        }, `Room_${dataFromVibconnect.ParentCallSid}`);
        let xml = voice.toString();
        logger_1.default.info("xml is : " + xml);
        return xml;
    }
    catch (error) {
        voice.say(error.message);
        let xml = voice.toString();
        return xml;
    }
}
//need proper testing only tested with cloud number node not in gather just in first level
async function generateXmlForMultiPartyCallNode(id, source, target, data, dataFromVibconnect) {
    const voice = new VoiceResponse_1.default();
    try {
        if (data.mpcCallDistribustion.toLowerCase() === "priority") {
            const xml = await handleMultiPartyCallDistributionOfTypePriority(id, source, target, data, dataFromVibconnect);
            return xml;
        }
        else if (data.mpcCallDistribustion.toLowerCase() === "parallel") {
            const xml = await handleMultiPartyCallDistributionProcess(id, source, target, data, dataFromVibconnect);
            return xml;
        }
        else if (data.mpcCallDistribustion.toLowerCase() === "roundrobin") {
            const xml = await handleMultiPartyCallDistributionOfTypeRoundRobin(id, source, target, data, dataFromVibconnect);
            return xml;
        }
    }
    catch (err) {
        voice.say(err.message);
        let xml = voice.toString();
        logger_1.default.error(xml);
        return xml;
    }
}
exports.generateXmlForMultiPartyCallNode = generateXmlForMultiPartyCallNode;
async function generateXmlForMessage(data, dataFromVibconnect) {
    const voice = new VoiceResponse_1.default();
    try {
        if (!data.AuthId || !data.AuthSecret)
            return voice.say("Check Flow").toString();
        let value = data;
        let ParentCallSid = dataFromVibconnect.ParentCallSid;
        const customerVariablesDetails = await IvrStudiousRealTime_1.default.findOne({
            ParentCallSid: ParentCallSid,
        });
        let dataBaseVariables = {};
        if (customerVariablesDetails) {
            const tempObj = customerVariablesDetails.variables.map((variable) => {
                const stringObj = `{"${variable.key}":"${variable.value}"}`;
                return JSON.parse(stringObj);
            });
            const a = tempObj.reduce((acc, obj) => Object.assign(acc, obj), {});
            dataBaseVariables = a;
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
                return Obj2[matched];
            });
            // console.log("x : ",x)
            const y = x.replace(/\[/g, "").replace(/\]/g, "").replace(/\#/g, ""); //value of string after replacing [] from the messageBody
            if (value.carrierType.toLowerCase() === "domestic") {
                Promise.all(value.toNumbers.map(async (to) => {
                    console.log("to : ", to);
                    const correctFormatOfCustomerNumber = checkTheNumberContainsSymbolOrNOT(to.number);
                    const only10DigitsOfNumber = correctFormatOfCustomerNumber
                        ? correctFormatOfCustomerNumber.slice(-10)
                        : "";
                    const payloadForMessage = {
                        From: value.senderId,
                        To: `+91${only10DigitsOfNumber}`,
                        PEId: value.peId,
                        TemplateId: value.templateId,
                        Body: y,
                        StatusCallback: `${process.env.BASE_URL}/api/webhook/vibconnect/message`,
                        StatusCallbackMethod: "queued, failed , sent , delivered ,undelivered",
                    };
                    const vibconnect = new index_1.default();
                    const string_result = await vibconnect.sendMessage(value.AuthId, value.AuthSecret, payloadForMessage);
                    const json_result = JSON.parse(string_result);
                    const sms_data = new smsModel_1.default(json_result);
                    await sms_data.save();
                }));
            }
            if (value.carrierType.toLowerCase() === "international") {
                Promise.all(value.toNumbers.map(async (to) => {
                    // console.log("to : ",to)
                    const correctFormatOfCustomerNumber = checkTheNumberContainsSymbolOrNOT(to.number);
                    const only10DigitsOfNumber = correctFormatOfCustomerNumber
                        ? correctFormatOfCustomerNumber.slice(-10)
                        : "";
                    const payloadForMessage = {
                        From: value.senderId,
                        To: `+91${only10DigitsOfNumber}`,
                        PEId: value.peId,
                        TemplateId: value.templateId,
                        Body: y,
                        StatusCallback: `${process.env.BASE_URL}/api/webhook/vibconnect/message`,
                        StatusCallbackMethod: "queued, failed , sent , delivered ,undelivered",
                    };
                    const vibconnect = new index_1.default();
                    const string_result = await vibconnect.sendMessage(value.AuthId, value.AuthSecret, payloadForMessage);
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
                // const string_result: any = await this.sendMessageToDomestic(
                //   value.AuthId,
                //   value.AuthSecret,
                //   value.senderId,
                //   value.peId,
                //   value.templateId,
                //   y,
                //   removed_sip
                // );
                const correctFormatOfCustomerNumber = checkTheNumberContainsSymbolOrNOT(removed_sip);
                const only10DigitsOfNumber = correctFormatOfCustomerNumber
                    ? correctFormatOfCustomerNumber.slice(-10)
                    : "";
                const payloadForMessage = {
                    From: value.senderId,
                    To: `+91${only10DigitsOfNumber}`,
                    PEId: value.peId,
                    TemplateId: value.templateId,
                    Body: y,
                    StatusCallback: `${process.env.BASE_URL}/api/webhook/vibconnect/message`,
                    StatusCallbackMethod: "queued, failed , sent , delivered ,undelivered",
                };
                const vibconnect = new index_1.default();
                const string_result = await vibconnect.sendMessage(value.AuthId, value.AuthSecret, payloadForMessage);
                const json_result = JSON.parse(string_result);
                const sms_data = new smsModel_1.default(json_result);
                await sms_data.save();
            }
            if (value.carrierType.toLowerCase() === "international") {
                // const string_result: any = await this.sendCompletedMessageThree(
                //   value.AuthId,
                //   value.AuthSecret,
                //   value.senderId,
                //   value.peId,
                //   y,
                //   removed_sip
                // );
                const correctFormatOfCustomerNumber = checkTheNumberContainsSymbolOrNOT(removed_sip);
                const only10DigitsOfNumber = correctFormatOfCustomerNumber
                    ? correctFormatOfCustomerNumber.slice(-10)
                    : "";
                const payloadForMessage = {
                    From: value.senderId,
                    To: `+91${only10DigitsOfNumber}`,
                    PEId: value.peId,
                    TemplateId: value.templateId,
                    Body: y,
                    StatusCallback: `${process.env.BASE_URL}/api/webhook/vibconnect/message`,
                    StatusCallbackMethod: "queued, failed , sent , delivered ,undelivered",
                };
                const vibconnect = new index_1.default();
                const string_result = await vibconnect.sendMessage(value.AuthId, value.AuthSecret, payloadForMessage);
                const json_result = JSON.parse(string_result);
                const sms_data = new smsModel_1.default(json_result);
                await sms_data.save();
            }
        }
        voice.hangup();
        let xml = voice.toString();
        return xml;
    }
    catch (err) {
        voice.say(err.message);
        let xml = voice.toString();
        logger_1.default.error(xml);
        return xml;
    }
}
exports.generateXmlForMessage = generateXmlForMessage;
async function getOrCreateContact(data) {
    const direction = data.Direction;
    const contact = data.Caller;
    if (direction === "inbound") {
        const queryToFindContact = {
            AccountSid: data.AccountSid,
            phoneNumber: { $regex: contact.slice(-10), $options: "i" },
        };
        contactModel
            .findOne(queryToFindContact, { phoneNumber: 1, AccountSid: 1 })
            .sort({ _id: -1 })
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
}
exports.getOrCreateContact = getOrCreateContact;
async function checkIsAgentIsAssignedToCustomer(customer, authId) {
    const queryToFindContact = {
        AccountSid: authId,
        phoneNumber: { $regex: customer.slice(-10), $options: "i" },
    };
    console.log("queryToFindContact : ", queryToFindContact);
    const contactDetails = await contactModel
        .findOne(queryToFindContact, {
        AccountSid: 1,
        phoneNumber: 1,
        AssignUser: 1,
    })
        .sort({ _id: -1 })
        .populate("AssignTo", "phone auth_id");
    console.log("Contact Details found if Sticky : ", contactDetails);
    if (contactDetails.AssignUser) {
        if (contactDetails.AssignUser === "") {
            return { status: false, data: {} };
        }
        if (contactDetails.AssignUser.toLowerCase() === "all") {
            return { status: false, data: {} };
        }
        return { status: true, data: contactDetails };
    }
    return { status: false, data: {} };
}
exports.checkIsAgentIsAssignedToCustomer = checkIsAgentIsAssignedToCustomer;
async function makeCallToAssignedAgent(id, source, target, data, dataFromVibconnect, assignedTo) {
    const voice = new VoiceResponse_1.default();
    let Parent;
    Parent = voice.dial({
        action: `${conf.BaseUrl}/api/v2/ivrstudios/convert/${id}/conference|Room_${dataFromVibconnect.ParentCallSid}/${source}`,
        method: "GET",
    });
    Parent.conference({
        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
        statusCallbackEvent: "start end join leave mute hold",
    }, `Room_${dataFromVibconnect.ParentCallSid}`);
    let timeOut = "60";
    let purchasedNumber;
    let url = "empty";
    const cloudNumber = dataFromVibconnect.To;
    purchasedNumber = checkTheNumberContainsSymbolOrNOT(cloudNumber);
    purchasedNumber = correctFormatOfCloudNumberAccordingToState(purchasedNumber);
    const sendDigitsObj = data.SendDigits ? { "SendDigits": data.SendDigits } : {};
    const body = {
        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call`,
        statusCallbackEvent: "initiated, ringing, answered, completed",
        Record: "true",
        To: assignedTo,
        From: purchasedNumber,
        Timeout: timeOut,
        Method: "GET",
        Url: `${conf.BaseUrl}/api/checkIfCustomerInLine/Room_${dataFromVibconnect.ParentCallSid}/${url}`,
        recordingStatusCallback: `${conf.BaseUrl}/api/vibconnect/webhook/recordings`,
        recordingStatusCallbackEvent: "in-progress, completed, absent",
        recordingStatusCallbackMethod: "POST",
        record: "true",
        ...sendDigitsObj
    };
    const vibconnect = new index_1.default();
    const call_details = await vibconnect.makeCall(data.authId, data.authSecret, body);
    logger_1.default.info("call details from vibconnect : " + call_details);
    const call_details_json = JSON.parse(call_details);
    const data_required_to_filter_conference_details = {
        AccountSid: dataFromVibconnect.AccountSid,
        ParentCallSid: dataFromVibconnect.ParentCallSid,
        ConferenceId: "",
        CallSid: call_details_json.sid,
        FriendlyName: `Room_${dataFromVibconnect.ParentCallSid}`,
        ChildCallSid: call_details_json.sid,
        source: source,
        id: id,
        listOfChildCallSid: [call_details_json.sid],
        whispherUrl: url,
    };
    const conference = new ConferenceModel_1.default(data_required_to_filter_conference_details);
    await conference.save();
    let queryToSend = { ParentCallSid: dataFromVibconnect.ParentCallSid };
    let updateToSend = {
        $set: { CallSidOfConferenceChildCall: call_details_json.sid },
    };
    updateRealTimeDataOfIvrStudiousForApiCall(queryToSend, updateToSend);
    let xml = voice.toString();
    logger_1.default.info("xml is : " + xml);
    return xml;
}
exports.makeCallToAssignedAgent = makeCallToAssignedAgent;
async function generateXMLForStickyAgentNode(id, source, target, data, dataFromVibconnect, connectors) {
    const voice = new VoiceResponse_1.default();
    try {
        const isAssignedToUser = await checkIsAgentIsAssignedToCustomer(dataFromVibconnect.Caller, dataFromVibconnect.AccountSid);
        let xml;
        if (isAssignedToUser.status) {
            logger_1.default.info("this contact is assigned to user this is the details of user" +
                isAssignedToUser.data);
            // console.log("is assigned user : ", isAssignedToUser)
            const xml = makeCallToAssignedAgent(id, source, target, data, dataFromVibconnect, isAssignedToUser.data.AssignTo.phone);
            return xml;
        }
        if (!isAssignedToUser.status) {
            logger_1.default.info("No User is assigned");
            const currentNodeId = source;
            const nextNodeIdIfFailed = connectors.find((node) => {
                if (node.source === currentNodeId &&
                    node.sourceHandle === "tickyAgentFailed") {
                    return node;
                }
                return false;
            });
            if (nextNodeIdIfFailed) {
                voice.redirect({ method: "GET" }, `${conf.BaseUrl}/api/v2/ivrstudios/convert/${id}/${nextNodeIdIfFailed.target}/${nextNodeIdIfFailed.source}`);
                xml = voice.toString();
                logger_1.default.info("xml is : " + xml);
                return xml;
            }
            xml = voice.hangup();
            logger_1.default.info("xml is something went wrong : " + xml);
            return xml;
        }
    }
    catch (err) {
        voice.say(err.message);
        let xml = voice.toString();
        logger_1.default.error(xml);
        return xml;
    }
}
exports.generateXMLForStickyAgentNode = generateXMLForStickyAgentNode;
//# sourceMappingURL=callXmlGenerator.js.map