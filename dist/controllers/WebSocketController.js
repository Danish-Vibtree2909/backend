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
const conf = __importStar(require("../config/index"));
const request_1 = __importDefault(require("request"));
const UserPermissionUserModel_1 = __importDefault(require("../models/UserPermissionUserModel"));
const ivrStudiosModelCallBacks_1 = __importDefault(require("../models/ivrStudiosModelCallBacks"));
const smsModel_1 = __importDefault(require("../models/smsModel"));
const ConferenceModel_1 = __importDefault(require("../models/ConferenceModel"));
const ConferenceCallBacksModel_1 = __importDefault(require("../models/ConferenceCallBacksModel"));
const ivrFlowUIModel_1 = __importDefault(require("../models/ivrFlowUIModel"));
const IvrStudiousRealTime_1 = __importDefault(require("../models/IvrStudiousRealTime"));
const moment_1 = __importDefault(require("moment"));
const ivrFlowModel_1 = __importDefault(require("../models/ivrFlowModel"));
const VoiceMailRecordModel_1 = __importDefault(require("../models/VoiceMailRecordModel"));
const numbers_1 = __importDefault(require("../models/numbers"));
const CallRecordingsCallbacksModel_1 = __importDefault(require("../models/CallRecordingsCallbacksModel"));
const { contactModel } = require("../models/ContactsModel");
const TicketListModel_1 = __importDefault(require("../models/TicketListModel"));
const StoreModel_1 = __importDefault(require("../models/StoreModel"));
const index_1 = require("../helper/index");
const TicketListControllers_1 = __importDefault(require("../controllers/TicketListControllers"));
const GupShupTicketReply_1 = __importDefault(require("../models/GupShupTicketReply"));
const index_2 = __importDefault(require("../services/GupShup/index"));
const SMSMessageModel_1 = require("../services/SMSMessageModel");
const SMSConversationModel_1 = require("../services/SMSConversationModel");
const inboxModel_1 = require("../services/inboxModel");
const contactModel_1 = require("../services/contactModel");
const vibconnectModel_1 = require("../services/vibconnectModel");
const SubscriptionModel_1 = require("../services/SubscriptionModel");
const CreditCdrModel_1 = require("../services/CreditCdrModel");
const IvrFlowUIModel_1 = require("../services/IvrFlowUIModel");
const logger_1 = __importDefault(require("../config/logger"));
const index_3 = require("../services/Vibconnect/index");
const httpClient = request_1.default;
const gupShup = new index_2.default();
const ticketListController = new TicketListControllers_1.default();
class WebSocketController extends Index_1.default {
    constructor(models) {
        super(models);
        this.ivrStudiosStatusCallback = this.ivrStudiosStatusCallback.bind(this);
        this.MakeConferenceCall = this.MakeConferenceCall.bind(this);
        this.vibconnectMessage = this.vibconnectMessage.bind(this);
        this.getListOfConference = this.getListOfConference.bind(this);
        this.RecieveConferenceCallBacksAndSave =
            this.RecieveConferenceCallBacksAndSave.bind(this);
        this.ivrStudiosApiCallStatusCallback =
            this.ivrStudiosApiCallStatusCallback.bind(this);
        this.ivrStudiosApiCallStatusCallbackForParallelCalling =
            this.ivrStudiosApiCallStatusCallbackForParallelCalling.bind(this);
        this.voicemailCallBack = this.voicemailCallBack.bind(this);
        this.RecieveRecordingCallbacksAndSave =
            this.RecieveRecordingCallbacksAndSave.bind(this);
        this.postInstagramMeta = this.postInstagramMeta.bind(this);
        this.getInstagramMeta = this.getInstagramMeta.bind(this);
        this.thiqMessage = this.thiqMessage.bind(this);
    }
    async RecieveRecordingCallbacksAndSave(req, res) {
        const body = req.body;
        const data = new CallRecordingsCallbacksModel_1.default(body);
        await data.save();
        this.data = body;
        this.status = true;
        this.code = 200;
        this.message = "Data saved";
        return res.json(this.Response());
    }
    sentConfirmationMessageToCustomer = async (body) => {
        const gupshupId = body.gupshupUserName;
        const gupshupPassword = body.gupshupPassword;
        const customerNumber = body.customerNumber;
        const customerName = body.customerName ? body.customerName : "Customer";
        const payloadForCustomer = {
            user_id: gupshupId,
            password: gupshupPassword,
            phone_number: customerNumber,
            message: `Dear+${customerName}%2C%0A%0AWe+are+pleased+to+inform+you+that+your+issue+has+been+successfully+resolved+and+the+status+of+ticket+${body.ticket_id}+has+been+changed+to+%22Closed.%22%0A%0AAre+you+satisfied+with+the+resolution+which+was+provided+to+you%3F%0A%0ARegards%2C+Wow+Momo&isTemplate=true`,
        };
        const response = await ticketListController.verifyThenSend(payloadForCustomer);
        console.log("Repsonse from server after send close ticket message to user : ", response);
        if (response) {
            const tempObj = {
                id: response.response.id,
                phone: response.response.phone,
                details: response.response.details,
                status: response.response.status,
                ticket_id: body.ticket_id,
                tkt_obj_id: body.tkt_obj_id,
                cityHead: body.cityHead,
            };
            await GupShupTicketReply_1.default.create(tempObj);
        }
    };
    async getInstagramMeta(req, res) {
        console.log("Query : ", req.query);
        if (req.query.ticket_id) {
            const ticketId = req.query.ticket_id;
            const onlyTicketId = ticketId.split("number")[0];
            const cityHeadNumber = ticketId.split("number")[1];
            const contactNumber = ticketId.split("number")[2];
            const contactName = ticketId.split("number")[3];
            const query = { ticket_id: onlyTicketId };
            const updates = {
                $set: {
                    status: {
                        color: "green",
                        name: "closed",
                    },
                },
            };
            console.log("City Head Number : ", cityHeadNumber);
            if (cityHeadNumber) {
                console.log("Check if it is a city head number ");
                const queryForCityHead = { cityHead: { $regex: cityHeadNumber } };
                const cityHead = await this.isNumberPresentInStore(queryForCityHead);
                if (cityHead) {
                    console.log("Contact Number whom we need to send message : ", contactNumber);
                    const ticketDetails = await TicketListModel_1.default.findOneAndUpdate(query, updates);
                    console.log("updates : ", ticketDetails);
                    const tempObj = {
                        customerNumber: contactNumber,
                        customerName: contactName,
                        ticket_id: ticketDetails.ticket_id,
                        tkt_obj_id: ticketDetails._id,
                        cityHead: cityHeadNumber,
                        gupshupUserName: cityHead.username,
                        gupshupPassword: cityHead.password,
                    };
                    await this.sentConfirmationMessageToCustomer(tempObj);
                    return res.status(200).json({ message: "Ticket Closed" });
                }
            }
            return res
                .status(200)
                .json({ message: "Only City Head can close tickets" });
        }
    }
    containsOnlyNumbers = (str) => {
        return /^\d+$/.test(str);
    };
    isNumberPresentInStore = async (query) => {
        console.log("Query : ", query);
        const isPresent = await StoreModel_1.default.findOne(query);
        if (isPresent) {
            return isPresent;
        }
        return false;
    };
    replyAccordingToWowMomo = async (data) => {
        const number = data.mobile.slice(-10);
        if (data.type === "text") {
            const queryForCityHead = { cityHead: number };
            const queryForStoreManger = { storeManager: number };
            const cityHead = await this.isNumberPresentInStore(queryForCityHead);
            const storeManger = await this.isNumberPresentInStore(queryForStoreManger);
            console.log("City Head Details : ", cityHead, storeManger);
            let payload;
            let gupshupUserName;
            let gupshupPassword;
            let gupshupEnterpriceUsername;
            let gupshupEnterpricePassword;
            if (cityHead) {
                console.log("This is a city head number create a payload for CityHead and make a query to tickets to get ticket-id");
                payload = (0, index_1.buildQueryFromCustomVariable)(JSON.stringify({ City: cityHead.city, Zone: cityHead.zone }));
                gupshupUserName = cityHead.username;
                gupshupPassword = cityHead.password;
                gupshupEnterpriceUsername = cityHead.enterpriceUsername;
                gupshupEnterpricePassword = cityHead.enterpricePassword;
            }
            if (storeManger) {
                console.log("This is a store Manage number create a payload for CityHead and make a query to tickets to get ticket-id");
                payload = (0, index_1.buildQueryFromCustomVariable)(JSON.stringify({ City: storeManger.city, Zone: storeManger.zone }));
                gupshupUserName = storeManger.username;
                gupshupPassword = storeManger.password;
                gupshupEnterpriceUsername = storeManger.enterpriceUsername;
                gupshupEnterpricePassword = storeManger.enterpricePassword;
            }
            if (payload) {
                const askQuestionToListOpenOrder = this.test(data.text, "open", true);
                const askQuestionToListinProgressOrder = this.test(data.text, "progress", true);
                const asktTicketInfo = this.test(data.text, "wow-momo", true);
                console.log("Do customer ask for open tickets : ", askQuestionToListOpenOrder);
                if (askQuestionToListOpenOrder) {
                    console.log("Do customer ask for in-progress tickets : ", askQuestionToListinProgressOrder);
                    console.log("Query for Open Tickets : ", payload);
                    const queryForOpenTickets = { ...payload, "status.name": "open" };
                    const tickets = await TicketListModel_1.default.find(queryForOpenTickets, {
                        ticket_id: 1,
                        status: 1,
                    })
                        .sort({ _id: -1 })
                        .limit(10);
                    console.log("Tickets Details : ", tickets);
                    const ticketIds = tickets?.map((ticket, index) => {
                        return `${ticket.ticket_id}\n`;
                    });
                    let message = `List Of Open Tickets - \n ${ticketIds}`;
                    const cityHeadNumber = data.mobile.slice(-10);
                    const payloadToSendList = {
                        userid: gupshupEnterpriceUsername,
                        password: gupshupEnterpricePassword,
                        msg: message,
                        format: "json",
                        msg_type: "TEXT",
                        v: "1.1",
                        auth_scheme: "plain",
                        send_to: cityHeadNumber,
                        method: "SendMessage",
                    };
                    //@ts-ignore
                    await gupShup.sendMessageWithoutTemplate(payloadToSendList);
                }
                if (askQuestionToListinProgressOrder) {
                    console.log("Do customer ask for in-progress tickets : ", askQuestionToListinProgressOrder);
                    console.log("Query for In-Progress Tickets : ", payload);
                    const queryForInprogressTickets = {
                        ...payload,
                        "status.name": "in-progress",
                    };
                    const tickets = await TicketListModel_1.default.find(queryForInprogressTickets, { ticket_id: 1, status: 1 })
                        .sort({ _id: -1 })
                        .limit(10);
                    console.log("Tickets Details : ", tickets);
                    const ticketIds = tickets?.map((ticket, index) => {
                        return `${ticket.ticket_id}\n`;
                    });
                    let message = `List Of In-Progress Tickets - \n ${ticketIds}`;
                    const cityHeadNumber = data.mobile.slice(-10);
                    const payloadToSendList = {
                        userid: gupshupEnterpriceUsername,
                        password: gupshupEnterpricePassword,
                        msg: message,
                        format: "json",
                        msg_type: "TEXT",
                        v: "1.1",
                        auth_scheme: "plain",
                        send_to: cityHeadNumber,
                        method: "SendMessage",
                    };
                    //@ts-ignore
                    await gupShup.sendMessageWithoutTemplate(payloadToSendList);
                }
                if (asktTicketInfo) {
                    const ticketId = data.text;
                    console.log("Ticket ID : ", ticketId);
                    const query = { ticket_id: ticketId };
                    const statusFilter = [
                        { "status.name": "open" },
                        { "status.name": "in-progress" },
                    ];
                    const ticketInfo = await TicketListModel_1.default.findOne({
                        ...query,
                        $or: statusFilter,
                    }).populate("created_by");
                    console.log("Ticket Info : ", ticketInfo);
                    if (ticketInfo) {
                        // if(ticketInfo.status.name === 'open'){
                        //   console.log("Show both in-progress and closed button")
                        //   const gupshupId = '2000212889'
                        //   const gupshupPassword = 'SX*EM53@'
                        //   const cityHeadNumber = data.mobile.slice(-10)
                        //   const ticketId = ticketInfo.ticket_id
                        //   const subject = ticketInfo.ticket_details
                        //   const queryType = ticketInfo.CustomVariables.find( input =>  input.name === 'Category' )
                        //   const customerName = ticketInfo.created_by.firstName ? ticketInfo.created_by.firstName : '' + ticketInfo.created_by.last_name ? ticketInfo.created_by.last_name : ''
                        //   const customerNumber = ticketInfo.created_by.phoneNumber.slice(-10)
                        //   console.log("Ticket ID : ", ticketId)
                        //   console.log("Subject : ", subject)
                        //   console.log("QueryType : ", queryType)
                        //   const payloadToShowInProgressAndClosed = {
                        //     user_id : gupshupId,
                        //     password : gupshupPassword,
                        //     phone_number : cityHeadNumber,
                        //     message : `Ticket+ID+-+${ticketInfo.ticket_id}%0A%0ASubject+-+${subject}%0A%0AQuery+Type+-+${queryType.selected_value}%0A%0ACustomer+Name+-+${customerName}%0A%0ACustomer+Number+-+${customerNumber}&header=Open+Ticket`
                        // }
                        // await ticketListController.verifyThenSend(payloadToShowInProgressAndClosed)
                        // }
                        // if(ticketInfo.status.name === 'in-progress'){
                        //   console.log("Show closed button")
                        //   const gupshupId = '2000212889'
                        //   const gupshupPassword = 'SX*EM53@'
                        //   const cityHeadNumber = data.mobile.slice(-10)
                        //   const ticketId = ticketInfo.ticket_id
                        //   const subject = ticketInfo.ticket_details
                        //   const queryType = ticketInfo.CustomVariables.find( input =>  input.name === 'Category' )
                        //   const customerName = ticketInfo.created_by.firstName ? ticketInfo.created_by.firstName : '' + ticketInfo.created_by.last_name ? ticketInfo.created_by.last_name : ''
                        //   const customerNumber = ticketInfo.created_by.phoneNumber.slice(-10)
                        //   console.log("Ticket ID : ", ticketId)
                        //   console.log("Subject : ", subject)
                        //   console.log("QueryType : ", queryType)
                        //   const payloadToShowInProgressAndClosed = {
                        //     user_id : gupshupId,
                        //     password : gupshupPassword,
                        //     phone_number : cityHeadNumber,
                        //     message : `Ticket+ID+-+${ticketInfo.ticket_id}%0A%0ASubject+-+${subject}%0A%0AQuery+Type+-+${queryType.selected_value}%0A%0ACustomer+Name+-+${customerName}%0A%0ACustomer+Number+-+${customerNumber}`,
                        //     buttonUrlParam : `api%252Fwebhook%252Finstagram%253Fticket_id%253D${ticketId}-number-${cityHeadNumber}`
                        // }
                        // await ticketListController.verifyThenSend(payloadToShowInProgressAndClosed)
                        // }
                        console.log("Show closed button");
                        const cityHeadNumber = data.mobile.slice(-10);
                        const ticketId = ticketInfo.ticket_id;
                        const subject = ticketInfo.ticket_details;
                        const queryType = ticketInfo.CustomVariables.find((input) => input.name === "Category");
                        let customerName = "Not-Present";
                        let customerNumber = "Not-Present";
                        if (ticketInfo.created_by) {
                            customerName = ticketInfo.created_by
                                ? ticketInfo.created_by.firstName.replace(/\s/g, "")
                                : "";
                            customerNumber = ticketInfo.created_by.phoneNumber.slice(-10);
                        }
                        console.log("Ticket ID : ", ticketId);
                        console.log("Subject : ", subject);
                        console.log("QueryType : ", queryType);
                        const payloadToShowInProgressAndClosed = {
                            user_id: gupshupUserName,
                            password: gupshupPassword,
                            phone_number: cityHeadNumber,
                            message: `Ticket+ID+-+${ticketInfo.ticket_id}%0A%0ASubject+-+${subject
                                .split(" ")
                                .join("+")}%0A%0AQuery+Type+-+${queryType.selected_value
                                .split(" ")
                                .join("+")}%0A%0ACustomer+Name+-+${customerName}%0A%0ACustomer+NUmber+-+${customerNumber}`,
                            // message : `Ticket+ID+-+${ticketInfo.ticket_id}%0A%0ASubject+-+${subject.split(" ").join("+")}%0A%0AQuery+Type+-+${queryType.selected_value.split(" ").join("+")}%0A%0ACustomer+Name+-+${customerName}%0A%0ACustomer+Number+-+${customerNumber}`,
                            // buttonUrlParam : `api/webhook/instagram?ticket_id=${ticketId}-number-${cityHeadNumber}`,
                            buttonUrlParam: `%3Fticket_id%3D${ticketId}number${cityHeadNumber}number${customerNumber}number${customerName}`,
                        };
                        if (payloadToShowInProgressAndClosed) {
                            await ticketListController.verifyThenSend(payloadToShowInProgressAndClosed);
                        }
                    }
                }
            }
        }
    };
    replyOnButtonPress = async (data) => {
        console.log("Button Input : ", typeof data.button, data.button);
        const buttonValue = data.button ? JSON.parse(data.button) : false;
        console.log("Button Value : ", typeof buttonValue, buttonValue);
        if (buttonValue) {
            const input = buttonValue.text;
            const mobileNumber = data.mobile;
            if (input === "Mark Closed") {
                const queryForCityHead = { cityHead: mobileNumber };
                const cityHead = await this.isNumberPresentInStore(queryForCityHead);
                if (cityHead) {
                    console.log("This is city head attempting to close ticket : ", cityHead);
                    //const payload = buildQueryFromCustomVariable(JSON.stringify({"City":cityHead.city, "Zone":cityHead.zone}))
                }
                // const ticketDetail = await TicketListModel.find(payload)
                // console.log("Ticket Detail : ", ticketDetail)
            }
            if (input === "Not Satisfied") {
                const messageId = data.replyId + "-" + data.messageId;
                const queryToFindReply = { id: messageId };
                const requiredTicketNeedToReOpen = await GupShupTicketReply_1.default.findOne(queryToFindReply, { ticket_id: 1, tkt_obj_id: 1 });
                console.log("We Need To re-open it : ", requiredTicketNeedToReOpen);
                if (requiredTicketNeedToReOpen) {
                    if (requiredTicketNeedToReOpen.tkt_obj_id) {
                        const query = requiredTicketNeedToReOpen.tkt_obj_id;
                        const updates = { "status.name": "open", "status.color": "red" };
                        await TicketListModel_1.default.findByIdAndUpdate(query, updates);
                        await GupShupTicketReply_1.default.findByIdAndDelete(requiredTicketNeedToReOpen._id);
                    }
                }
            }
            if (input === "Yes Satisfied") {
                const messageId = data.replyId + "-" + data.messageId;
                const queryToFindReply = { id: messageId };
                console.log("Reply we need to delete : ", messageId);
                await GupShupTicketReply_1.default.findOneAndDelete(queryToFindReply);
            }
        }
    };
    buildRegEx = (str, keywords) => {
        return new RegExp("(?=.*?\\b" + keywords.split(" ").join(")(?=.*?\\b") + ").*", "i");
    };
    test = (str, keywords, expected) => {
        var result = this.buildRegEx(str, keywords).test(str) === expected;
        return result;
    };
    async postInstagramMeta(req, res) {
        const body = req.body;
        const askQuestionToListOrder = this.test(body.text, "list", true);
        const askForTicketStatus = this.test(body.text, "wow-momo", true);
        if (askQuestionToListOrder) {
            this.replyAccordingToWowMomo(body);
        }
        if (askForTicketStatus) {
            this.replyAccordingToWowMomo(body);
        }
        if (body.type === "button") {
            this.replyOnButtonPress(body);
        }
        console.log("Do any one ask question : ", askQuestionToListOrder, askForTicketStatus);
        console.log("Body : ", JSON.stringify(body), body);
        console.log("Query : ", req.query);
        this.data = body;
        this.status = true;
        this.message = "Success";
        return res.send(this.Response());
    }
    async makeFakeRequestToActionToSendMessage(body, id, source) {
        const link = `${conf.BaseUrl}/api/v2/ivrstudios/convert/${id}/conference|Room_${body.ParentCallSid}/${source}?DialCallStatus=fake-completed&ParentCallSid=${body.ParentCallSid}`;
        // console.log("body in make fake request to action  ", body);
        const options = {
            method: "POST",
            url: link,
            body: JSON.stringify({ ...body }),
        };
        logger_1.default.info(options);
        return new Promise((resolve, reject) => {
            httpClient(options, (err, res, body) => {
                if (err) {
                    logger_1.default.error("error in fake action action request : " + err);
                    reject(err);
                }
                //  console.log("res of target ",res)
                logger_1.default.info("body of fake action request : " + body);
                resolve(body);
            });
        });
    }
    createCallStatusObjectForChild = (arr, obj) => {
        arr.map((child) => {
            // console.log("I am the child", child)
            obj.Status[child.CallStatus] = child.subscribeDate;
        });
        return obj;
    };
    getRecordingSid = async (arr) => {
        let RecordingUrl = "";
        let RecordingSid;
        let CallSid;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].CallStatus === "completed") {
                RecordingUrl = arr[i].RecordingUrl;
                CallSid = arr[i].CallSid;
                if (CallSid !== undefined && CallSid !== null) {
                    const recordingDetails = await CallRecordingsCallbacksModel_1.default.findOne({
                        CallSid: CallSid,
                    });
                    if (recordingDetails) {
                        RecordingSid = recordingDetails.RecordingSid;
                    }
                }
            }
        }
        console.log("RecordingSid ", RecordingUrl, RecordingSid);
        return RecordingSid;
    };
    firstStepOfChildConstructor = async (childArray) => {
        if (childArray.length === 0)
            return null;
        //console.log("childArray ",childArray)
        let RecordingSid = await this.getRecordingSid(childArray);
        let ChildObject = new Object();
        let isTransferred = false;
        let CallType = 'direct';
        let transferType = '';
        if (childArray[0].source === 'cloud_phone_outbound_transfer') {
            isTransferred = true;
            CallType = 'transfer';
            if (childArray[0].TransferType) {
                transferType = childArray[0].TransferType;
            }
        }
        //@ts-ignore
        ChildObject["AccountSid"] = childArray[0].AccountSid;
        //@ts-ignore
        ChildObject["To"] = childArray[0].Called;
        //@ts-ignore
        ChildObject["From"] = childArray[0].From;
        //@ts-ignore
        ChildObject["Status"] = {};
        //@ts-ignore
        ChildObject["CallDuration"] = "";
        //@ts-ignore
        ChildObject["CallSid"] = childArray[0].CallSid;
        //@ts-ignore
        ChildObject["StartTime"] = new Date();
        //@ts-ignore
        ChildObject["RecordingSid"] = RecordingSid;
        //@ts-ignore
        ChildObject["isTransfered"] = isTransferred;
        //@ts-ignore
        ChildObject["CallType"] = CallType;
        //@ts-ignore
        ChildObject["TransferType"] = transferType;
        if (childArray[0].From !== undefined &&
            childArray[0].From.startsWith("sip")) {
            let val = childArray[0].From.split(":")[1];
            let num = val.substring(0, 12);
            //@ts-ignore
            ChildObject["From"] = num;
        }
        const callDurationFromArray = childArray.filter((val) => {
            return val.CallDuration;
        });
        if (callDurationFromArray.length > 0) {
            //@ts-ignore
            ChildObject["CallDuration"] = callDurationFromArray[0].CallDuration;
        }
        const childCallStatus = this.formatCallStatusObjectFromArray(childArray);
        //@ts-ignore
        ChildObject["Status"] = childCallStatus;
        return ChildObject;
    };
    formatCallStatusObjectFromArray(ivrFlow) {
        let tempObj = {};
        ivrFlow.map((val) => {
            if (val.CallStatus === "in-progress") {
                if (tempObj["in-progress"] === undefined) {
                    tempObj[val.CallStatus] = val.subscribeDate.toUTCString();
                }
            }
            else {
                tempObj[val.CallStatus] = val.subscribeDate.toUTCString();
            }
            // tempObj[val.CallStatus] = val.subscribeDate.toUTCString() // if we remove toUtcString() the code will return local time only
        });
        return tempObj;
    }
    makeObjectFromArrayOfObjects = async (ivrFlow, ChildivrFlow) => {
        // console.log("ivrFlow in function ", ivrFlow[0].From , ivrFlow[0])
        let FromWithoutSip;
        // if(ivrFlow[0] !== undefi)
        if (!ivrFlow[0].From) {
            FromWithoutSip = "";
        }
        else {
            if (ivrFlow[0].From !== undefined || ivrFlow[0].From !== null) {
                if (ivrFlow[0].From.startsWith("sip")) {
                    let val = ivrFlow[0].From.split(":")[1];
                    let num = val.substring(0, 12);
                    FromWithoutSip = num;
                }
                else {
                    FromWithoutSip =
                        ivrFlow[0].From.length > 12
                            ? ivrFlow[0].From.slice(-12)
                            : ivrFlow[0].From;
                }
            }
        }
        // console.log("FromWithoutSip ",FromWithoutSip)
        let newBody = {};
        newBody = {
            AccountSid: ivrFlow[0].AccountSid,
            CloudNumber: ivrFlow[0].Called,
            FlowId: "",
            FlowName: "",
            //Notes: ivrFlow[0]['Notes'],
            Tags: ivrFlow[0]["Tags"],
            CallDuration: "",
            SmsIds: [],
            ParentCall: {
                ParentCallSid: ivrFlow[0].ParentCallSid,
                //To: ivrFlow[0].Called.length > 12 ? ivrFlow[0].Called.slice(-12) : ivrFlow[0].Called ,
                From: FromWithoutSip,
                Direction: ivrFlow[0].Direction,
                IVR: {
                    IvrMain: {},
                    IvrSecondary: {},
                },
                CallStatus: {},
                ChildCall: [],
            },
        };
        const ParentCallStatusObject = this.formatCallStatusObjectFromArray(ivrFlow);
        const childCallDetailsInSingleObject = await this.firstStepOfChildConstructor(ChildivrFlow);
        // console.log("ParentCallStatusObject in function ",ParentCallStatusObject)
        newBody.ParentCall.CallStatus = ParentCallStatusObject;
        newBody.ParentCall.ChildCall.push(childCallDetailsInSingleObject);
        // console.log("newBody in function ",newBody)
        return newBody;
    };
    checkIfCallerIsCallingFirstTimeOfNot = async (caller) => {
        let lastTenDigitsOfNumber = caller ? caller.slice(-10) : "";
        // console.log("lastTenDigitsOfNumber: ", lastTenDigitsOfNumber);
        try {
            const count = await ivrFlowModel_1.default.countDocuments({
                "ParentCall.From": { $regex: lastTenDigitsOfNumber, $options: "i" },
            });
            if (count === 0) {
                return { CallerType: "FirstTime", count: count };
            }
            else {
                return { CallerType: "Repeat", count: count };
            }
        }
        catch (err) {
            // console.log("Err : ", err);
            return { CallerType: "FirstTime", count: 0 };
        }
    };
    useDataWithNoChildCallToSave = async (body) => {
        logger_1.default.info('body recieve for save data with no child call : ' + JSON.stringify(body));
        let ParentCallSid = body?.ParentCallSid;
        let ChildCallSid = body?.ParentCallSid;
        const detailsOfParentCallSid = await ivrStudiosModelCallBacks_1.default.find({
            ParentCallSid: ParentCallSid,
        }).sort("subscribeDate");
        const detailsOfChildCallSid = await ivrStudiosModelCallBacks_1.default.find({
            CallSid: ChildCallSid,
        }).sort("subscribeDate");
        let FinalCallStatus = "completed";
        let parentCallDuration;
        if (detailsOfParentCallSid.length > 0) {
            for (let i = 0; i < detailsOfParentCallSid.length; i++) {
                if (detailsOfParentCallSid[i]?.CallStatus === "completed") {
                    parentCallDuration = detailsOfParentCallSid[i]?.CallDuration;
                }
            }
        }
        detailsOfChildCallSid.map((val) => {
            if (val.CallStatus === "completed" ||
                val.CallStatus === "busy" ||
                val.CallStatus === "failed" ||
                val.CallStatus === "no-answer" ||
                val.CallStatus === "canceled") {
                FinalCallStatus = val.CallStatus;
            }
        });
        const bodyOfIvrFlow = await this.makeObjectFromArrayOfObjects(detailsOfParentCallSid, detailsOfChildCallSid);
        let Called = this.checkCalledFormat(detailsOfParentCallSid[0].Called);
        const FlowId = await ivrFlowUIModel_1.default.find({ number: Called });
        const ivrDetails = this.useParentCallDetailsArrayToFormatDigits(detailsOfParentCallSid, FlowId);
        let CallerType = await this.checkIfCallerIsCallingFirstTimeOfNot(body.Caller);
        if (FlowId.length > 0) {
            if (FlowId[0]._id !== undefined) {
                bodyOfIvrFlow.FlowId = FlowId[0]?._id;
                bodyOfIvrFlow.FlowName = FlowId[0]?.name;
            }
        }
        const userDetails = await this.useAuthIdToGetUserDetails(detailsOfParentCallSid[0].AccountSid);
        const Caller = bodyOfIvrFlow.ParentCall.Direction === "inbound"
            ? bodyOfIvrFlow.ParentCall.From.slice(-10)
            : bodyOfIvrFlow.ParentCall.To.slice(-10);
        const CloudNumber = bodyOfIvrFlow.CloudNumber
            ? bodyOfIvrFlow.CloudNumber.slice(-12)
            : "";
        //console.log("Caller ",Caller)
        // console.log("CloudNumber ", CloudNumber);
        const numberDetails = await this.useNumberToFindDetailsOfCloudNumber(CloudNumber);
        const nameOfNumber = numberDetails.length > 0 ? numberDetails[0].name : "";
        // console.log("nameOfNumber ", nameOfNumber);
        //console.log("Receiver : ", Receiver)
        const contactDetails = await this.useNumberToFoundDetailsOfContacts(Caller, detailsOfParentCallSid[0].AccountSid);
        //console.log("contactDetails ",contactDetails)
        let contactId;
        if (contactDetails.length > 0) {
            // console.log("Contact id : ", contactDetails[0]._id, contactDetails[0]);
            contactId = contactDetails[0]._id;
        }
        const callerFirstName = contactDetails.length > 0 ? contactDetails[0].firstName : "Unknown";
        const callerLastName = contactDetails.length > 0 ? contactDetails[0].lastName : "";
        const CallerFullName = callerFirstName + " " + callerLastName;
        if (contactDetails.length === 0) {
            const ContactModel = new contactModel({
                firstName: "Unknown",
                lastName: "",
                phoneNumber: `91${Caller}`,
                user_id: userDetails?._id,
                AccountSid: userDetails?.auth_id,
            });
            contactId = ContactModel._id;
            await ContactModel.save();
        }
        const ContactName = bodyOfIvrFlow.ParentCall.Direction === "outbound-api"
            ? ""
            : CallerFullName;
        const ContactNumber = bodyOfIvrFlow.ParentCall.Direction === "outbound-api"
            ? ""
            : `91${Caller}`;
        // console.log("ContactName : ", ContactName);
        // console.log("ContactNumber : ", ContactNumber);
        // console.log("CallerFullName ", CallerFullName);
        let finalDataToSave = {
            ...bodyOfIvrFlow,
            contactId: contactId,
            ContactName: ContactName,
            ContactNumber: ContactNumber,
            CallerType: CallerType.CallerType,
            CallerName: CallerFullName,
            CloudNumberName: nameOfNumber,
            CallStatus: FinalCallStatus,
            ParentCallDuration: parentCallDuration,
            ivrDetails: [...ivrDetails],
        };
        let formattedData = this.checkDataFormatAndAddPlusToAllNumber(finalDataToSave);
        const data = new ivrFlowModel_1.default(formattedData);
        data
            .save()
            .then(async (response) => {
            // console.log("Response 901 : ", response)
            logger_1.default.info("data saved if call is not conference nor a initiate call " +
                JSON.stringify(finalDataToSave));
            if (finalDataToSave.AccountSid === '4I8LSQ37HRWBC998VFJ7') {
                await this.zohoIntegerationForParticularClient(finalDataToSave);
            }
            this.deductBalanceFromCredits(response, 'call', 50);
            this.replaceCallSidWithDocIdInTickets(formattedData.ParentCall.ParentCallSid, data._id);
        })
            .catch((err) => {
            logger_1.default.info("error in saving data " + err);
        });
    };
    useInitiateCallDetailsToConvertData = async (body) => {
        let ParentCallSid = body?.ParentCallSid;
        let ChildCallSid = body?.ChildCallSid;
        let CloudNumber = body?.CloudNumber;
        const detailsOfParentCallSid = await ivrStudiosModelCallBacks_1.default.find({
            ParentCallSid: ParentCallSid,
        }).sort("subscribeDate");
        const detailsOfChildCallSid = await ivrStudiosModelCallBacks_1.default.find({
            CallSid: ChildCallSid,
        }).sort("subscribeDate");
        let listOfChildCallSid = body?.listOfChildCallSid;
        let arrayOfFormattedChildCalls = await this.useArrayOfChildCallsToMakeChildCallLifeCycle(listOfChildCallSid);
        //  console.log("detailsOfParentCallSid ",detailsOfParentCallSid)
        //  console.log("detailsOfChildCallSid ",detailsOfChildCallSid)
        // let FinalCallStatus = 'no-answer'
        let FinalCallStatus = "completed";
        let parentCallDuration;
        let Receiver = "not-connected";
        let ConnectedChildCallDuration;
        if (detailsOfParentCallSid.length > 0) {
            for (let i = 0; i < detailsOfParentCallSid.length; i++) {
                if (detailsOfParentCallSid[i]?.CallStatus === "completed") {
                    parentCallDuration = detailsOfParentCallSid[i]?.CallDuration;
                }
            }
        }
        detailsOfChildCallSid.map((val) => {
            if (val.CallStatus === "completed" ||
                val.CallStatus === "busy" ||
                val.CallStatus === "failed" ||
                val.CallStatus === "no-answer" ||
                val.CallStatus === "canceled") {
                FinalCallStatus = val.CallStatus;
            }
            if (val.CallStatus === "completed") {
                Receiver = val.To;
                ConnectedChildCallDuration = val.CallDuration;
            }
        });
        // console.log("FinalCallStatus Initiated Call ",FinalCallStatus)
        const bodyOfIvrFlow = await this.makeObjectFromArrayOfObjects(detailsOfParentCallSid, detailsOfChildCallSid);
        let Called = this.checkCalledFormat(detailsOfParentCallSid[0].Called);
        // console.log("Caller ",Called)
        // const FlowId = await ivrFlowUIModel.find({number: Called}).select(["_id", "name"]);
        const FlowId = await ivrFlowUIModel_1.default.find({ number: Called });
        // console.log("FlowId ",FlowId)
        const ivrDetails = this.useParentCallDetailsArrayToFormatDigits(detailsOfParentCallSid, FlowId);
        let CallerType = await this.checkIfCallerIsCallingFirstTimeOfNot(body.Caller);
        if (FlowId.length > 0) {
            if (FlowId[0]._id !== undefined) {
                bodyOfIvrFlow.FlowId = FlowId[0]?._id;
                bodyOfIvrFlow.FlowName = FlowId[0]?.name;
            }
        }
        // if (FlowId[0]._id !== undefined){
        //     bodyOfIvrFlow.FlowId = FlowId[0]?._id;
        //     bodyOfIvrFlow.FlowName = FlowId[0]?.name;
        // }
        // console.log("bodyOfIvrFlow for initiated call ",bodyOfIvrFlow)
        let finalDataToSave = {
            ...bodyOfIvrFlow,
            CloudNumber: CloudNumber,
            CallerType: CallerType.CallerType,
            CallStatus: FinalCallStatus,
            Receiver: Receiver,
            ConnectedChildCallDuration: ConnectedChildCallDuration,
            ParentCallDuration: parentCallDuration,
            listOfChildCalls: [...arrayOfFormattedChildCalls],
            ivrDetails: [...ivrDetails],
        };
        const data = new ivrFlowModel_1.default(finalDataToSave);
        data
            .save()
            .then(async () => {
            if (finalDataToSave.AccountSid === '4I8LSQ37HRWBC998VFJ7') {
                await this.zohoIntegerationForParticularClient(finalDataToSave);
            }
            console.log("data saved if call is a initiate call ", finalDataToSave);
        })
            .catch((err) => {
            console.log("error in saving data ", err);
        });
    };
    sortArrayOfChildCallsAccordingTotime(arrayOfChildCalls) {
        arrayOfChildCalls.sort(function (a, b) {
            return a.StartTime - b.StartTime;
        });
        return arrayOfChildCalls;
    }
    findUserNameFromNumber = async (number, authId) => {
        let tempObj = { name: "", userId: "" };
        const myQuery = {
            phone: { $regex: number, $options: "i" },
            auth_id: authId,
        };
        const user = await UserPermissionUserModel_1.default.findOne(myQuery);
        //console.log("user ",user)
        if (user) {
            return (tempObj = { name: user.fullName, userId: user._id });
        }
        return tempObj;
    };
    findContactNameFromNumber = async (number, authId) => {
        let tempObj = { name: "", contactId: "" };
        const myQuery = {
            phoneNumber: { $regex: number, $options: "i" },
            AccountSid: authId,
        };
        const user = await contactModel.findOne(myQuery);
        //console.log("user ",user)
        if (user) {
            return (tempObj = { name: user.firstName, contactId: user._id });
        }
        return tempObj;
    };
    useArrayOfChildCallsToMakeChildCallLifeCycle = async (arr) => {
        // console.log("arr of child calls ", arr);
        let requiredListOfFormattedChildCalls = [];
        await Promise.all(arr.map(async (val) => {
            const detailsOfChildCallSid = await ivrStudiosModelCallBacks_1.default.find({
                ParentCallSid: val,
            }).sort("subscribeDate");
            const childCallDetailsInSingleObject = await this.firstStepOfChildConstructor(detailsOfChildCallSid);
            // console.log(
            //   "childCallDetailsInSingleObject ",
            //   childCallDetailsInSingleObject
            // );
            //new code for adding user in ivr table
            //let Receiver = childCallDetailsInSingleObject.To ? childCallDetailsInSingleObject.To.slice(-10) : null
            let Receiver;
            let AuthId;
            if (childCallDetailsInSingleObject !== null &&
                childCallDetailsInSingleObject !== undefined) {
                if (childCallDetailsInSingleObject.To !== null &&
                    childCallDetailsInSingleObject.To !== undefined) {
                    Receiver = childCallDetailsInSingleObject.To
                        ? childCallDetailsInSingleObject.To.slice(-10)
                        : null;
                    AuthId = childCallDetailsInSingleObject.AccountSid
                        ? childCallDetailsInSingleObject.AccountSid
                        : null;
                }
            }
            //let AuthId = childCallDetailsInSingleObject.AccountSid ? childCallDetailsInSingleObject.AccountSid : null
            let userDetails = {};
            let contactDetails = {};
            if (Receiver) {
                userDetails = await this.findUserNameFromNumber(Receiver, AuthId);
                if (userDetails.userId === "") {
                    //search in contact
                    contactDetails = await this.findContactNameFromNumber(Receiver, AuthId);
                }
            }
            // console.log("userDetails ", userDetails);
            let tempObj = { ...childCallDetailsInSingleObject, ...userDetails, ...contactDetails };
            requiredListOfFormattedChildCalls.push(tempObj);
        }));
        return await requiredListOfFormattedChildCalls;
    };
    getNextNodeDetailsUsingTargetId(arr, targetId) {
        let nextNodeDetails = arr.filter((val) => {
            return val.id === targetId;
        });
        return nextNodeDetails;
    }
    getNextNodeTargetUsingSourceAndSourceHandle(arr, source, digit) {
        let nextNode = arr.filter((val) => {
            return val.source === source && val.sourceHandle === digit;
        });
        // console.log("nextNode ",nextNode)
        return nextNode;
    }
    useParentCallDetailsArrayToFormatDigits = (arr, FlowId) => {
        // console.log("arr of parent calls details ",arr)
        let arrayOfDigitsDetailsForFirst = [];
        let arrayOfDigitsDetailsAfterFirst = [];
        let listOfDigitsPressed = [];
        let tempObj = { Digit: null, ivrName: null, pressedTime: null };
        let firstIvrNodeName;
        let firstIvrNodePressedTime;
        let firstIvrNodePressedDigits;
        const arrOnlyContainsDigits = arr.filter((val) => {
            return (val.source === "gather_response_body_ivr_flow" &&
                val.Digits !== undefined);
        });
        listOfDigitsPressed = arrOnlyContainsDigits.map((val) => {
            return { digit: val.Digits, time: val.subscribeDate };
        });
        firstIvrNodePressedTime = arrOnlyContainsDigits[0]?.subscribeDate;
        firstIvrNodePressedDigits = arrOnlyContainsDigits[0]?.Digits;
        if (FlowId.length > 0) {
            let allNodes = FlowId[0]?.input;
            let ivrNodes = [];
            ivrNodes = allNodes.filter((val) => val.type === "ivrNode");
            // console.log("ivrNodes ",ivrNodes)
            if (ivrNodes.length > 0) {
                firstIvrNodeName = ivrNodes[0]?.data.ivrName;
                let nextNodeTarget;
                // writing login if more than one button pressed
                if (ivrNodes.length > 1) {
                    for (let i = 0; i < ivrNodes.length - 1; i++) {
                        if (listOfDigitsPressed[i]) {
                            // console.log("listOfDigitsPressed ",listOfDigitsPressed[i])
                            nextNodeTarget = this.getNextNodeTargetUsingSourceAndSourceHandle(allNodes, ivrNodes[i]?.id, listOfDigitsPressed[i].digit);
                        }
                        // nextNodeTarget =  this.getNextNodeTargetUsingSourceAndSourceHandle(allNodes , ivrNodes[i]?.id , listOfDigitsPressed[i].digit )
                        // logger.info("nextNodeTarget ", nextNodeTarget);
                        if (nextNodeTarget) {
                            if (nextNodeTarget.length > 0) {
                                // console.log("nextNodeTarget ",nextNodeTarget)
                                let details = this.getNextNodeDetailsUsingTargetId(allNodes, nextNodeTarget[0].target);
                                if (details.length > 0) {
                                    if (details[0].type === "ivrNode") {
                                        if (listOfDigitsPressed[i + 1]) {
                                            let tempObj2 = {
                                                Digit: listOfDigitsPressed[i + 1].digit,
                                                ivrName: details[0]?.data.ivrName,
                                                pressedTime: listOfDigitsPressed[i].time,
                                            };
                                            arrayOfDigitsDetailsAfterFirst.push(tempObj2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        tempObj.Digit = firstIvrNodePressedDigits;
        tempObj.ivrName = firstIvrNodeName;
        tempObj.pressedTime = firstIvrNodePressedTime;
        arrayOfDigitsDetailsForFirst.push(tempObj);
        let x = [
            ...arrayOfDigitsDetailsForFirst,
            ...arrayOfDigitsDetailsAfterFirst,
        ];
        // console.log("x ",x)
        return x;
    };
    calculateQueueTimeForParticularCall = (arr) => {
        // console.log("Array in queue time : ", arr);
        let queueTime = 0;
        if (!arr[0].Status)
            return { QueueTime: queueTime };
        let startTimeOfFirstCall;
        let startTimeOfConnectedCall;
        let result = {};
        if (arr.length > 0) {
            if (arr[0] === null) {
                return { QueueTime: queueTime };
            }
            startTimeOfFirstCall = arr[0].Status.initiated;
            if (arr[0].Status === undefined)
                return { QueueTime: queueTime };
            if (arr[arr.length - 1].Status.completed) {
                if (arr[arr.length - 1].Status["in-progress"]) {
                    startTimeOfConnectedCall = arr[arr.length - 1].Status["in-progress"];
                }
            }
            else {
                if (arr[arr.length - 1].Status["no-answer"]) {
                    startTimeOfConnectedCall = arr[arr.length - 1].Status["no-answer"];
                }
                if (arr[arr.length - 1].Status["busy"]) {
                    startTimeOfConnectedCall = arr[arr.length - 1].Status["busy"];
                }
                if (arr[arr.length - 1].Status["failed"]) {
                    startTimeOfConnectedCall = arr[arr.length - 1].Status["failed"];
                }
                if (arr[arr.length - 1].Status["canceled"]) {
                    startTimeOfConnectedCall = arr[arr.length - 1].Status["canceled"];
                }
                startTimeOfConnectedCall = arr[arr.length - 1].Status["no-answer"];
            }
            // console.log("startTimeOfFirstCall ",startTimeOfFirstCall)
            // console.log("startTimeOfConnectedCall ",startTimeOfConnectedCall)
            let startTime = new Date(startTimeOfFirstCall);
            let endTime = new Date(startTimeOfConnectedCall);
            let diff = endTime.getTime() - startTime.getTime();
            let diffSeconds = Math.floor(diff / 1000);
            // let diffMinutes = Math.floor(diff / 60000)
            // let diffHours = Math.floor(diff / 3600000)
            // console.log("diffSeconds ",diffSeconds)
            // console.log("diffMinutes ",diffMinutes)
            // console.log("diffHours ",diffHours)
            return { QueueTime: diffSeconds.toString() };
        }
        else {
            result = { QueueTime: queueTime };
        }
        return result;
    };
    useAuthIdToGetUserDetails = async (authId) => {
        let myQuery = { auth_id: authId };
        let userDetails = await UserPermissionUserModel_1.default.findOne(myQuery);
        return userDetails;
    };
    calculateFinalStatus = (data) => {
        logger_1.default.info("Last Call 1274 : " + data);
        let FinalStatus = "completed";
        if (!data)
            return FinalStatus;
        const format = JSON.stringify(data);
        if (format === "[{}]")
            return FinalStatus;
        let tempArray = data;
        if (tempArray.length > 0) {
            const lastCall = tempArray[tempArray.length - 1];
            const lastCallStatus = lastCall.Status;
            if (lastCallStatus["no-answer"] !== undefined) {
                FinalStatus = "no-answer";
            }
            if (lastCallStatus["busy"] !== undefined) {
                FinalStatus = "no-answer";
            }
            if (lastCallStatus["canceled"] !== undefined) {
                FinalStatus = "no-answer";
            }
            if (lastCallStatus["failed"] !== undefined) {
                FinalStatus = "no-answer";
            }
            if (lastCallStatus["completed"] !== undefined) {
                FinalStatus = "completed";
            }
        }
        if (tempArray.length === 0) {
            FinalStatus = "completed";
        }
        return FinalStatus;
    };
    checkTheChildIsFromSameParentCall = async (parentCallSid) => {
        const query = { "ParentCall.ParentCallSid": parentCallSid };
        const result = await ivrFlowModel_1.default.findOne(query);
        // console.log("Result : ", result);
        if (result !== null && result !== undefined) {
            return { status: false, value: result };
        }
        else {
            return { status: true, value: result };
        }
    };
    getCountryCode = (input) => {
        const firstLetterOfNumber = input[0];
        if (firstLetterOfNumber === "1") {
            logger_1.default.info("It is a USA number");
            return "1";
        }
        else {
            logger_1.default.info("It is not a USA number");
            const countryCode = input.substring(0, 2);
            logger_1.default.info("Country Code : " + countryCode);
            return countryCode;
        }
    };
    fetchUserIdFromConnectedChildCall = (data, direction, userId) => {
        // console.log("Data : ", data);
        let result = { status: false, userID: "" };
        const completedChildCallDetails = data.find((item) => item["Status"]["completed"]);
        // console.log("Completed : child call : ", completedChildCallDetails, result);
        if (completedChildCallDetails) {
            if (completedChildCallDetails.userId) {
                result = { status: true, userID: completedChildCallDetails.userId };
            }
            if (direction) {
                if (direction === "outbound") {
                    if (userId) {
                        result = { status: true, userID: userId };
                    }
                }
            }
        }
        return result;
    };
    replaceCallSidWithDocIdInTickets = (CallSid, ObjId) => {
        const query = { ParentCallSid: CallSid };
        const updates = {
            $push: {
                "conversations.voice": {
                    $each: [ObjId],
                    $position: 0,
                },
            },
        };
        TicketListModel_1.default.updateOne(query, updates)
            .then((data) => {
            console.log("Ticket updates : ", data);
        })
            .catch((err) => {
            console.log("Error : ", err);
        });
    };
    addAssignUserToContact = async (contactId, userId) => {
        logger_1.default.info("Contact id need to update with AssignUser : " + contactId);
        logger_1.default.info("Call which is connected : " + userId);
        const query = { _id: contactId };
        const updates = {
            $set: {
                AssignUser: userId,
                AssignTo: userId,
            },
        };
        contactModel
            .findByIdAndUpdate(query, updates)
            .then((response) => {
            logger_1.default.info("Assiged to Contact : " + JSON.stringify(response));
        })
            .catch((err) => {
            logger_1.default.error("Err : ", err);
        });
    };
    useConferenceDetailsToConvertData = async (body) => {
        logger_1.default.info("Body Received to format :" + JSON.stringify(body));
        //Initially we a concept of MPC node under MPC node in ivr-flow so we use this
        // const isNewChildCall = await this.checkTheChildIsFromSameParentCall(
        //   body?.ParentCallSid
        // );
        // console.log("New Child Call : ", isNewChildCall);
        //Now MPC under MPC is deprecated so we are not using above
        const isNewChildCall = { status: true, value: { listOfChildCalls: [] } };
        let ParentCallSid = body?.ParentCallSid;
        let ChildCallSid = body?.ChildCallSid;
        let Notes = body.Notes ? body.Notes : [];
        let Tag = body.Tags ? body.Tags : [];
        let Source = body.Source ? body.Source : "";
        let userID = body.userID ? { userID: body.userID } : {};
        let listOfChildCallSid = body?.listOfChildCallSid;
        if (listOfChildCallSid[0] === null)
            return;
        if (body?.listOfChildCallSid.length > 0) {
            listOfChildCallSid = [...new Set(body?.listOfChildCallSid)];
        }
        if (body.listOfAgentsCallSid) {
            if (body.listOfAgentsCallSid.length > 0) {
                listOfChildCallSid = [
                    ...listOfChildCallSid,
                    ...body.listOfAgentsCallSid,
                ];
                listOfChildCallSid = [...new Set(listOfChildCallSid)];
            }
        }
        let arrayOfFormattedChildCalls = await this.useArrayOfChildCallsToMakeChildCallLifeCycle(listOfChildCallSid);
        // console.log("arrayOfFormattedChildCalls ", arrayOfFormattedChildCalls);
        let formattedArrayOfChildCallsAccordingToTime = this.sortArrayOfChildCallsAccordingTotime(arrayOfFormattedChildCalls);
        //console.log("formattedArrayOfChildCallsAccordingToTime ",formattedArrayOfChildCallsAccordingToTime)
        let queueTimeObj = {};
        let responseOfUser = { status: false, userID: undefined };
        if (formattedArrayOfChildCallsAccordingToTime.length > 0) {
            const Direction = body.DirectionFromCloudPhone
                ? body.DirectionFromCloudPhone.toLowerCase()
                : "inbound";
            const userId = body.userID ? body.userID : undefined;
            responseOfUser = this.fetchUserIdFromConnectedChildCall(formattedArrayOfChildCallsAccordingToTime, Direction, userId);
            // console.log("Response of User : ", responseOfUser);
            if (responseOfUser.status) {
                userID = { userID: responseOfUser.userID };
            }
            queueTimeObj = this.calculateQueueTimeForParticularCall(formattedArrayOfChildCallsAccordingToTime);
        }
        // let queueTimeObj = this.calculateQueueTimeForParticularCall(formattedArrayOfChildCallsAccordingToTime)
        const detailsOfParentCallSid = await ivrStudiosModelCallBacks_1.default.find({
            ParentCallSid: ParentCallSid,
        }).sort("subscribeDate");
        const detailsOfChildCallSid = await ivrStudiosModelCallBacks_1.default.find({
            ParentCallSid: ChildCallSid,
        }).sort("subscribeDate");
        // console.log("detailsOfParentCallSid 548 :  ",detailsOfParentCallSid)
        // console.log("detailsOfChildCallSid 549 :  ",detailsOfChildCallSid)
        // let FinalCallStatus = 'no-answer'
        let FinalCallStatus = body.FinalCallStatus
            ? body.FinalCallStatus
            : "completed";
        let parentCallDuration;
        let Receiver = "not-connected";
        let ConnectedChildCallDuration;
        let ReceiverInOutBound = body.ReceiverInOutBound
            ? body.ReceiverInOutBound
            : "";
        const userDetails = await this.useAuthIdToGetUserDetails(detailsOfParentCallSid[0].AccountSid);
        let unAttendedCallCdrList = [];
        if (detailsOfParentCallSid.length > 0) {
            for (let i = 0; i < detailsOfParentCallSid.length; i++) {
                if (detailsOfParentCallSid[i]?.CallStatus === "completed") {
                    parentCallDuration = detailsOfParentCallSid[i]?.CallDuration;
                }
            }
        }
        detailsOfChildCallSid.map((val) => {
            //   if(val.CallStatus === 'completed' || val.CallStatus === 'busy' || val.CallStatus === 'failed' || val.CallStatus === 'no-answer' || val.CallStatus === 'canceled'){
            //     FinalCallStatus = val.CallStatus
            // }
            if (val.CallStatus === "completed") {
                Receiver = val.To;
                ConnectedChildCallDuration = val.CallDuration;
            }
            if (val.CallStatus === "initiated") {
                ReceiverInOutBound = val.To;
            }
        });
        // console.log("Receiver ",Receiver)
        // console.log("FinalCallStatus ",FinalCallStatus)
        let bodyOfIvrFlow = await this.makeObjectFromArrayOfObjects(detailsOfParentCallSid, detailsOfChildCallSid);
        if (body.DirectionFromCloudPhone !== undefined &&
            body.DirectionFromCloudPhone !== null) {
            bodyOfIvrFlow.CloudNumber = body.CloudNumber;
        }
        //console.log("body of ivr flow : ", bodyOfIvrFlow)
        let Called = bodyOfIvrFlow.CloudNumber.slice(-12);
        if (body.FinalDirection) {
            bodyOfIvrFlow.ParentCall.Direction = body.FinalDirection;
        }
        //  if(detailsOfChildCallSid.length > 0){
        //   if(detailsOfChildCallSid[0].Called){
        //     Called = this.checkCalledFormat(detailsOfParentCallSid[0].Called)
        //   }
        //  }
        // if(detailsOfChildCallSid[0].Called){
        //   Called = this.checkCalledFormat(detailsOfParentCallSid[0].Called)
        // }
        // let Called = this.checkCalledFormat(detailsOfParentCallSid[0].Called)
        // console.log("Caller ",Called)
        const FlowId = await ivrFlowUIModel_1.default.find({ number: Called });
        // console.log("FlowId ", FlowId);
        const ivrDetails = this.useParentCallDetailsArrayToFormatDigits(detailsOfParentCallSid, FlowId);
        // console.log("ivrDetails ", ivrDetails);
        if (FlowId.length > 0) {
            if (FlowId[0]._id !== undefined) {
                bodyOfIvrFlow.FlowId = FlowId[0]?._id;
                bodyOfIvrFlow.FlowName = FlowId[0]?.name;
            }
        }
        // console.log("detailsOfParentCallSid : ", detailsOfParentCallSid);
        let CallerType = await this.checkIfCallerIsCallingFirstTimeOfNot(detailsOfParentCallSid[0].Caller);
        // if (FlowId[0]._id !== undefined){
        //     bodyOfIvrFlow.FlowId = FlowId[0]?._id;
        //     bodyOfIvrFlow.FlowName = FlowId[0]?.name;
        // }
        // console.log("bodyOfIvrFlow ",bodyOfIvrFlow)
        FinalCallStatus = this.calculateFinalStatus(arrayOfFormattedChildCalls);
        const MissedCallType = FinalCallStatus !== "completed" ? "Unattended" : "Attended";
        // console.log(
        //   "Is Customer Automated Call Back service is on : ",
        //   userDetails.callBackActive
        // );
        // console.log("Status of Final Call Status : ", FinalCallStatus);
        //console.log("body of ivr flow ",bodyOfIvrFlow)
        const Caller = bodyOfIvrFlow.ParentCall.From
            ? bodyOfIvrFlow.ParentCall.From.slice(-10)
            : "";
        const CloudNumber = bodyOfIvrFlow.CloudNumber
            ? bodyOfIvrFlow.CloudNumber.slice(-12)
            : "";
        let countryCode = "91";
        if (CloudNumber) {
            countryCode = this.getCountryCode(CloudNumber);
        }
        // console.log("Country Details : ", countryCode);
        //console.log("Caller ",Caller)
        // console.log("CloudNumber ",CloudNumber)
        const numberDetails = await this.useNumberToFindDetailsOfCloudNumber(CloudNumber);
        const nameOfNumber = numberDetails.length > 0 ? numberDetails[0].name : "";
        // console.log("nameOfNumber ",nameOfNumber)
        //console.log("Receiver : ", Receiver)
        const contactDetails = await this.useNumberToFoundDetailsOfContacts(Caller, detailsOfParentCallSid[0].AccountSid);
        //console.log("contactDetails of Caller : ",contactDetails.length)
        let contactId;
        if (contactDetails.length > 0) {
            //console.log("Contact id : ", contactDetails[0]._id , contactDetails[0])
            contactId = contactDetails[0]._id;
        }
        let FinalReceiver;
        if (bodyOfIvrFlow.ParentCall.Direction === "outbound-api") {
            FinalReceiver = ReceiverInOutBound;
        }
        else {
            FinalReceiver = Receiver;
        }
        // console.log("Final Receiver : ", FinalReceiver)
        const contactDetailsOfReceiver = await this.useNumberToFoundDetailsOfContacts(FinalReceiver.slice(-10), detailsOfParentCallSid[0].AccountSid);
        //console.log("contactDetailsOfReceiver ",contactDetailsOfReceiver)
        let contactIdOfReceiver;
        if (contactDetailsOfReceiver.length > 0) {
            //console.log("Contact id : ", contactDetailsOfReceiver[0]._id , contactDetailsOfReceiver[0])
            contactIdOfReceiver = contactDetailsOfReceiver[0]._id;
        }
        const callerFirstName = contactDetails.length > 0 ? contactDetails[0].firstName : "Unknown";
        const callerLastName = contactDetails.length > 0 ? contactDetails[0].lastName : "";
        const ReceiverFirstName = contactDetailsOfReceiver.length > 0
            ? contactDetailsOfReceiver[0].firstName
            : "Unknown";
        const ReceiverLastName = contactDetailsOfReceiver.length > 0
            ? contactDetailsOfReceiver[0].lastName
            : "";
        const CallerFullName = callerFirstName + " " + callerLastName;
        const ReceiverFullName = ReceiverFirstName + " " + ReceiverLastName;
        if (contactDetails.length === 0) {
            const ContactModel = new contactModel({
                firstName: "Unknown",
                lastName: "",
                phoneNumber: `${countryCode}${Caller}`,
                user_id: userDetails?._id,
                AccountSid: userDetails?.auth_id,
            });
            // console.log("New Contact ID Inbound : ", ContactModel);
            contactId = ContactModel._id;
            await ContactModel.save();
        }
        //console.log("Contact details of Reciever : ", contactDetailsOfReceiver , FinalReceiver.slice(-10) )
        if (!FinalReceiver.slice(-10).includes("connected")) {
            if (contactDetailsOfReceiver.length === 0) {
                const ContactModel = new contactModel({
                    firstName: "Unknown",
                    lastName: "",
                    phoneNumber: `${countryCode}${Receiver.slice(-10)}`,
                    user_id: userDetails?._id,
                    AccountSid: userDetails?.auth_id,
                });
                // console.log("New Contact ID Outbound : ", ContactModel);
                contactIdOfReceiver = ContactModel._id;
                await ContactModel.save();
            }
        }
        // console.log("CallerFullName ",CallerFullName)
        // console.log("ReceiverFullName ",ReceiverFullName)
        const ContactName = bodyOfIvrFlow.ParentCall.Direction === "outbound-api"
            ? ReceiverFullName
            : CallerFullName;
        const ContactNumber = bodyOfIvrFlow.ParentCall.Direction === "outbound-api"
            ? FinalReceiver
            : `${countryCode}${Caller}`;
        const FinalContactId = bodyOfIvrFlow.ParentCall.Direction === "outbound-api"
            ? contactIdOfReceiver
            : contactId;
        // console.log("ContactName : ", ContactName)
        // console.log("ContactNumber : ", ContactNumber)
        if (responseOfUser.status) {
            this.addAssignUserToContact(FinalContactId, responseOfUser.userID);
        }
        // console.log("Body.FinalCallStatus : ", body.FinalCallStatus);
        if (!isNewChildCall.status) {
            logger_1.default.info("Add to existing Call Records Because the Parent CAll ID is same");
            let finalDataToSave = {
                Notes: Notes,
                ...bodyOfIvrFlow,
                ...queueTimeObj,
                ContactName: ContactName,
                ContactNumber: ContactNumber,
                Source: Source,
                ...userID,
                contactId: FinalContactId,
                CallerName: CallerFullName,
                ReceiverName: ReceiverFullName,
                CloudNumberName: nameOfNumber,
                UnAttendedCallCdrList: unAttendedCallCdrList,
                CallerType: CallerType.CallerType,
                Receiver: Receiver,
                CallStatus: body.FinalCallStatus
                    ? body.FinalCallStatus
                    : FinalCallStatus,
                MissedCallType: MissedCallType,
                ParentCallDuration: parentCallDuration,
                ConnectedChildCallDuration: ConnectedChildCallDuration,
                listOfChildCalls: [
                    ...isNewChildCall.value.listOfChildCalls,
                    ...arrayOfFormattedChildCalls,
                ],
                ivrDetails: [...ivrDetails],
                Tags: Tag,
            };
            let formattedData = this.checkDataFormatAndAddPlusToAllNumber(finalDataToSave);
            const query = { "ParentCall.ParentCallSid": body?.ParentCallSid };
            await ivrFlowModel_1.default.updateOne(query, {
                $set: { ...formattedData },
            });
            return;
        }
        else {
            let finalDataToSave = {
                Notes: Notes,
                ...bodyOfIvrFlow,
                ...queueTimeObj,
                ContactName: ContactName,
                ContactNumber: ContactNumber,
                Source: Source,
                ...userID,
                contactId: FinalContactId,
                CallerName: CallerFullName,
                ReceiverName: ReceiverFullName,
                CloudNumberName: nameOfNumber,
                UnAttendedCallCdrList: unAttendedCallCdrList,
                CallerType: CallerType.CallerType,
                Receiver: Receiver,
                CallStatus: body.FinalCallStatus
                    ? body.FinalCallStatus
                    : FinalCallStatus,
                MissedCallType: MissedCallType,
                ParentCallDuration: parentCallDuration,
                ConnectedChildCallDuration: ConnectedChildCallDuration,
                listOfChildCalls: [...arrayOfFormattedChildCalls],
                ivrDetails: [...ivrDetails],
                Tags: Tag,
            };
            let formattedData = this.checkDataFormatAndAddPlusToAllNumber(finalDataToSave);
            const data = new ivrFlowModel_1.default(formattedData);
            data
                .save()
                .then(async (response) => {
                // console.log("Response : ", response)
                if (finalDataToSave.AccountSid === '4I8LSQ37HRWBC998VFJ7') {
                    console.log("Data : ", finalDataToSave, data);
                    const response = await this.zohoIntegerationForParticularClient(finalDataToSave);
                    console.log("Respoinse : ", response);
                }
                this.deductBalanceFromCredits(response, 'call', 50);
                this.replaceCallSidWithDocIdInTickets(formattedData.ParentCall.ParentCallSid, data._id);
                // console.log("data saved it is a conference call", finalDataToSave);
            })
                .catch((err) => {
                logger_1.default.error("error in saving data " + err);
            });
        }
    };
    zohoIntegerationForParticularClient = async (data) => {
        let url = conf.ZOHO_INTEGERATION_URL + '/api/contacts/send';
        // let url = "http://localhost:8000/api/contacts/save"
        // const body = data
        const options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...data })
        };
        console.log("Option : ", options);
        return new Promise((resolve, reject) => {
            httpClient(options, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                resolve(body);
            });
        });
    };
    createCreditLog = async (data, source, amount, companyId) => {
        const utcMoment = moment_1.default.utc();
        const utcDate = new Date(utcMoment.format());
        let tempData = {
            companyId: companyId,
            source: source,
            amount: amount,
            createdAt: utcDate,
            callId: null,
            smsId: null,
            numberId: null
        };
        if (source === 'call') {
            tempData.callId = data._id;
        }
        await (0, CreditCdrModel_1.createCreditCdr)(tempData);
    };
    deductBalanceFromCredits = async (data, source, amount) => {
        if (source === "call") {
            const authId = data.AccountSid;
            // get company id
            let companyId;
            const queryToGetCompanyDetails = { authId: authId };
            try {
                const userDetails = await (0, vibconnectModel_1.getVibconnect)(queryToGetCompanyDetails);
                if (userDetails.length > 0) {
                    companyId = userDetails[0].companyId;
                    const queryForSubscription = { companyId: companyId };
                    const update = { $inc: { credits: -amount } };
                    const option = { upsert: false };
                    const currentPlan = await (0, SubscriptionModel_1.getOneSubscription)(queryForSubscription);
                    // console.log('Current Plan ', currentPlan) 
                    if (currentPlan) {
                        if (currentPlan?.credits >= 0) {
                            //deduct balance
                            await (0, SubscriptionModel_1.updateOneSubscription)(queryForSubscription, update, option);
                            await this.createCreditLog(data, source, amount, companyId);
                        }
                        else {
                            //Don't have balance just blocked all his number
                            const queryToUpdateWorkFlow = { auth_id: authId };
                            const updates = { $set: { haveCredits: false } };
                            const options = { upsert: false };
                            (0, IvrFlowUIModel_1.updateManyWorkFlow)(queryToUpdateWorkFlow, updates, options);
                        }
                    }
                }
            }
            catch (err) {
                logger_1.default.error("Error in deducting credits : " + err);
            }
        }
        if (source === "sms") {
            // get company id
            const companyId = data.companyId;
            try {
                const queryForSubscription = { companyId: companyId };
                const update = { $inc: { credits: -amount } };
                const option = { upsert: false };
                //deduct balance
                await (0, SubscriptionModel_1.updateOneSubscription)(queryForSubscription, update, option);
                await this.createCreditLog(data, source, amount, companyId);
            }
            catch (err) {
                logger_1.default.error("Error in deducting credits : " + err);
            }
        }
    };
    checkDataFormatAndAddPlusToAllNumber = (data) => {
        const tempObj = data;
        if (tempObj.CloudNumber !== undefined && tempObj.CloudNumber !== null) {
            if (!tempObj.CloudNumber.includes("+")) {
                tempObj.CloudNumber = `+${tempObj.CloudNumber}`;
            }
        }
        if (tempObj.ContactNumber !== undefined && tempObj.ContactNumber !== null) {
            if (!tempObj.ContactNumber.includes("+")) {
                tempObj.ContactNumber = `+${tempObj.ContactNumber}`;
            }
        }
        if (tempObj.Receiver !== undefined && tempObj.Receiver !== null) {
            if (!tempObj.Receiver.includes("+")) {
                tempObj.Receiver = `+${tempObj.Receiver}`;
            }
        }
        return tempObj;
    };
    useNumberToFindDetailsOfCloudNumber = async (number) => {
        const numberDetails = await numbers_1.default.find({
            phone_number: { $regex: number },
        });
        return numberDetails;
    };
    useNumberToFoundDetailsOfContacts = async (number, AccountSid) => {
        const contactDetails = await contactModel.find({
            AccountSid: AccountSid,
            phoneNumber: { $regex: number },
        });
        return contactDetails;
    };
    useConferenceCallBackToUpdateRealTimeOfConference = async (body) => {
        let parentSid = body.FriendlyName.split("_")[1];
        const query = { ParentCallSid: parentSid };
        const foundDetailsOfParticularCall = await IvrStudiousRealTime_1.default.find(query);
        // console.log("foundDetailsOfParticularCall ", foundDetailsOfParticularCall);
        if (foundDetailsOfParticularCall.length > 0) {
            let conferenceId = body.ConferenceSid;
            let friendlyName = body.FriendlyName;
            let statusCallbackEvent = body.StatusCallbackEvent;
            let confernceIdObj = conferenceId ? { ConferenceSid: conferenceId } : {};
            let friendlyNameObj = friendlyName ? { FriendlyName: friendlyName } : {};
            let statusCallbackEventObj = statusCallbackEvent
                ? { StatusCallbackEvent: statusCallbackEvent }
                : {};
            let finalObj = {
                ...confernceIdObj,
                ...friendlyNameObj,
                ...statusCallbackEventObj,
            };
            const updates = { $set: { ...finalObj } };
            await IvrStudiousRealTime_1.default.updateOne(query, updates);
        }
    };
    sendKillCallRequestToVibconnect = async (callId, authId, authSecretId) => {
        const link = `https://api.vibconnect.io/v1/Accounts/${authId}/Calls/${callId}`;
        const tok = authId + ":" + authSecretId;
        const hash = Buffer.from(tok).toString("base64");
        const options = {
            method: "POST",
            url: link,
            headers: {
                Authorization: "Basic " + hash,
            },
            body: JSON.stringify({
                Status: "completed",
            }),
        };
        logger_1.default.info("details to kill API : " + JSON.stringify(options));
        return new Promise((resolve, reject) => {
            httpClient(options, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                resolve(body);
            });
        });
    };
    killTheInitiatedCallIfCustomerHangUpCall = async (parentCallSid, AccountSid) => {
        // console.log("AccountSid : ", AccountSid);
        // console.log(
        //   "ParentCallSid of the call which we need to kill : ",
        //   parentCallSid
        // );
        const userDetails = await this.getUserDetailsUsingAuthID(AccountSid);
        let AuthSecretId = userDetails.auth_secret;
        const killApiResponse = await this.sendKillCallRequestToVibconnect(parentCallSid, AccountSid, AuthSecretId);
        logger_1.default.info("killApiResponse " + killApiResponse);
    };
    killAllCallsOfParellelCall = async (listOfAgentsCallSid, AccountSid) => {
        logger_1.default.info("list of agents : " + listOfAgentsCallSid);
        await Promise.all(listOfAgentsCallSid.map(async (sid) => {
            if (sid !== undefined) {
                await this.killTheInitiatedCallIfCustomerHangUpCall(sid, AccountSid);
            }
        }));
    };
    saveDataToIvrStudiosCdr = async (body) => {
        // console.log("body of save data to ivr studios cdr : ", body);
        let dateAfterThreeDay;
        dateAfterThreeDay = (0, moment_1.default)().add(2, "d").toDate();
        const callBackStatus = new ivrStudiosModelCallBacks_1.default({
            ...body,
            source: "cloud_phone_outbound",
            expireDate: dateAfterThreeDay,
        });
        await callBackStatus.save();
        // console.log("result of save data to ivr studios cdr : ", result);
    };
    checkTheNumberContainsSymbolOrNOT(number) {
        // console.log("number : ", number);
        number = decodeURIComponent(number);
        if (number.includes("+")) {
            return number.replace(/[^0-9]/g, "");
        }
        return number;
    }
    async RecieveConferenceCallBacksAndSave(req, res) {
        const body = req.body;
        logger_1.default.info('callbacks of conference : ' + JSON.stringify(body));
        this.useConferenceCallBackToUpdateRealTimeOfConference(body);
        const current_time = new Date();
        const afterThreeHours = new Date(current_time.getTime() + 2 * 60 * 60 * 1000);
        const callBacks = new ConferenceCallBacksModel_1.default({
            ...body,
            expireAt: afterThreeHours,
        });
        const result = await callBacks.save();
        const myQuery = { FriendlyName: body.FriendlyName };
        const myUpdate = {
            $set: {
                StatusCallbackEvent: body.StatusCallbackEvent,
                TimeStamp: body.Timestamp,
                ConferenceSid: body.ConferenceSid,
                ConferenceId: body.ConferenceSid,
            },
        };
        const myOptions = { upsert: false };
        // console.log("my query ",myQuery , " my update ", myUpdate , " my options ", myOptions)
        const ifConferenceExist = await ConferenceModel_1.default.findOne(myQuery);
        // console.log("ifConferenceExist ",ifConferenceExist)
        if (ifConferenceExist) {
            //new logic if customer cuts the call before agents pick-up
            if (body.StatusCallbackEvent == "participant-leave") {
                // const myQuery = {"FriendlyName" : body.FriendlyName}
                const listOfAllCallBacks = await ConferenceCallBacksModel_1.default.find(myQuery);
                //console.log("listOfAllCallBacks ",listOfAllCallBacks)
                let noOfParticipantsJoins = [];
                let noOfParticipantsLeaves = [];
                for (let i = 0; i < listOfAllCallBacks.length; i++) {
                    if (listOfAllCallBacks[i].StatusCallbackEvent === "participant-join") {
                        noOfParticipantsJoins.push(listOfAllCallBacks[i]);
                    }
                    if (listOfAllCallBacks[i].StatusCallbackEvent === "participant-leave") {
                        noOfParticipantsLeaves.push(listOfAllCallBacks[i]);
                    }
                }
                // const noOfParticipantsJoins = listOfAllCallBacks.find((item : any) => item.StatusCallbackEvent == "participant-join")
                logger_1.default.info("noOfParticipantsJoins " + typeof noOfParticipantsJoins.length + noOfParticipantsJoins.length);
                logger_1.default.info("noOfParticipantsLeaves " + typeof noOfParticipantsLeaves.length + noOfParticipantsLeaves.length);
                let noOfParticipantsPresentInConference = noOfParticipantsJoins.length - noOfParticipantsLeaves.length;
                logger_1.default.info('no of participants in inbound call ' + noOfParticipantsPresentInConference);
                // here it is not 1 because we are first saving the callback in db and then fetching it so it 0
                if (noOfParticipantsPresentInConference === 1) {
                    let conferenceId = req.body.ConferenceSid;
                    let authId = ifConferenceExist.AccountSid
                        ? ifConferenceExist.AccountSid
                        : "";
                    let authSecretId = ifConferenceExist.AccountSecretId
                        ? ifConferenceExist.AccountSecretId
                        : "";
                    const queryToFetchVibCred = { authId: authId };
                    const vibconnectCred = await (0, vibconnectModel_1.getVibconnect)(queryToFetchVibCred);
                    if (vibconnectCred) {
                        authSecretId = vibconnectCred[0].authSecret;
                        const endConferencee = await (0, index_3.endConference)(authId, authSecretId, conferenceId);
                        console.log("result of end conference if participants in call is 1 :", endConferencee);
                    }
                }
                if (noOfParticipantsLeaves.length === 1) {
                    if (noOfParticipantsJoins.length === 1) {
                        const dataFromConferenceWithSource = await ConferenceModel_1.default.findOne({
                            FriendlyName: body.FriendlyName,
                        });
                        logger_1.default.info("dataFromConferenceWithSource " +
                            dataFromConferenceWithSource.source +
                            " : " +
                            JSON.stringify(dataFromConferenceWithSource));
                        if (dataFromConferenceWithSource.callDistributionType === "Parallel") {
                            const listOfAgentsCallSid = dataFromConferenceWithSource.listOfAgentsCallSid;
                            const AccountSid = dataFromConferenceWithSource.AccountSid;
                            await this.killAllCallsOfParellelCall(listOfAgentsCallSid, AccountSid);
                        }
                        let AccountSid = dataFromConferenceWithSource.AccountSid;
                        let ParentCallSidOfChildCallWhichWeNeedToKill = dataFromConferenceWithSource.ChildCallSid;
                        this.killTheInitiatedCallIfCustomerHangUpCall(ParentCallSidOfChildCallWhichWeNeedToKill, AccountSid);
                        // if(dataFromConferenceWithSource?.CallStatus == "initiated"|| dataFromConferenceWithSource?.CallStatus == "ringing"){
                        let bodyForFakeAction = {
                            FriendlyName: dataFromConferenceWithSource.FriendlyName,
                            ParentCallSid: dataFromConferenceWithSource.ParentCallSid,
                            ConferenceSid: dataFromConferenceWithSource.ConferenceSid,
                            ConferenceId: dataFromConferenceWithSource.ConferenceSid,
                            ChildCallSid: dataFromConferenceWithSource.ChildCallSid,
                            CallStatus: "customer-hangup",
                            StatusCallbackEvent: "conference-end",
                        };
                        const newCallStatusOfApiCall = {
                            $set: { CallStatus: "customer-hangup" },
                        };
                        await ConferenceModel_1.default.findOneAndUpdate(myQuery, newCallStatusOfApiCall, myOptions);
                        const result = await this.makeFakeRequestToActionToSendMessage(bodyForFakeAction, dataFromConferenceWithSource.id, dataFromConferenceWithSource.source);
                        logger_1.default.info("result of fake action " + JSON.stringify(result));
                        // }
                        // const newCallStatusOfApiCall = {$set : {"CallStatus" : "customer-hung-up"}}
                        // const updatedConferenceLiveCallStatus = await ConferenceModel.findOneAndUpdate(myQuery, newCallStatusOfApiCall ,myOptions)
                        // console.log("updatedConferenceLiveCallStatus ",updatedConferenceLiveCallStatus)
                        // const result = await this.makeFakeRequestToActionToSendMessage(bodyForFakeAction, dataFromConferenceWithSource.id , dataFromConferenceWithSource.source)
                        // console.log("result of fake action ",result)
                        // console.log("nof participants joins" , noOfParticipantsJoins)
                    }
                    // if (noOfParticipantsJoins.length >= 2) {
                    //   const dataFromConferenceWithSource: any =
                    //     await ConferenceModel.findOne({
                    //       FriendlyName: body.FriendlyName,
                    //     });
                    //     logger.info(
                    //     "dataFromConferenceWithSource " + 
                    //     dataFromConferenceWithSource.source + 
                    //     " : " + 
                    //     JSON.stringify(dataFromConferenceWithSource)
                    //   );
                    //   if (
                    //     dataFromConferenceWithSource?.CallStatus == "completed" ||
                    //     dataFromConferenceWithSource?.CallStatus == "in-progress"
                    //   ) {
                    //     let bodyForFakeAction: any = {
                    //       FriendlyName: dataFromConferenceWithSource.FriendlyName,
                    //       ParentCallSid: dataFromConferenceWithSource.ParentCallSid,
                    //       ConferenceSid: dataFromConferenceWithSource.ConferenceSid,
                    //       ConferenceId: dataFromConferenceWithSource.ConferenceSid,
                    //       ChildCallSid: dataFromConferenceWithSource.ChildCallSid,
                    //       CallStatus: "completed",
                    //       StatusCallbackEvent: "conference-end",
                    //     };
                    //     const result = await this.makeFakeRequestToActionToSendMessage(
                    //       bodyForFakeAction,
                    //       dataFromConferenceWithSource.id,
                    //       dataFromConferenceWithSource.source
                    //     );
                    //     const update = {
                    //       $set: { source: `${dataFromConferenceWithSource.source}-` },
                    //     };
                    //     const option = { upsert: false };
                    //     await ConferenceModel.findOneAndUpdate(
                    //       { FriendlyName: body.FriendlyName },
                    //       update,
                    //       option
                    //     );
                    //     logger.info("result of fake action " + JSON.stringify(result));
                    //   }
                    //   // const newCallStatusOfApiCall = {$set : {"CallStatus" : "customer-hung-up"}}
                    //   // const updatedConferenceLiveCallStatus = await ConferenceModel.findOneAndUpdate(myQuery, newCallStatusOfApiCall ,myOptions)
                    //   // console.log("updatedConferenceLiveCallStatus ",updatedConferenceLiveCallStatus)
                    //   // const result = await this.makeFakeRequestToActionToSendMessage(bodyForFakeAction, dataFromConferenceWithSource.id , dataFromConferenceWithSource.source)
                    //   // console.log("result of fake action ",result)
                    //   // console.log("nof participants joins" , noOfParticipantsJoins)
                    // }
                }
            }
            if (body.StatusCallbackEvent == "conference-end") {
                setTimeout(() => {
                    // console.log("inside setTimeout" , ifConferenceExist)
                    this.useConferenceDetailsToConvertData(ifConferenceExist);
                }, 10000);
                // setInterval(this.useConferenceDetailsToConvertData(ifConferenceExist),5000)
                const current_time = new Date();
                const nextDay = new Date(current_time.getTime() + 2 * 60 * 60 * 1000);
                const myQuery = { FriendlyName: body.FriendlyName };
                await ConferenceModel_1.default.findOneAndUpdate(myQuery, { $set: { expireAt: nextDay } }, { upsert: false });
                // console.log("update_conference_id ",update_conference_id)
            }
            const result = await ConferenceModel_1.default.findOneAndUpdate(myQuery, myUpdate, myOptions);
            // console.log("result of ConferenceModel ",result)
            this.data = result;
            // this.data = []
            this.status = true;
            this.message = "success";
            return res.json(this.Response());
        }
        if (!ifConferenceExist) {
            const callBacks = new ConferenceModel_1.default({
                ...body,
                ConferenceId: req.body.ConferenceSid,
            });
            // console.log("callBacks saving in conference model ",callBacks)
            const result = await callBacks.save();
            this.data = result;
            this.status = true;
            this.message = "success";
            return res.json(this.Response());
        }
        // console.log("result of ConferenceCallBacksModel ",result)
        this.data = result;
        this.status = true;
        this.message = "success";
        return res.json(this.Response());
    }
    extractAllNumberOfCorrespondingUser = async (detailsOfNumbersFromUI) => {
        // console.log(
        //   "this is the details of call extract numbers using this : ",
        //   detailsOfNumbersFromUI
        // );
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
    getNumberOfUserFromPreviousUserNumber = async (detailsOfMPC, source, previousPhoneNumber) => {
        // console.log("detailsOfMPC ",detailsOfMPC)
        //console.log("source ",source)
        let correctMpcDetails;
        let correctNumberList;
        for (let i = 0; i < detailsOfMPC.length; i++) {
            if (detailsOfMPC[i].id == source) {
                // return detailsOfMPC[i].numberOfUsers
                logger_1.default.info("found correct details of MPC : ", JSON.stringify(detailsOfMPC[i]));
                correctMpcDetails = detailsOfMPC[i];
                // if(detailsOfMPC[i].mpcCallUsing === 'Number'){
                //   return 'no-need-to-check-more'
                // }
                // if(detailsOfMPC[i].mpcCallUsing === 'User'){
                //   console.log("details users ",detailsOfMPC[i].mpcCallUsingNumbers)
                //   return false
                // }
            }
        }
        logger_1.default.info("correctMpcDetails " +
            correctMpcDetails +
            correctMpcDetails.data +
            correctMpcDetails.data.mpcCallUsingNumbers);
        if (correctMpcDetails.data.mpcCallUsing === "Number") {
            correctNumberList = { isUser: false, data: "no-need-to-check-more" };
        }
        if (correctMpcDetails.data.mpcCallUsing === "User") {
            correctNumberList = correctMpcDetails.data.mpcCallUsingNumbers;
            const numbersList = await this.extractAllNumberOfCorrespondingUser(correctMpcDetails.data.mpcCallUsingNumbers);
            //console.log("numbersList ",numbersList)
            let arr = numbersList;
            let id = correctMpcDetails.id;
            for (let i = 0; i < arr.length; i++) {
                let nextNumberToCall = { number: "", ringTimeOut: "", id: "" };
                if (arr[i].number == previousPhoneNumber) {
                    if (arr[i + 1] == undefined) {
                        nextNumberToCall = null;
                        // correctNumberList = {"isUser": true , ...nextNumberToCall}
                        return null;
                    }
                    if (arr[i + 1] !== undefined) {
                        nextNumberToCall.number = arr[i + 1].number;
                        nextNumberToCall.ringTimeOut = arr[i + 1].ringTimeOut;
                        nextNumberToCall.id = id;
                        correctNumberList = { isUser: true, ...nextNumberToCall };
                        // return nextNumberToCall
                    }
                }
            }
        }
        //console.log("correctNumberList ",correctNumberList)
        return correctNumberList;
    };
    findNextNumberFromMoreThanOneMultiPartyCallNode = async (multiPartyCallDetails, To, apiCallDetailsFromConference) => {
        // console.log("multiPartyCallDetails in function ",multiPartyCallDetails)
        // console.log("apiCallDetailsFromConference in function ",apiCallDetailsFromConference)
        // console.log("To in function ",To)
        const output = await this.getNumberOfUserFromPreviousUserNumber(multiPartyCallDetails, apiCallDetailsFromConference.source, To);
        if (output === null) {
            return null;
        }
        if (output !== null) {
            if (output.isUser) {
                logger_1.default.info("output.number " + output);
                return output;
            }
        }
        let x;
        for (let i = 0; i < multiPartyCallDetails.length; i++) {
            // console.log(`multiPartyCallDetails[${i}].To `,multiPartyCallDetails[i].data?.mpcCallUsingNumbers)
            // console.log("API Call details before staring loop ",apiCallDetailsFromConference)
            let y = this.getNextNumberFromMultipleArrayToCall(multiPartyCallDetails[i]?.data?.mpcCallUsingNumbers, To, multiPartyCallDetails[i]?.id, apiCallDetailsFromConference);
            //  console.log("id of founded number  : " , y, " : id from where the call start : ", apiCallDetailsFromConference.source)
            if (y) {
                // return x
                if (y.id == apiCallDetailsFromConference.source) {
                    logger_1.default.info("source of Call Start is same from where we pick next number to call");
                    x = y;
                }
            }
        }
        logger_1.default.info("x " + x);
        return x;
    };
    getNextNumberFromMultipleArrayToCall(arr, customer, id, apiCallDetailsFromConference) {
        for (let i = 0; i < arr.length; i++) {
            let nextNumberToCall = { number: "", ringTimeOut: "", id: "" };
            if (arr[i].number == customer) {
                if (arr[i + 1] == undefined) {
                    nextNumberToCall = null;
                    return null;
                }
                if (arr[i + 1] !== undefined) {
                    nextNumberToCall.number = arr[i + 1].number;
                    nextNumberToCall.ringTimeOut = arr[i + 1].ringTimeOut;
                    nextNumberToCall.id = id;
                    return nextNumberToCall;
                }
            }
        }
        return null;
    }
    getNextNumberToCall(arr, customer, priority) {
        logger_1.default.info("arr " + JSON.stringify(arr) + " : " + customer);
        let nextNumberToCall = { number: "", ringTimeOut: "", priority: 1 };
        for (let i = 0; i < arr.length; i++) {
            if (priority) {
                if (arr[i].number == customer && priority === arr[i].priority) {
                    if (arr[i + 1] == undefined) {
                        nextNumberToCall = null;
                    }
                    if (arr[i + 1] !== undefined) {
                        nextNumberToCall.number = arr[i + 1].number;
                        nextNumberToCall.ringTimeOut = arr[i + 1].ringTimeOut;
                        nextNumberToCall.priority = arr[i + 1].priority;
                    }
                }
            }
            else {
                if (arr[i].number == customer) {
                    if (arr[i + 1] == undefined) {
                        nextNumberToCall = null;
                    }
                    if (arr[i + 1] !== undefined) {
                        nextNumberToCall.number = arr[i + 1].number;
                        nextNumberToCall.ringTimeOut = arr[i + 1].ringTimeOut;
                        nextNumberToCall.priority = arr[i + 1].priority;
                    }
                }
            }
        }
        return nextNumberToCall;
    }
    checkCallerFormat(caller) {
        // console.log("caller ", caller);
        if (caller.includes("+91")) {
            return caller.replace("+", "");
        }
        else if (caller.includes("9122")) {
            return caller;
        }
        else {
            let callerWithPlus = "9133" + caller;
            return callerWithPlus;
        }
    }
    checkCalledFormat(called) {
        if (called.includes("+91")) {
            return called.replace("+", "");
        }
        else if (called.includes("+95")) {
            return called.replace("+", "");
        }
        else {
            let callerWithPlus = called;
            return callerWithPlus;
        }
    }
    sendDetailsToCloudPhoneWebhook = async (details, req) => {
        // console.log("details ", details);
        var io = req.app.get("socketio");
        let callback = details;
        io.of("/dropcodes").on("join", (room) => {
            io.join(room);
            io.of("/dropcodes").to(room).emit("roomData", callback);
        });
        let removed_sip;
        if (details.From[0] === "s") {
            let removed_ip = details.From.split("@")[0];
            removed_sip = removed_ip.split(":")[1];
        }
        if (details.From[0] !== "s") {
            removed_sip = details.From;
        }
        //@ts-ignore
        let call_back_status_incoming = { ...callback, From: removed_sip };
        //this socket is attach to API-call incoming
        io.on("join_incoming", (room) => {
            io.join(room);
            io.to(room).emit("roomData_incoming", call_back_status_incoming);
        });
        //outbound api call socket
        io.of("/dropcodes").emit("test", callback);
        //to send both parent and child call data in API-Call outbound
        io.of("/dropcodes").to(details.ParentCallSid).emit("roomData", callback);
        let agentPhoneNumber = details.To.slice(-12);
        console.log("agent phone number : ", agentPhoneNumber);
        io.of("/dropcodes")
            .to(agentPhoneNumber)
            .emit("roomData_incoming", call_back_status_incoming);
    };
    getDetailsOfAllParallelCall = async (CallSidOfInProgressCall) => {
        //console.log("CallSidOfInProgressCall : ", CallSidOfInProgressCall)
        const foundDetailsFromConference = await ConferenceModel_1.default.findOne({
            listOfAgentsCallSid: { $in: [CallSidOfInProgressCall] },
        });
        //console.log("foundDetailsFromConference : ", foundDetailsFromConference)
        if (foundDetailsFromConference !== null &&
            foundDetailsFromConference !== undefined) {
            return foundDetailsFromConference;
        }
    };
    async ivrStudiosApiCallStatusCallbackForParallelCalling(req, res) {
        let body = req.body;
        logger_1.default.info("body in ivr studios parallel api call status callback : " + JSON.stringify(body));
        //for API Call Status Callback
        this.sendDetailsToCloudPhoneWebhook(body, req); // socket for cloudphone
        let dateAfterThreeDay;
        dateAfterThreeDay = (0, moment_1.default)().add(2, "d").toDate();
        // console.log("dateAfterThreeDay : ", dateAfterThreeDay);
        if (body.CallStatus === "in-progress") {
            const detailsOfParticularCall = await this.getDetailsOfAllParallelCall(body.ParentCallSid);
            //console.log("detailsOfParticularCall : ", detailsOfParticularCall  , detailsOfParticularCall.listOfAgentsCallSid)
            const listOfAgentsCallSid = detailsOfParticularCall.listOfAgentsCallSid;
            //console.log("listOfAgentsCallSid : ", listOfAgentsCallSid)
            const listOfAgentsCallSidWithoutIndex = listOfAgentsCallSid.filter((_item, index) => index !== listOfAgentsCallSid.indexOf(body.CallSid));
            // console.log(
            //   "listOfAgentsCallSidWithoutIndex : ",
            //   listOfAgentsCallSidWithoutIndex
            // );
            const userDetails = await this.useAuthIdToGetUserDetails(body.AccountSid);
            //console.log("userDetails : ", userDetails)
            const authSecret = userDetails.auth_secret;
            const authId = body.AccountSid;
            let callSidOfDeletedCall = [];
            await Promise.all(listOfAgentsCallSidWithoutIndex.map(async (item) => {
                const detailsAfterDeleting = await this.sendKillCallRequestToVibconnect(item, authId, authSecret);
                // console.log("detailsAfterDeleting : ", detailsAfterDeleting);
                const jsonDetailsOfResponse = JSON.parse(detailsAfterDeleting);
                let sid = jsonDetailsOfResponse.sid;
                callSidOfDeletedCall = [...callSidOfDeletedCall, sid];
            }));
            const myQueryToSetListOChildCallToConnected = {
                ParentCallSid: detailsOfParticularCall.ParentCallSid,
            };
            const updateQueryToSetListOChildCallToConnected = {
                $set: {
                    listOfChildCallSid: [
                        ...listOfAgentsCallSidWithoutIndex,
                        body.ParentCallSid,
                    ],
                    ChildCallSid: body.ParentCallSid,
                    CallStatus: "in-progress",
                },
            };
            const optionsToSetListOChildCallToConnected = { upsert: true };
            await ConferenceModel_1.default.updateOne(myQueryToSetListOChildCallToConnected, updateQueryToSetListOChildCallToConnected, optionsToSetListOChildCallToConnected);
        }
        if (body.CallStatus === "no-answer" ||
            body.CallStatus === "failed" ||
            body.CallStatus === "busy" ||
            body.CallStatus === "canceled") {
            const detailsOfParticularCall = await this.getDetailsOfAllParallelCall(body.ParentCallSid);
            if (detailsOfParticularCall !== null &&
                detailsOfParticularCall !== undefined) {
                logger_1.default.info("detailsOfParticularCall : " + detailsOfParticularCall);
                const listOfAgentsCallSid = detailsOfParticularCall.listOfAgentsCallSid;
                //console.log("listOfAgentsCallSid : ", listOfAgentsCallSid)
                const listOfAgentsCallSidWithoutIndex = listOfAgentsCallSid.filter((_item, index) => index !== listOfAgentsCallSid.indexOf(body.CallSid));
                logger_1.default.info("agent whom we still trying  : " +
                    listOfAgentsCallSidWithoutIndex);
                logger_1.default.info("agent who did not pick the call : " + body.CallSid);
                let existingListOfChildCall = [];
                existingListOfChildCall = detailsOfParticularCall.listOfChildCallSid
                    ? detailsOfParticularCall.listOfChildCallSid
                    : [];
                logger_1.default.info("existingListOfChildCall : " + existingListOfChildCall);
                const listOfNewChildCallSidAfterOneWontPickTheCall = [
                    ...existingListOfChildCall,
                    body.CallSid,
                ];
                // shift agent who dont pick the child call to list of child calls
                const myQuery = { _id: detailsOfParticularCall._id };
                const updateQuery = {
                    $set: {
                        listOfChildCallSid: listOfNewChildCallSidAfterOneWontPickTheCall,
                        listOfAgentsCallSid: listOfAgentsCallSidWithoutIndex,
                    },
                };
                const options = { upsert: true };
                await ConferenceModel_1.default.updateOne(myQuery, updateQuery, options);
                if (listOfAgentsCallSidWithoutIndex.length === 0) {
                    // send customer an end conference API because all agents cut the calls
                    let ConferenceId = detailsOfParticularCall.ConferenceId
                        ? detailsOfParticularCall.ConferenceId
                        : "";
                    const userDetails = await this.useAuthIdToGetUserDetails(body.AccountSid);
                    const authSecret = userDetails.auth_secret;
                    const detailsAfterDeleting = await this.endConference(body.AccountSid, authSecret, ConferenceId);
                    logger_1.default.info("detailsAfterDeleting : " +
                        detailsAfterDeleting);
                }
            }
        }
        const ivr_studios_status_call_back = new ivrStudiosModelCallBacks_1.default({
            ...body,
            source: "ivr_studios_status_call_back_apiCall_parallel",
            expireDate: dateAfterThreeDay,
        });
        const result = await ivr_studios_status_call_back.save();
        this.data = [result];
        this.message = "ivr studio status callback";
        this.status = true;
        this.code = 200;
        return res.json(this.Response());
    }
    removeDuplicates = (arr, keyToFilter) => {
        let uniqueNode = [];
        const unique = arr.filter((element) => {
            const isDuplicate = uniqueNode.includes(element[keyToFilter]);
            if (!isDuplicate) {
                uniqueNode.push(element[keyToFilter]);
                return true;
            }
            return false;
        });
        return unique;
    };
    formatMultiPartyNodeDetailsForRoundRobin = async (input, source, lastCalledNumber) => {
        // console.log("source : ", source)
        // console.log("last Called Number : ", lastCalledNumber)
        const multiPartyNodeWeNeedToChange = input.input.filter((item) => item.id === source.slice(0, 5));
        let arrayOfUnchangedNumber;
        if (multiPartyNodeWeNeedToChange.length > 0) {
            const data = multiPartyNodeWeNeedToChange[0].data;
            if (data.mpcCallUsing === "Number") {
                //console.log("data : ", data.mpcCallUsingNumbers)
                arrayOfUnchangedNumber = data.mpcCallUsingNumbers;
            }
        }
        //console.log("array of unchanged : ", arrayOfUnchangedNumber)
        const detailsOfLastCalledNumber = arrayOfUnchangedNumber.filter((item) => item.number === lastCalledNumber);
        //console.log("detailsOfLastCalledNumber : ", detailsOfLastCalledNumber)
        const removeLastCalledNumber = arrayOfUnchangedNumber.filter((item) => item.number !== lastCalledNumber);
        //console.log("removeLastCalledNumber : ", removeLastCalledNumber)
        const newArrayOfUnchangedNumber = [
            ...removeLastCalledNumber,
            ...detailsOfLastCalledNumber,
        ];
        //console.log("newArrayOfUnchangedNumber : ", newArrayOfUnchangedNumber)
        if (multiPartyNodeWeNeedToChange.length > 0) {
            multiPartyNodeWeNeedToChange[0].data.mpcCallUsingNumbers =
                newArrayOfUnchangedNumber;
        }
        //console.log("multiPartyNodeWeNeedToChange : ", multiPartyNodeWeNeedToChange , filterNode)
        const newDocumentAfterRemovingNode = input.input.filter((item) => item.id !== source);
        //console.log("newDocumentAfterRemovingNode : ", newDocumentAfterRemovingNode)
        const newDocumentAfterAddingNode = [
            ...newDocumentAfterRemovingNode,
            ...multiPartyNodeWeNeedToChange,
        ];
        const filterNode = this.removeDuplicates(newDocumentAfterAddingNode, "id");
        input.input = filterNode;
        input.lastCalledNumber = lastCalledNumber;
        //console.log("input input : ", input)
        return input;
    };
    async ivrStudiosApiCallStatusCallback(req, res) {
        let body = req.body;
        logger_1.default.info("body in ivr studios api call status callback " + JSON.stringify(body));
        //for API Call Status Callback
        this.sendDetailsToCloudPhoneWebhook(body, req); // socket for cloudphone
        const myQuery = {
            $or: [{ ChildCallSid: body.CallSid }, { CallSid: body.CallSid }],
        };
        const myQueryForIvrStudiousRealTime = {
            CallSidOfConferenceChildCall: body.CallSid,
        };
        if (body.CallStatus === "completed" || body.CallStatus === "in-progress") {
            // if(body.CallStatus === 'in-progress'){
            const myUpdate = {
                $set: { CallStatus: body.CallStatus, TimeStamp: body.Timestamp },
            };
            const myOptions = { upsert: false };
            await ConferenceModel_1.default.findOneAndUpdate(myQuery, myUpdate, myOptions);
            const myUpdatesForIvrStudiousRealTime = {
                $set: {
                    CallStatus: body.CallStatus,
                    TimeStamp: body.Timestamp,
                    Receiver: body.To,
                },
            };
            await IvrStudiousRealTime_1.default.findOneAndUpdate(myQueryForIvrStudiousRealTime, myUpdatesForIvrStudiousRealTime, myOptions);
            // console.log("result of IvrStudiosApiCallStatusModel : "+ req.body.CallStatus + " : " + result)
            // const data = await IvrStudiosStatusModel.deleteOne({ParentCallSid : body.ParentCallSid , CallStatus : "ringing"})
            // console.log("data deleted in ivr studios status callback ", body ,data  )
        }
        if (body.CallStatus === "initiated" || body.CallStatus === "ringing") {
            const myUpdate = {
                $set: {
                    CallStatus: body.CallStatus,
                    TimeStamp: body.Timestamp,
                    ChildCallSid: body.ParentCallSid,
                },
            };
            const myUpdatesForIvrStudiousRealTime = {
                $set: {
                    CallStatus: body.CallStatus,
                    TimeStamp: body.Timestamp,
                    Receiver: body.To,
                },
            };
            const myOptions = { upsert: false };
            await ConferenceModel_1.default.findOneAndUpdate(myQuery, myUpdate, myOptions);
            await IvrStudiousRealTime_1.default.findOneAndUpdate(myQueryForIvrStudiousRealTime, myUpdatesForIvrStudiousRealTime, myOptions);
            // console.log("result of IvrStudiosApiCallStatusModel initiated : ",result)
        }
        if (body.CallStatus === "completed") {
            const Caller = this.checkCallerFormat(body.Caller);
            // console.log("Caller  : ", Caller);
            const queryToIvrFlowToFoundIfSecondCallExist = {
                auth_id: body.AccountSid,
                number: Caller,
            };
            const ivrWithMultiPartyCall = await ivrFlowUIModel_1.default.findOne(queryToIvrFlowToFoundIfSecondCallExist);
            // console.log("ivrWithMultiPartyCall : ",ivrWithMultiPartyCall)
            if (ivrWithMultiPartyCall !== null) {
                if (ivrWithMultiPartyCall) {
                    const multiPartyCallDetails = ivrWithMultiPartyCall.input.filter((node) => {
                        if (node.type == "MultiPartyCallNode") {
                            return node.data;
                        }
                    });
                    const { data } = multiPartyCallDetails[0];
                    logger_1.default.info("multiPartyCallDetails 2821: ", JSON.stringify(data));
                    // const authId = data.authId;
                    // const authSecret = data.authSecret;
                    // console.log("authId : ", authId , "authSecret : ", authSecret)
                    const roomId = await ConferenceModel_1.default.findOne({
                        ChildCallSid: body.CallSid,
                    });
                    // console.log("roomId : ", roomId)
                    //  await this.endConference(
                    //   authId,
                    //   authSecret,
                    //   roomId.ConferenceId
                    // );
                    if (roomId.callDistributionType === "RoundRobin") {
                        const updatedDocumentAfterSort = await this.formatMultiPartyNodeDetailsForRoundRobin(ivrWithMultiPartyCall, roomId.source, body.To.slice(-12));
                        //console.log("Updated Document : ", updatedDocumentAfterSort ,updatedDocumentAfterSort.input.length)
                        const myUpdate = { $set: { ...updatedDocumentAfterSort } };
                        const myOptions = { upsert: true };
                        await ivrFlowUIModel_1.default.findOneAndUpdate(queryToIvrFlowToFoundIfSecondCallExist, myUpdate, myOptions);
                    }
                }
                if (ivrWithMultiPartyCall.length > 0) {
                    const multiPartyCallDetails = ivrWithMultiPartyCall.input.filter((node) => {
                        if (node.type == "MultiPartyCallNode") {
                            return node.data;
                        }
                    });
                    const { data } = multiPartyCallDetails[0];
                    logger_1.default.info("multiPartyCallDetails : " + JSON.stringify(data));
                    // const authId = data.authId;
                    // const authSecret = data.authSecret;
                    // console.log("authId : ", authId , "authSecret : ", authSecret)
                    const roomId = await ConferenceModel_1.default.findOne({
                        ChildCallSid: body.CallSid,
                    });
                    // console.log("roomId : ", roomId)
                    //We will not end conference when agent hangup now because we are using transfer now.
                    // await this.endConference(
                    //   authId,
                    //   authSecret,
                    //   roomId.ConferenceId
                    // );
                    // console.log("end conference ", end_conference);
                    if (roomId.callDistributionType === "RoundRobin") {
                        const updatedDocumentAfterSort = await this.formatMultiPartyNodeDetailsForRoundRobin(ivrWithMultiPartyCall, roomId.source, body.To.slice(-12));
                        //console.log("Updated Document : ", updatedDocumentAfterSort , updatedDocumentAfterSort.input.length)
                        const myUpdate = { $set: { ...updatedDocumentAfterSort } };
                        const myOptions = { upsert: true };
                        await ivrFlowUIModel_1.default.findOneAndUpdate(queryToIvrFlowToFoundIfSecondCallExist, myUpdate, myOptions);
                    }
                }
            }
        }
        if (body.CallStatus === "failed" ||
            body.CallStatus === "busy" ||
            body.CallStatus === "canceled" ||
            body.CallStatus === "no-answer") {
            const myUpdatesForIvrStudiousRealTime = {
                $set: {
                    CallStatus: body.CallStatus,
                    TimeStamp: body.Timestamp,
                    Receiver: body.To,
                },
            };
            const myOptions = { upsert: false };
            const temp = await IvrStudiousRealTime_1.default.findOneAndUpdate(myQueryForIvrStudiousRealTime, myUpdatesForIvrStudiousRealTime, myOptions);
            // console.log("temp : ", temp);
            // console.log("body.CallStatus : ", body.CallStatus);
            const Caller = this.checkCallerFormat(body.Caller);
            // console.log("Caller : ", Caller, Caller.slice(-8));
            let ivrWithMultiPartyCall;
            if (Caller.slice(-8) === "35315936") {
                // console.log("Caller is 35315936");
                const queryToIvrFlowToFoundIfSecondCallExist = {
                    auth_id: body.AccountSid,
                    defaultNumber: "+912235315936",
                };
                ivrWithMultiPartyCall = await ivrFlowUIModel_1.default.findOne(queryToIvrFlowToFoundIfSecondCallExist);
            }
            else {
                const queryToIvrFlowToFoundIfSecondCallExist = {
                    auth_id: body.AccountSid,
                    number: Caller.slice(-12),
                };
                ivrWithMultiPartyCall = await ivrFlowUIModel_1.default.findOne(queryToIvrFlowToFoundIfSecondCallExist);
            }
            const apiCallDetailsFromConference = await ConferenceModel_1.default.findOne({
                ChildCallSid: body.CallSid,
            });
            //console.log("ivrWithMultiPartyCall : ",ivrWithMultiPartyCall)
            if (ivrWithMultiPartyCall) {
                const multiPartyCallDetails = ivrWithMultiPartyCall.input.filter((node) => {
                    if (node.type == "MultiPartyCallNode") {
                        return node.data;
                    }
                });
                let nexNumberToCall = null;
                // console.log(
                //   "all multiPartyCallDetails : ",
                //   multiPartyCallDetails.length,
                //   multiPartyCallDetails
                // );
                if (multiPartyCallDetails.length > 1) {
                    nexNumberToCall =
                        await this.findNextNumberFromMoreThanOneMultiPartyCallNode(multiPartyCallDetails, body.To, apiCallDetailsFromConference);
                    logger_1.default.info("if multiPartyCallDetails.length > 1 " + nexNumberToCall);
                }
                if (multiPartyCallDetails.length == 1) {
                    const { data } = multiPartyCallDetails[0];
                    // console.log("multiPartyCall list : ", data.mpcCallUsingNumbers)
                    let priority;
                    if (temp) {
                        if (temp.priority) {
                            priority = temp.priority;
                        }
                    }
                    nexNumberToCall = this.getNextNumberToCall(data.mpcCallUsingNumbers, body.To, priority);
                    logger_1.default.info("if multiPartyCallDetails.length == 1  : " +
                        nexNumberToCall + " : " +
                        priority);
                }
                const { data } = multiPartyCallDetails[0];
                const authId = data.authId;
                const authSecret = data.authSecret;
                // console.log("authId : ", authId , "authSecret : ", authSecret)
                if (nexNumberToCall) {
                    if (nexNumberToCall.number === "") {
                        logger_1.default.info("end conference and delete the conference from DataBase");
                        // const roomId = await ConferenceModel.findOne({ChildCallSid : body.CallSid})
                        const myQuery = { ChildCallSid: req.body.ParentCallSid };
                        const newValue = {
                            $set: {
                                CallStatus: body.CallStatus,
                                ChildCallStatus: body.CallStatus,
                            },
                        };
                        const roomId = await ConferenceModel_1.default.findOneAndUpdate(myQuery, newValue);
                        // console.log("roomId : ", roomId);
                        await this.endConference(authId, authSecret, roomId.ConferenceId);
                        // console.log("end conference ", end_conference);
                    }
                    logger_1.default.info("make new API call and replace the ChildCallSid in DataBase");
                    logger_1.default.info("Now checking if the conference is already in progress or not");
                    console.log("nexNumberToCall : ", nexNumberToCall);
                    // console.log("body : ", body )
                    const roomId = await ConferenceModel_1.default.findOne({
                        ChildCallSid: body.CallSid,
                    });
                    let roomIdOfPreviousConferenceNeedToPassOnNewConference = roomId.FriendlyName;
                    let whispherUrlOfThatCall = roomId.whispherUrl;
                    // console.log("roomId : ", roomId);
                    let From = ivrWithMultiPartyCall.number;
                    if (Caller.slice(-12) === "912235315936") {
                        From = "912235315936";
                    }
                    const data = {
                        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call`,
                        statusCallbackEvent: "initiated, ringing, answered, completed",
                        Record: "true",
                        To: nexNumberToCall.number,
                        TimeOut: nexNumberToCall.ringTimeOut,
                        From: From,
                        Method: "GET",
                        // "Url" : `${conf.BaseUrl}/api/getConferenceRoom/${roomIdOfPreviousConferenceNeedToPassOnNewConference}/${whispherUrlOfThatCall}`
                        Url: `${conf.BaseUrl}/api/checkIfCustomerInLine/${roomIdOfPreviousConferenceNeedToPassOnNewConference}/${whispherUrlOfThatCall}`,
                        recordingStatusCallback: `${conf.BaseUrl}/api//vibconnect/webhook/recordings`,
                        recordingStatusCallbackEvent: "in-progress, completed, absent",
                        recordingStatusCallbackMethod: "POST",
                        record: "true",
                    };
                    if (roomId.StatusCallbackEvent === "participant-leave") {
                        logger_1.default.info("customer leaves the call end the conference and don't make a new call");
                        await this.endConference(authId, authSecret, roomId.ConferenceId);
                        // console.log("end conference ", end_conference);
                    }
                    if (roomId.StatusCallbackEvent === "participant-join" ||
                        roomId.StatusCallbackEvent === "conference-create") {
                        logger_1.default.info("customer is in the call make a new call");
                        const callResult = await this.MakeConferenceCall(authId, authSecret, data);
                        const callResultJson = JSON.parse(callResult);
                        const myQuery = { ChildCallSid: req.body.ParentCallSid };
                        const newValue = {
                            $set: {
                                ChildCallSid: callResultJson.sid,
                                CallStatus: body.CallStatus,
                            },
                            $push: { listOfChildCallSid: callResultJson.sid },
                        };
                        await ConferenceModel_1.default.findOneAndUpdate(myQuery, newValue);
                        const queryForRealTimeOfIvrStudious = {
                            CallSidOfConferenceChildCall: body.CallSid,
                        };
                        let updateForRealTimeOfIvrStudious = {
                            $set: {
                                CallSidOfConferenceChildCall: callResultJson.sid,
                                priority: nexNumberToCall.priority,
                            },
                        };
                        await IvrStudiousRealTime_1.default.findOneAndUpdate(queryForRealTimeOfIvrStudious, updateForRealTimeOfIvrStudious);
                    }
                }
                if (!nexNumberToCall) {
                    logger_1.default.info("end conference and delete the conference from DataBase");
                    // const roomId = await ConferenceModel.findOne({ChildCallSid : body.CallSid})
                    const myQuery = { ChildCallSid: req.body.ParentCallSid };
                    const newValue = {
                        $set: {
                            CallStatus: body.CallStatus,
                            ChildCallStatus: body.CallStatus,
                        },
                    };
                    const roomId = await ConferenceModel_1.default.findOneAndUpdate(myQuery, newValue);
                    // console.log("roomId : ", roomId);
                    if (roomId) {
                        await this.endConference(authId, authSecret, roomId.ConferenceId);
                        // console.log("end conference ", end_conference);
                    }
                }
            }
        }
        let dateAfterThreeDay;
        dateAfterThreeDay = (0, moment_1.default)().add(2, "d").toDate();
        // console.log("dateAfterThreeDay : ", dateAfterThreeDay);
        const ivr_studios_status_call_back = new ivrStudiosModelCallBacks_1.default({
            ...body,
            source: "ivr_studios_status_call_back_apiCall",
            expireDate: dateAfterThreeDay,
        });
        const result = await ivr_studios_status_call_back.save();
        this.data = [result];
        this.message = "ivr studio status callback";
        this.status = true;
        this.code = 200;
        return res.json(this.Response());
    }
    async vibconnectMessage(req, res) {
        const body = req.body;
        const myQuery = { sid: body.MessageSid };
        const myUpdate = {
            $set: {
                status: body.MessageStatus,
                num_media: body.NumMedia,
                num_segments: body.NumSegments,
            },
        };
        const myOptions = { upsert: false };
        const result = await smsModel_1.default.findOneAndUpdate(myQuery, myUpdate, myOptions);
        // console.log("result of smsModel ", result);
        this.data = result;
        this.status = true;
        this.message = "success";
        return res.json(this.Response());
    }
    MakeConferenceCall(auth_id, authSecret_id, body) {
        if (body.From.includes("9122") || body.From.includes("918069")) {
            body.From = "+" + body.From;
        }
        if (body.From.includes("911413")) {
            body.From = "+913368110800";
        }
        // console.log("body : ", body);
        if (body.From.includes("++")) {
            body.From.replace("++", "+");
        }
        const link = "https://api.vibconnect.io/v1/Accounts/" + auth_id + "/Calls";
        const tok = auth_id + ":" + authSecret_id;
        const hash = Buffer.from(tok).toString("base64");
        const options = {
            method: "POST",
            url: link,
            headers: {
                Authorization: "Basic " + hash,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...body,
            }),
        };
        logger_1.default.info(JSON.stringify(options));
        return new Promise((resolve, reject) => {
            httpClient(options, (err, res, body) => {
                if (err) {
                    logger_1.default.error("error in Make CallOzora " + err);
                    reject(err);
                }
                //  console.log("res of target ",res)
                logger_1.default.info("body of Make Call " + body);
                resolve(body);
            });
        });
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
                console.log("body of getListOfConference ", body);
                resolve(body);
            });
        });
    }
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
        logger_1.default.info(JSON.stringify(options));
        return new Promise((resolve, reject) => {
            httpClient(options, (err, res, body) => {
                if (err) {
                    logger_1.default.error("error in endOfConference " + err);
                    reject(err);
                }
                //  console.log("res of target ",res)
                logger_1.default.info("body of endOfConference : " + body);
                resolve(body);
            });
        });
    }
    async ivrStudiosStatusCallback(req, res) {
        let body = req.body;
        logger_1.default.info("body in ivr studios status callback : " + JSON.stringify(body));
        // const queryForRealTimeOfIvrStudious = {ParentCallSid : body.ParentCallSid} v.1.0
        let parentCallId = body.ParentCallSid ? body.ParentCallSid : "";
        const queryForRealTimeOfIvrStudious = {
            $or: [{ ParentCallId: parentCallId }, { CallSid: parentCallId }],
        };
        const updates = { $set: { CallStatus: body.CallStatus } };
        await IvrStudiousRealTime_1.default.updateOne(queryForRealTimeOfIvrStudious, updates);
        if (body.CallStatus === "completed" ||
            body.CallStatus === "busy" ||
            body.CallStatus === "no-answer" ||
            body.CallStatus === "failed" ||
            body.CallStatus === "canceled") {
            setTimeout(async () => {
                await IvrStudiousRealTime_1.default.deleteMany(queryForRealTimeOfIvrStudious);
            }, 15000);
        }
        // if(body.CallStatus === "busy" || body.CallStatus === "no-answer" || body.CallStatus === "failed" || body.CallStatus === "canceled"){
        //   setTimeout(async() => {
        //     await IvrStudiosRealTime.deleteMany(queryForRealTimeOfIvrStudious)
        //   }, 15000);
        // }
        let dateAfterThreeDay;
        dateAfterThreeDay = (0, moment_1.default)().add(2, "d").toDate();
        console.log("dateAfterThreeDay : ", dateAfterThreeDay, typeof dateAfterThreeDay);
        const ivr_studios_status_call_back = new ivrStudiosModelCallBacks_1.default({
            ...body,
            source: "ivr_studios_status_call_back",
            expireDate: dateAfterThreeDay,
        });
        const result = await ivr_studios_status_call_back.save().then(async () => {
            if (body.CallStatus === "completed" ||
                body.CallStatus === "busy" ||
                body.CallStatus === "no-answer" ||
                body.CallStatus === "failed" ||
                body.CallStatus === "canceled") {
                //this save the details of call having initiate call as a Childcall
                //   if(body.ParentCallSid !== body.CallSid){
                //     // ivrStudios.flowChart(body.ParentCallSid);
                //     setTimeout(() => {
                //       console.log("inside setTimeout initiate call : " , body)
                //       this.useInitiateCallDetailsToConvertData(body)
                //     }, 10000);
                // }
                //this function save the details of call who dont have a ChildCall but have a FunctionNode in it
                if (body.ParentCallSid === body.CallSid) {
                    await this.endConfernceUsingAuth(body.AccountSid, body.ParentCallSid);
                    const myQuery = { ParentCallSid: body.ParentCallSid };
                    const ifTheEndedCallIsConferenceCall = await ConferenceModel_1.default.findOne(myQuery);
                    if (!ifTheEndedCallIsConferenceCall) {
                        const checkIfCallIsInitiateCall = await ivrStudiosModelCallBacks_1.default.find(myQuery);
                        // console.log("checkIfCallIsInitiateCall ",checkIfCallIsInitiateCall)
                        let isParticularCallInitiateCall = false;
                        let initiatedDataOfChildCall;
                        for (let i = 0; i < checkIfCallIsInitiateCall.length; i++) {
                            if (checkIfCallIsInitiateCall[i].CallSid !==
                                checkIfCallIsInitiateCall[i].ParentCallSid) {
                                initiatedDataOfChildCall = checkIfCallIsInitiateCall[i];
                                isParticularCallInitiateCall = true;
                                break;
                            }
                        }
                        if (isParticularCallInitiateCall) {
                            // if particular Call has a child call of initiate call then do this
                            setTimeout(() => {
                                logger_1.default.info("This is a initiate Call : " +
                                    JSON.stringify(initiatedDataOfChildCall));
                                this.useInitiateCallDetailsToConvertData(initiatedDataOfChildCall);
                            }, 10000);
                        }
                        else {
                            // if there is no child call of initiate call customer only plays IVR then do this
                            logger_1.default.info("this is not a conference nor a initiate call " + JSON.stringify(body));
                            this.useDataWithNoChildCallToSave(body);
                        }
                    }
                }
            }
        });
        this.data = [result];
        this.message = "ivr studio status callback";
        this.status = true;
        this.code = 200;
        return res.json(this.Response());
    }
    afterEndingCallFromParentSideSendFakeRequest = async (dataFromConferenceWithSource) => {
        let bodyForFakeAction = {
            FriendlyName: dataFromConferenceWithSource.FriendlyName,
            ParentCallSid: dataFromConferenceWithSource.ParentCallSid,
            ConferenceSid: dataFromConferenceWithSource.ConferenceSid,
            ConferenceId: dataFromConferenceWithSource.ConferenceSid,
            ChildCallSid: dataFromConferenceWithSource.ChildCallSid,
            CallStatus: "completed",
            StatusCallbackEvent: "conference-end",
        };
        const result = await this.makeFakeRequestToActionToSendMessage(bodyForFakeAction, dataFromConferenceWithSource.id, dataFromConferenceWithSource.source);
        logger_1.default.info("result of fake action : " + JSON.stringify(result));
    };
    endConfernceUsingAuth = async (authId, parentCallSid) => {
        const conference = await ConferenceModel_1.default.findOne({
            ParentCallSid: parentCallSid,
        });
        logger_1.default.info("conference : " + JSON.stringify(conference));
        let conferenceSid;
        if (conference !== undefined && conference !== null) {
            // await this.afterEndingCallFromParentSideSendFakeRequest(conference)
            conferenceSid = conference.ConferenceId;
            logger_1.default.info("conferenceSid : " + conferenceSid);
            const userDetails = await this.getUserDetailsUsingAuthID(authId);
            if (userDetails) {
                const authSecret = userDetails.auth_secret
                    ? userDetails.auth_secret
                    : "";
                const end_conference = await this.endConference(authId, authSecret, conferenceSid);
                logger_1.default.info("end_conference when parent cuts call : " + JSON.stringify(end_conference));
            }
        }
    };
    getUserDetailsUsingAuthID = async (authID) => {
        const user = await UserPermissionUserModel_1.default.findOne({ auth_id: authID });
        return user;
    };
    removePlusSymbolFromNumber(number) {
        return number.replace(/\+/g, "");
    }
    checkDataIsValid = async (data) => {
        const link = `https://vibtree-call-recording.s3.eu-central-1.amazonaws.com/${data.AccountSid}-${data.CallSid}.mp3`;
        const options = {
            method: "GET",
            url: link,
        };
        return new Promise((resolve, reject) => {
            httpClient(options, (err, res, body) => {
                if (err) {
                    // console.log("error in checkDataIsValid ", err);
                    reject(err);
                }
                // console.log("res of checkDataIsValid ", res.statusCode);
                resolve(res.statusCode);
            });
        });
    };
    checkIfRecordingExists = async (callSid) => {
        // console.log("callSid in checkIfRecordingExists ",callSid)
        const foundRecording = await VoiceMailRecordModel_1.default.findOne({
            CallSid: callSid,
        });
        if (foundRecording !== null) {
            let AccountSid = foundRecording.AccountSid;
            let CallSid = foundRecording.RecordingSid;
            let check = {
                AccountSid: AccountSid,
                CallSid: CallSid,
            };
            const data = await this.checkDataIsValid(check);
            let output = {};
            let status;
            if (data === 200) {
                status = true;
            }
            else {
                status = false;
            }
            output = { AccountSid: AccountSid, status: status };
            return output;
        }
        else {
            return { status: false };
        }
    };
    async voicemailCallBack(req, res) {
        logger_1.default.info("body in record : " + JSON.stringify(req.body));
        const CallSid = req.body.CallSid;
        const myQuery = { CallSid: CallSid };
        let duration = req.body.RecordingDuration
            ? req.body.RecordingDuration
            : "0";
        //let recordingUrl = req.body.RecordingUrl ? req.body.RecordingUrl : '';
        //const ifAudioExist : any = await this.checkIfRecordingExists(CallSid)
        if (req.body.RecordingStatus === "completed") {
            // if(ifAudioExist.status){
            let url = `https://vibtree-call-recording.s3.eu-central-1.amazonaws.com/${req.body.AccountSid}-${req.body.RecordingSid}.mp3`;
            const updates = {
                $set: { Duration: duration, CallSid: CallSid, RecordingUrl: url },
            };
            await VoiceMailRecordModel_1.default.updateOne(myQuery, updates);
            // }else{
            //   await VoiceMailRecordModel.deleteOne(myQuery)
            // }
        }
        this.data = req.body;
        this.message = "voicemail call back";
        this.status = true;
        return res.json(this.Response());
    }
    getConversationIdOfOutboundSms = async (data) => {
        const message = await (0, SMSMessageModel_1.getOneSmsMessage)(data);
        if (message) {
            return { status: true, data: message };
        }
        else {
            return { status: false, data: null };
        }
    };
    getConversationIdOfInboundSms = async (data) => {
        const conversation = await (0, SMSConversationModel_1.getOneSmsConversation)(data);
        if (conversation) {
            return { status: true, data: conversation };
        }
        else {
            return { status: false, data: null };
        }
    };
    getInboxDetailsFromCloudNumber = async (data) => {
        const response = await (0, inboxModel_1.getOneInbox)(data);
        if (response) {
            return { status: true, data: response };
        }
        else {
            return { status: false, data: null };
        }
    };
    createMessage = async (data) => {
        // console.log("SMS message data : ", data)
        const query = { messageId: data.messageId };
        const update = { $set: { ...data } };
        const options = { upsert: true, new: true };
        // const response = await createSmsMessage(data)
        const response = await (0, SMSMessageModel_1.findOneAndUpdateSmsMessage)(query, update, options);
        return response;
    };
    checkAndCreateContact = async (data) => {
        const { authId, number } = data;
        const queryToFindContact = { AccountSid: authId, phoneNumber: { $regex: number.slice(-10), $options: 'i' } };
        const response = await (0, contactModel_1.getOneContact)(queryToFindContact);
        if (response) {
            // console.log("Contact found return contact id : ", response)
            return { status: true, contact: response };
        }
        else {
            // console.log("Contact not found create a contact and return _id : ")
            const dataToCreateContact = {
                AccountSid: authId,
                phoneNumber: number,
                firstName: 'Unknown'
            };
            const response = await (0, contactModel_1.createContact)(dataToCreateContact);
            if (response) {
                return { status: true, contact: response };
            }
            else {
                return { status: false, contact: null };
            }
        }
    };
    checkAndCreateConversation = async (data) => {
        // console.log("SMS conversation data : ", data)
        const query = { cloudNumber: data.cloudNumber, contactId: data.contactId };
        const updates = { $set: { ...data } };
        const options = { upsert: true, new: true };
        const response = await (0, SMSConversationModel_1.findOneAndUpdateSmsConversatio)(query, updates, options);
        return response;
    };
    sendSmsOverSocketToFrontend = async (data, conversationId, socket) => {
        // console.log("Data for sms : ", data)
        // console.log("Conversation Id : ", conversationId)
        socket.of('/sms').to(`${conversationId}`).emit('message', data);
    };
    async thiqMessage(req, res) {
        // console.log("Query thinq Message : ", req.query)
        // console.log("Body thinq Message : ", req.body)
        logger_1.default.info("Body thinq Message Stringfy : " + JSON.stringify(req.body));
        const socket = req.app.get('socketio');
        if (req.body.guid) {
            logger_1.default.info("This is a outbound message");
            const queryToGetOutBoundMessage = { messageId: req.body.guid };
            const messageData = await this.getConversationIdOfOutboundSms(queryToGetOutBoundMessage);
            // console.log("Message Data : ", messageData)
            if (messageData.status) {
                const body = req.body;
                const conversationId = messageData.data?.conversationId;
                const messageBody = messageData.data?.messageBody;
                const tempId = messageData.data?.tempId;
                const messagePayload = {
                    conversationId: conversationId,
                    messageId: body.guid,
                    contactNumber: body.destination_did,
                    cloudNumber: body.source_did,
                    createdAt: new Date(body.timestamp.replace(/\s+/g, "")),
                    direction: 'outbound',
                    status: body.status,
                    messageType: 'text',
                    conversationType: 'one-on-one',
                    messageBody: messageBody,
                    isTemplate: false,
                    provider: 'thinq',
                    tempId: tempId
                };
                this.sendSmsOverSocketToFrontend(messagePayload, conversationId, socket);
                await this.createMessage(messagePayload);
                // console.log("Message : ", message)
            }
        }
        else {
            logger_1.default.info("This is inbound message :");
            const body = req.body;
            const queryInboundSms = { cloudNumber: body.to, contactNumber: body.from, populate: 'lastMessageId' };
            const conversation = await this.getConversationIdOfInboundSms(queryInboundSms);
            // console.log("Inbound Conversation : ",conversation)
            if (conversation.status) {
                logger_1.default.info("Conversation already exist. " + conversation);
                const conversationId = conversation.data.conversationId;
                const randomNumber = Math.floor(Math.random() * 100000000);
                const paddedNumber = randomNumber.toString().padStart(18, '0');
                const messagePayload = {
                    conversationId: conversationId,
                    messageId: paddedNumber,
                    contactNumber: body.from,
                    cloudNumber: body.to,
                    createdAt: new Date(),
                    direction: 'inbound',
                    status: 'RECEIVED',
                    messageType: 'text',
                    conversationType: 'one-on-one',
                    messageBody: body.message,
                    isTemplate: false,
                    provider: 'thinq',
                    tempId: paddedNumber
                };
                this.sendSmsOverSocketToFrontend(messagePayload, conversationId, socket);
                const message = await this.createMessage(messagePayload);
                //added it to last message in conversation
                const query = { conversationId: conversationId };
                const updates = { $set: { lastMessageId: message._id, lastMessageAt: new Date() } };
                const options = { upsert: false };
                await (0, SMSConversationModel_1.findOneAndUpdateSmsConversatio)(query, updates, options);
                // console.log("Message : ", message)
            }
            else {
                logger_1.default.info("New Conversation customer message us first time.");
                const query = { "data.number": body.to };
                const inbox = await this.getInboxDetailsFromCloudNumber(query);
                // console.log("Inbox : ", inbox)
                //create message 
                const randomNumber = Math.floor(Math.random() * 100000000);
                const conversationId = randomNumber.toString().padStart(8, '0');
                const messageId = randomNumber.toString().padStart(10, '0');
                const tempId = messageId;
                const messagePayload = {
                    conversationId: conversationId,
                    messageId: messageId,
                    contactNumber: body.from,
                    cloudNumber: body.to,
                    createdAt: new Date(),
                    direction: 'inbound',
                    status: 'RECEIVED',
                    messageType: 'text',
                    conversationType: 'one-on-one',
                    messageBody: body.message,
                    isTemplate: false,
                    provider: 'thinq',
                    tempId: tempId
                };
                this.sendSmsOverSocketToFrontend(messagePayload, conversationId, socket);
                const message = await this.createMessage(messagePayload);
                if (message) {
                    //check contact and create conversation
                    const number = body.from;
                    const authId = inbox.data.AccountSid;
                    const contact = await this.checkAndCreateContact({ number: number, authId: authId });
                    let contactId;
                    if (contact.status) {
                        contactId = contact.contact._id;
                    }
                    //Create Conversation
                    const conversationPayload = {
                        lastMessageAt: new Date,
                        lastMessageId: message._id,
                        contactId: contactId,
                        // senderId: req.JWTUser?._id,
                        contactNumber: body.from,
                        companyId: inbox.data.companyId,
                        createdAt: new Date,
                        conversationType: 'one-on-one',
                        cloudNumber: body.to,
                        conversationId: conversationId
                    };
                    this.checkAndCreateConversation(conversationPayload);
                }
                // console.log("Message : ", message)
            }
        }
        return res.status(200).json(req.body);
    }
}
exports.default = WebSocketController;
//# sourceMappingURL=WebSocketController.js.map