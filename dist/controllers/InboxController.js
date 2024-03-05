"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const InboxModel_1 = __importDefault(require("../models/InboxModel"));
const userStatusModel_1 = __importDefault(require("../models/userStatusModel"));
const UserActivityModel_1 = __importDefault(require("../models/UserActivityModel"));
const ivrFlowModel_1 = __importDefault(require("../models/ivrFlowModel"));
const inboxModel_1 = require("../services/inboxModel");
class InboxController extends Index_1.default {
    constructor(model) {
        super(model);
        this.getAllInbox = this.getAllInbox.bind(this);
        this.postInbox = this.postInbox.bind(this);
        this.udateInbox = this.udateInbox.bind(this);
        this.deleteInbox = this.deleteInbox.bind(this);
        this.calculateDetailsAccordingToInbox = this.calculateDetailsAccordingToInbox.bind(this);
        this.getInboxById = this.getInboxById.bind(this);
        this.checkNumberCapabilityBeforeCreatinginbox = this.checkNumberCapabilityBeforeCreatinginbox.bind(this);
    }
    filterOnlyVoiceInbox = (inboxes) => {
        const voiceInbox = inboxes.filter((inbox) => {
            return inbox.InboxType.toLowerCase() === 'voice';
        });
        //console.log("Voice inbox : ", voiceInbox)
        return voiceInbox;
    };
    checkCapabilityOfNumber = (numbers) => {
        const capabilities = numbers.map((inbox) => {
            return inbox.data;
        });
        // console.log("Capability : ", capabilities)
        let numberWithBothCapabilities = [];
        for (let i = 0; i < capabilities.length; i++) {
            for (let j = 0; j < capabilities[i].length; j++) {
                // console.log("capabilities : ",capabilities[i][j] ,capabilities[i][j].sms_capability , capabilities[i][j].voice_capability)
                if (capabilities[i][j].sms_capability && capabilities[i][j].voice_capability) {
                    numberWithBothCapabilities.push(capabilities[i][j]);
                }
            }
        }
        // console.log("Number with both capabilities : ", numberWithBothCapabilities)
        return numberWithBothCapabilities;
    };
    checkIfGivenNumberHasSmsInbox = (numbers, allInbox) => {
        const smsInbox = allInbox.filter((inbox) => {
            return inbox.InboxType.toLowerCase() === 'sms';
        });
        // console.log("SMS inbox : ", smsInbox)
        let numberWithBothCapacityUsedOnceOnly = [];
        let numberWithBothCapacityUsedTwice = [];
        if (smsInbox.length === 0) {
            numberWithBothCapacityUsedOnceOnly = numbers;
        }
        else {
            for (let i = 0; i < smsInbox.length; i++) {
                if (smsInbox[i].data) {
                    for (let j = 0; j < smsInbox[i].data.length; j++) {
                        for (let k = 0; k < numbers.length; k++) {
                            // console.log("smsInbox[i].data[j].number : ",smsInbox[i].data[j])
                            if (smsInbox[i].data[j]) {
                                if (smsInbox[i].data[j].number) {
                                    if (smsInbox[i].data[j].sms_capability && smsInbox[i].data[j].voice_capability) {
                                        if (smsInbox[i].data[j].number.slice(-10) === numbers[k].number.slice(-10)) {
                                            numberWithBothCapacityUsedTwice.push(smsInbox[i].data[j]);
                                            // const indexToRemove = smsInbox[i].data.indexOf(smsInbox[i].data[j]);
                                            // smsInbox[i].data.splice(indexToRemove,1)
                                        }
                                        else {
                                            numberWithBothCapacityUsedOnceOnly.push(numbers[k]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        // console.log("voice inbox : ", numbers)
        // console.log("Used only once : ",numberWithBothCapacityUsedOnceOnly)
        // console.log("Used Twice : ", numberWithBothCapacityUsedTwice)
        return numberWithBothCapacityUsedOnceOnly;
    };
    async checkNumberCapabilityBeforeCreatinginbox(req, res) {
        const userId = req.JWTUser?._id;
        //1. Get All Inbox
        const queryToGetAllInboxOfUser = { UserId: { '$in': [userId] } };
        const allInbox = await (0, inboxModel_1.getInboxes)(queryToGetAllInboxOfUser);
        // console.log("All inbox : ", allInbox)
        //2. Check If inbox has both sms and voice capability
        const voiceInboxes = this.filterOnlyVoiceInbox(allInbox);
        // console.log("Voice Inbox : ", voiceInboxes)
        const numberWithBothCapabilities = this.checkCapabilityOfNumber(voiceInboxes);
        // console.log("Number with both Capabilities : ", numberWithBothCapabilities)
        //3. Check no of inbox with that particular number
        const numberWithBothCapacityUsedOnlyOnce = this.checkIfGivenNumberHasSmsInbox(numberWithBothCapabilities, allInbox);
        //4. Return final report after checking availability 
        this.data = numberWithBothCapacityUsedOnlyOnce;
        this.status = true;
        this.code = 200;
        this.message = 'Number with both capacity used only once fetched!';
        return res.status(200).json(this.Response());
    }
    async getInboxById(req, res) {
        const id = req.params.id;
        const query = { ...req.query };
        const inbox = await (0, inboxModel_1.getInboxById)(id, query);
        if (inbox) {
            this.data = inbox;
            this.code = 200;
            this.message = 'Inbox Fetched!';
            this.status = true;
            return res.status(200).json(this.Response());
        }
        else {
            this.data = inbox;
            this.code = 200;
            this.message = 'Inbox Fetched!';
            this.status = true;
            return res.status(200).json(this.Response());
        }
    }
    async getAllInbox(req, res) {
        const query = { ...req.query };
        let user_id = req.JWTUser?._id;
        let authId = req.JWTUser?.authId;
        const useridFilter = user_id ? { UserId: { $in: user_id } } : {};
        const finalQuery = {
            ...query,
            ...useridFilter,
            AccountSid: authId
        };
        const userStatusDetails = await (0, inboxModel_1.getInboxes)(finalQuery);
        const total = await (0, inboxModel_1.countInboxDocuments)(finalQuery);
        const data = {
            totalCount: total,
            data: userStatusDetails
        };
        this.data = data;
        this.status = true;
        this.message = 'Status Fetched';
        this.code = 200;
        return res.status(200).json(this.Response());
    }
    async postInbox(req, res) {
        const authId = req.JWTUser?.authId;
        const companyId = req.JWTUser?.companyId;
        const body = { ...req.body, AccountSid: authId, companyId: companyId };
        if (body.InboxType.toLowerCase() === 'voice') {
            body.InboxType = body.InboxType.toLowerCase();
            if (body.data) {
                if (body.data[0].number.startsWith('91')) {
                    body.data[0].sms_capability = false;
                    body.data[0].voice_capability = true;
                }
                else {
                    body.data[0].sms_capability = true;
                    body.data[0].voice_capability = true;
                }
                if (!body.data[0].number) {
                    this.data = [];
                    this.code = 403;
                    this.status = false;
                    this.message = 'Please provide a number to create voice inbox!';
                    return res.status(403).json(this.Response());
                }
            }
        }
        if (body.InboxType.toLowerCase() === 'sms') {
            body.InboxType = body.InboxType.toLowerCase();
            if (body.data) {
                if (body.data[0].number) {
                    if (!body.data[0].number.startsWith('91')) {
                        body.data[0].sms_capability = true;
                        body.data[0].voice_capability = true;
                        if (!body.data[0].number) {
                            this.data = [];
                            this.code = 403;
                            this.status = false;
                            this.message = 'Please provide a number to create sms inbox!';
                            return res.status(403).json(this.Response());
                        }
                    }
                    else {
                        body.data[0].sms_capability = false;
                        body.data[0].voice_capability = true;
                    }
                }
                else {
                    body.data[0].sms_capability = false;
                    body.data[0].voice_capability = true;
                }
            }
        }
        const inbox = await (0, inboxModel_1.createInbox)(body);
        this.data = inbox;
        this.status = true;
        this.message = 'Created inbox!';
        this.code = 201;
        return res.status(201).json(this.Response());
    }
    async udateInbox(req, res) {
        const query = req.params.id;
        const body = req.body;
        const options = { upsert: false, new: true };
        const updateInbox = await (0, inboxModel_1.updateInboxById)(query, body, options);
        this.data = updateInbox;
        this.status = true;
        this.message = 'Updated Status';
        this.code = 204;
        return res.status(200).json(this.Response());
    }
    async deleteInbox(req, res) {
        const deleteInbox = await (0, inboxModel_1.deleteOneInboxById)(req.params.id);
        this.data = deleteInbox;
        this.status = true;
        this.message = 'inbox deleted';
        this.code = 200;
        return res.status(200).json(this.Response());
    }
    calculateTheLoginTimeOfUser = async (data) => {
        let userDetailsWithLoginTiming = await Promise.all(data.data.map(async (user) => {
            const query = { user_id: user.userId, type: 'login' };
            const detailsOfLoginTimeFromDb = await UserActivityModel_1.default.findOne(query).sort({ _id: -1 });
            let tempObj = { login_time: detailsOfLoginTimeFromDb ? detailsOfLoginTimeFromDb.createdAt : 'not-created', ...user };
            return await tempObj;
        }));
        //console.log("User Details With Login Timing : ", userDetailsWithLoginTiming )
        const tempObj = { status: true, data: userDetailsWithLoginTiming };
        return tempObj;
    };
    checkIfSingleInboxContainMultipleUser = (data) => {
        let tempArr = [];
        for (let i = 0; i < data.length; i++) {
            // if(data[i].UserId.length > 1){
            // }
            let tempObj;
            for (let j = 0; j < data[i].UserId.length; j++) {
                tempObj = {
                    id: data[i].UserId[j]._id,
                    name: data[i].UserId[j].fullName,
                    avatar: data[i].UserId[j].user_logo,
                    number: data[i].data[0].number,
                    inbox_id: data[i]._id
                };
                //console.log("TempObj : ", tempObj)
                tempArr.push(tempObj);
            }
        }
        //console.log("Temp Array : ", tempArr)
        return tempArr;
    };
    calculateTheStatusOfUser = async (data) => {
        //console.log("Data get to calculate : ", data)
        if (data.length === 0)
            return { status: false, data: [] };
        //when we have a logic when one inbox only have one assigned User
        // const user_ids = data.map((detail)=>{
        //     return {id : detail.UserId[0]._id , name : detail.UserId[0].fullName , avatar : detail.UserId[0].user_logo , number : detail.data[0].number , inbox_id : detail._id}
        // })
        const user_ids = this.checkIfSingleInboxContainMultipleUser(data);
        console.log("UserIds : ", user_ids);
        let status = await Promise.all(user_ids.map(async (user) => {
            const query = { userId: user.id };
            const detailsOfStatus = await userStatusModel_1.default.findOne(query);
            //console.log("Details of Status : ", detailsOfStatus)
            const tempObj = { userId: user.id, status: detailsOfStatus ? detailsOfStatus.status : 'not-created', name: user.name, avatar: user.avatar, number: user.number, inbox_id: user.inbox_id };
            return await tempObj;
        }));
        //console.log("Status : ", status)
        const tempObj = { status: true, data: status };
        return tempObj;
    };
    calculateTheInboundCallCount = async (data, startDate, endDate) => {
        let inboundCallsDetails = await Promise.all((data.data.map(async (detail) => {
            const dateFilter = startDate ? { "createdAt": { $gte: new Date(startDate), $lte: new Date(endDate) } } : {};
            const query = { "listOfChildCalls.userId": detail.userId, "CloudNumber": detail.number, "ParentCall.Direction": "inbound", ...dateFilter };
            console.log("Query : ", query);
            const countOfInboundCalls = await ivrFlowModel_1.default.countDocuments(query);
            const tempObj = { inbound_calls: countOfInboundCalls, ...detail };
            return await tempObj;
        })));
        //console.log("Inbound Calls Details : ", inboundCallsDetails)
        const tempObj = { status: true, data: inboundCallsDetails };
        return tempObj;
    };
    calculateTheOutboundCallCount = async (data, startDate, endDate) => {
        let outbountCallsDetails = await Promise.all((data.data.map(async (detail) => {
            const dateFilter = startDate ? { "createdAt": { $gte: new Date(startDate), $lte: new Date(endDate) } } : {};
            const query = { "userID": detail.userId, "CloudNumber": detail.number, "ParentCall.Direction": "outbound-api", ...dateFilter };
            console.log("Query : ", query);
            const countOfInboundCalls = await ivrFlowModel_1.default.countDocuments(query);
            const tempObj = { outbound_calls: countOfInboundCalls, ...detail };
            return await tempObj;
        })));
        //console.log("Outbound Calls Details : ", outbountCallsDetails)
        const tempObj = { status: true, data: outbountCallsDetails };
        return tempObj;
    };
    async calculateDetailsAccordingToInbox(req, res) {
        const body = req.body;
        console.log("Body : ", body);
        //1. Collect inbox wise user id
        const query = { AccountSid: body.auth_id, InboxType: 'voice' };
        const result = await InboxModel_1.default.find(query).populate('UserId');
        //console.log("All Inbox related to that user : ", result)
        if (result.length === 0) {
            this.data = [];
            this.status = false;
            this.message = 'There is no inbox created in this Account of User';
            return res.json(this.Response());
        }
        //2. Map Current Status of users (Available,Busy, away etc etc}
        const statusOfUserIds = await this.calculateTheStatusOfUser(result);
        if (!statusOfUserIds.status) {
            this.data = [];
            this.status = false;
            this.message = 'There is some issue with Status of User';
            return res.json(this.Response());
        }
        //console.log("Status Of UserIds : ", statusOfUserIds)
        // 3. Map last login time of users
        const usersWithLoginTime = await this.calculateTheLoginTimeOfUser(statusOfUserIds);
        //console.log("Users Details with login time : ", usersWithLoginTime)
        // 4. Get outbound call count of particular user from particular inbox  in given time range
        const inboundDetails = await this.calculateTheInboundCallCount(usersWithLoginTime, body.startDate, body.endDate);
        //console.log("Inbound : ",inboundDetails )
        // 5. Get inbound call count of particular user from particular inbox in given time range
        const outboundDetails = await this.calculateTheOutboundCallCount(inboundDetails, body.startDate, body.endDate);
        //console.log("Outbound : ", outboundDetails)
        this.data = outboundDetails;
        this.status = true;
        this.message = 'Updated Status';
        return res.json(this.Response());
    }
}
exports.default = InboxController;
//# sourceMappingURL=InboxController.js.map