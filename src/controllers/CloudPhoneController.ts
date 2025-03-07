import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
import {
  getDetails,
  countDocuments,
  ivrFlowFindOneAndUpdate,
} from "../services/IvrFlowModel";
import {
  getDetailById,
  getUser,
  countUserDocuments,
  getSingleUser,
} from "../services/userModel";
import * as conf from "../config/index";
import {
  makeCall,
  killParticularCall,
  endConference,
  handleHold
} from "../services/Vibconnect/index";
import {
  createDetail,
  getParticularRealtimeCall,
  updateRealtimeDetails,
  // getRealtimeCallById,
  findOneAndDeleteRealtimeDetails
} from "../services/realTimeIvrStudiosModel";
import { getVibconnect } from "../services/vibconnectModel";
import { getContacts, countContactDocuments } from "../services/contactModel";
import { getConferenceCallBacks } from "../services/conferenceCallBackModel";
import { getNumbers, countNumberDocuments } from "../services/numberModel";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import { createConference } from "../services/conferenceModel";
// import {isValidMongoDbObjectId} from '../helper/index';
import logger from '../config/logger';
// import WebSocketController from '../controllers/WebSocketController';
import CallRecordinsModel from "../models/CallRecordingsCallbacksModel";
import IvrStudiosStatusModel from "../models/ivrStudiosModelCallBacks";
import UserPermissionUserModel from "../models/UserPermissionUserModel";
import ivrFlowUIModel from "../models/ivrFlowUIModel";
import NumberModel from "../models/numbers";
const { contactModel } = require("../models/ContactsModel");
import ivrFlowModel from "../models/ivrFlowModel";
// const webSocketController =  new WebSocketController()
interface IDataFromSipOutBound {
  AccountSid: string;
  ApiVersion: string;
  CallSid: string;
  CallStatus: string;
  CallbackSource: string;
  Called: string;
  Direction: string;
  From: string;
  InitiationTime: string;
  ParentCallSid: string;
  SequenceNumber: string;
  "SipHeader_X-rc-proto": string;
  "SipHeader_X-ser": string;
  Timestamp: string;
  To: string;
}

interface ITransferBody {
  conferenceSid : string,
  parentCallSid : string;
  transferredFrom : any ; // user who transferred call
  transferredTo : any ; // user whom we transferring call
  transferType? : 'transfernow'| 'talkfirst' ;
  number : string ;
  roomId : string ;
  from : string;
  caller : string;
  SendDigits?: string;
}

interface IHangupTransferCallBody {
  id? : string;
  callId? : string;
  Notes : any[];
  Tags : any[];
}

interface IHoldResponse {
  status: string;
  message: string;
  account_sid: string;
  call_sid: string;
  label: string;
  conference_sid: string;
  date_created: string;
  date_updated : string;
  end_conference_on_exit : boolean,
  muted: boolean,
  hold: boolean,
  hold_url: string,
  start_conference_on_enter: boolean;
  coaching: boolean;
  call_sid_to_coach: string,
  uri: string,
  announce_url: string;
}

export default class CloudPhoneController extends Controller {
  public constructor(model?: any) {
    super(model);
    this.getCallLogs = this.getCallLogs.bind(this);
    this.getSingleUserInfo = this.getSingleUserInfo.bind(this);
    this.phoneCall = this.phoneCall.bind(this);
    this.getUsersDetails = this.getUsersDetails.bind(this);
    this.singleContactDetails = this.singleContactDetails.bind(this);
    this.killCallConference = this.killCallConference.bind(this);
    this.getCloudNumbers = this.getCloudNumbers.bind(this);
    this.Call = this.Call.bind(this);
    this.editNotesOrTags = this.editNotesOrTags.bind(this);
    this.getConferenceRoomForCloudPhone =
      this.getConferenceRoomForCloudPhone.bind(this);
    this.getConferenceRoomForCloudPhoneWebrtc =
      this.getConferenceRoomForCloudPhoneWebrtc.bind(this);
    this.applicationForSip = this.applicationForSip.bind(this);
    this.transferCall = this.transferCall.bind(this)
    this.getConferenceRoomForTransfercall = this.getConferenceRoomForTransfercall.bind(this)
    this.hangupTransferCallAndSaveCdr = this.hangupTransferCallAndSaveCdr.bind(this)
    this.handleHoldOrUnhold = this.handleHoldOrUnhold.bind(this)
    this.killParticularCall = this.killParticularCall.bind(this)
  }

  public async applicationForSip(req: IRequest, res: IResponse): Promise<any> {
    res.set("Content-Type", "text/xml");

    const data = req.query as Pick<IDataFromSipOutBound , 'AccountSid' | 'ApiVersion' | 'CallSid' | 'CallStatus' | 'CallbackSource' | 'Called' | 'Direction' | 'From' | 'InitiationTime' | 'ParentCallSid' | 'SequenceNumber' | 'SipHeader_X-rc-proto' | 'SipHeader_X-ser' | 'Timestamp' | 'To'>;

    //1. using sip and auth id get cloudnumber or cli.
    const agentSipId = data.From;
    const authId = data.AccountSid;
    
    const query = {"auth_id" : authId, "sip_user": agentSipId }
    //@ts-ignore
    const userDetails = await getSingleUser(query);
    //console.log("user details : ", userDetails);
    let authSecretId;
    let callerId = "959977827977";

    if(!userDetails){
      const voice: any = new VoiceResponse();
      voice.say('No User With This Sip Is present in our database')
      return res.status(200).send(voice.toString());
    }

    if (userDetails) {
      const sip_cli = userDetails.sip_cli;
      const auth_secret = userDetails.auth_secret;
      //console.log("Response of User : ", sip_cli , auth_id , auth_secret)
      if (sip_cli) {
        callerId = sip_cli;
        authSecretId = auth_secret;
      }else{
        const voice: any = new VoiceResponse();
        voice.say('No CLI is attach to this user')
        return res.status(200).send(voice.toString());
      }
    }

    //2. create a unique conference room with parent callsid
    const roomId = `Room_${data.ParentCallSid}`;
    const waitUrl =
      "https://vibtreedan.s3.eu-central-1.amazonaws.com/public/2022-08-21T11%3A53%3A44.570Z_home-ringtone-4438%20%281%29.mp3";

    //3. grab customer number from query i.e req.query.To .
    let customerNumber = data.To ? data.To : "";
    if (customerNumber.includes("+")) {
      customerNumber = customerNumber.replace("+", "");
    }

    if (customerNumber.includes("%2B")) {
      customerNumber = customerNumber.replace("%2B", "");
    }

    //4. make a outbound call to customer.
    const statusCallbackLinkForApiCall = `${conf.BaseUrl}/api/v2/webhooks/vibconnect/cp/webrtc`;
    const payloadForCallToCustomer  = {
      statusCallback: statusCallbackLinkForApiCall,
      statusCallbackEvent: "initiated, ringing, answered, completed",
      Record: "true",
      To: customerNumber,
      //"TimeOut": ringTimeOut,
      From: callerId, // purchased number without filtering input
      Method: "GET",
      Url: `${conf.BaseUrl}/api/getConferenceRoomForCloudPhoneWebrtc/${roomId}/empty`,
      recordingStatusCallback: `${conf.BaseUrl}/api//vibconnect/webhook/recordings`,
      recordingStatusCallbackEvent: "in-progress, completed, absent",
      recordingStatusCallbackMethod: "POST",
      record: "true",
    };

    //@ts-ignore
    const responseOfCall: any = await makeCall(authId, authSecretId, payloadForCallToCustomer);
    const json = JSON.parse(responseOfCall);
    if(json.code){
      if(json.code === 21211){
        const voice: any = new VoiceResponse();
        voice.say("Please check the number you dailed");
        return res.status(200).send(voice.toString());
      }
    }
    const dataForRealTime = {
      AccountSid: authId,
      FriendlyName: roomId,
      ParentCallId: data.ParentCallSid ? data.ParentCallSid : "",
      ParentCallSid: data.ParentCallSid ? data.ParentCallSid : "",
      CallType: "Outbound",
      Direction : "Outbound",
      CloudNumber: callerId,
      Caller: agentSipId,
      Receiver: customerNumber,
      StartTime: json.queue_time ? json.queue_time : "",
      Recording: json.subresource_uris ? json.subresource_uris.recordings : "",
      AccountSecretId: authSecretId,
      Source: "WebRtc",
      userID: userDetails._id,
      CallSidOfConferenceChildCall: json.sid ? json.sid : "",
      ChildCallSid: json.sid ? json.sid : "",
      ChildCallId: json.sid ? json.sid : "",
    };

    //5. save all data to realtime database

    createDetail(dataForRealTime);
    createConference(dataForRealTime);

    //6. create a conference XML with same room and return

    const voice: any = new VoiceResponse();
    let Parentdial = voice.dial();
    Parentdial.conference(
      {
        waitUrl: waitUrl,
        statusCallback: statusCallbackLinkForApiCall,
        statusCallbackEvent: "start end join leave mute hold",
      },
      roomId
    );
    return res.status(200).send(voice.toString());
  }

  public async getConferenceRoomForCloudPhoneWebrtc(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    const customer_number = req.params.customer_number;
    const url = req.params.url;
    const statusCallbackLink = `${conf.BaseUrl}/api/v2/webhooks/vibconnect/cp/webrtc`;
    const waitUrl =
      "https://vibtreedan.s3.eu-central-1.amazonaws.com/public/2022-08-21T11%3A53%3A44.570Z_home-ringtone-4438%20%281%29.mp3";
    res.set("Content-Type", "text/xml");
    const defaultVRI: VoiceResponse | any = new VoiceResponse();
    try {
      if (req.params.url) {
        if (req.params.url !== "empty") {
          const voice: VoiceResponse | any = new VoiceResponse();
          console.log("url : ", url);
          voice.play(`https://vibtreedan.s3.amazonaws.com/public/${url}`);
          let Parentdial = voice.dial();
          Parentdial.conference(
            { endConferenceOnExit: "true" },
            customer_number
          );
          return res.send(voice.toString());
        }
        const voice: VoiceResponse | any = new VoiceResponse();
        let Parentdial = voice.dial();
        Parentdial.conference(
          {
            endConferenceOnExit: "true",
            waitUrl: waitUrl,
            statusCallback: statusCallbackLink,
            statusCallbackEvent: "start end join leave mute hold",
          },
          customer_number
        );
        return res.send(voice.toString());
      }
      const voice: VoiceResponse | any = new VoiceResponse();
      let Parentdial = voice.dial();
      Parentdial.conference({ endConferenceOnExit: "true" }, customer_number);
      return res.send(voice.toString());
    } catch (err:any) {
      console.log(err);
      this.message = err.message;
      this.status = false;
      this.code = 500;
      defaultVRI.say(err.message);
    }
    return res.send(defaultVRI.toString());
  }

  public async getConferenceRoomForCloudPhone(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    const customer_number = req.params.customer_number;
    const url = req.params.url;
    const statusCallbackLink = `${conf.BaseUrl}/api/v2/webhooks/vibconnect/cp/phone`;
    const waitUrl =
      "https://vibtreedan.s3.eu-central-1.amazonaws.com/public/2022-08-21T11%3A53%3A44.570Z_home-ringtone-4438%20%281%29.mp3";
    res.set("Content-Type", "text/xml");
    const defaultVRI: VoiceResponse | any = new VoiceResponse();
    try {
      if (req.params.url) {
        if (req.params.url !== "empty") {
          const voice: VoiceResponse | any = new VoiceResponse();
          console.log("url : ", url);
          voice.play(`https://vibtreedan.s3.amazonaws.com/public/${url}`);
          let Parentdial = voice.dial();
          Parentdial.conference(
            { endConferenceOnExit: "true" },
            customer_number
          );
          return res.send(voice.toString());
        }
        const voice: VoiceResponse | any = new VoiceResponse();
        let Parentdial = voice.dial();
        Parentdial.conference(
          {
            endConferenceOnExit: "true",
            waitUrl: waitUrl,
            statusCallback: statusCallbackLink,
            statusCallbackEvent: "start end join leave mute hold",
          },
          customer_number
        );
        return res.send(voice.toString());
      }
      const voice: VoiceResponse | any = new VoiceResponse();
      let Parentdial = voice.dial();
      Parentdial.conference({ endConferenceOnExit: "true" }, customer_number);
      return res.send(voice.toString());
    } catch (err:any) {
      console.log(err);
      this.message = err.message;
      this.status = false;
      this.code = 500;
      defaultVRI.say(err.message);
    }
    return res.send(defaultVRI.toString());
  }

  public async editNotesOrTags(req: IRequest, res: IResponse): Promise<any> {
    const roomId = req.params.id;
    console.log("Room id : ", roomId);

    const AccountSid = req.JWTUser?.authId;

    if (!req.body.parentCallSid) {
      this.status = false;
      this.code = 403;
      this.message = "Provide parentCallSid!";
      this.data = [];

      return res.status(403).json(this.Response());
    }

    const body = { ...req.body };

    const queryOfRealtime = {
      AccountSid: AccountSid,
      FriendlyName: roomId,
      $or : [{ParentCallIdTransferCall: req.body.parentCallSid},{ParentCallId: req.body.parentCallSid}]
      // ParentCallId: req.body.parentCallSid,
    };

    const foundDetailsOfRunningCall = await getParticularRealtimeCall(
      queryOfRealtime
    );

    console.log("found details :", foundDetailsOfRunningCall);

    if (
      foundDetailsOfRunningCall !== undefined &&
      foundDetailsOfRunningCall !== null
    ) {
      const query = { AccountSid: AccountSid, FriendlyName: roomId };
      const updates = { $push: { ...body } };
      const option = { upsert: false , new : true};
      await updateRealtimeDetails(query, updates, option);
      this.data = [];
      this.status = true;
      this.code = 200;
      this.message = "Data added to cloud phone";

      return res.status(200).json(this.Response());
    } else {
      console.log(
        "The Data is erased now create a payload and send it after 10 sec : "
      );
      let parentCallSid = req.body.parentCallSid;
      const query = { "ParentCall.ParentCallSid": parentCallSid };
      const updates = { $push: { Notes: req.body.Notes, Tags: req.body.Tags } };
      console.log("Query : ", query);
      console.log("Updates : ", updates);
      const option = { upsert: false };
      setTimeout(async () => {
        // console.log("inside setTimeout" , ifConferenceExist)
        await ivrFlowFindOneAndUpdate(query, updates, option);
      }, 15000);

      this.data = [];
      this.status = true;
      this.code = 204;
      this.message = "Details will update in table";

      return res.status(200).json(this.Response());
    }
  }

  public async Call(req: IRequest, res: IResponse): Promise<any> {
    const CloudNumber = req.body.From;
    const AgentNumber = req.body.To;
    const url = req.body.Url;
    const method = req.body.Method ? req.body.Method : "GET";

    const companyId = req.JWTUser?.companyId ? req.JWTUser?.companyId : false;
    if (!companyId) {
      this.status = false;
      this.code = 403;
      this.message = "User is not assigned to any company!";
      this.data = [];

      return res.status(403).json(this.Response());
    }
    const query = {
      companyId: companyId,
    };
    //Fetch Auth id and Auth Secret from vibconnect table using company-id
    const vibDetails = await getVibconnect(query);
    const AccountSid = vibDetails.length > 0 ? vibDetails[0].authId : false;
    const AuthSecretId =
      vibDetails.length > 0 ? vibDetails[0].authSecret : false;
    if (!AccountSid || !AuthSecretId) {
      this.status = false;
      this.code = 401;
      this.message = "Not Authorized!";
      this.data = [];

      return res.status(401).json(this.Response());
    }

    if (!CloudNumber) {
      this.status = false;
      this.code = 403;
      this.message = "Provide From!";
      this.data = [];

      return res.status(403).json(this.Response());
    }

    if (!AgentNumber) {
      this.status = false;
      this.code = 403;
      this.message = "Provide To!";
      this.data = [];

      return res.status(403).json(this.Response());
    }

    if (!url) {
      this.status = false;
      this.code = 403;
      this.message = "Provide Url!";
      this.data = [];

      return res.status(403).json(this.Response());
    }

    try {
      const correctCloudNumber = CloudNumber.replaceAll("+", "");

      const data = {
        statusCallback: `${conf.BaseUrl}/api/v2/webhooks/vibconnect/cp/phone`,
        statusCallbackEvent: "initiated, ringing, answered, completed",
        Record: "true",
        To: AgentNumber,
        //"TimeOut": ringTimeOut,
        From: correctCloudNumber, // purchased number without filtering input
        Method: method,
        Url: url,
      };

      //@ts-ignore
      const responseOfCall: any = await makeCall(AccountSid,AuthSecretId,data);
      const json = JSON.parse(responseOfCall);

      this.data = json;
      this.message = "Call made successfully!";
      this.status = true;
      this.code = 201;

      return res.status(201).json(this.Response());
    } catch (err : any ) {
      this.data = [];
      this.status = false;
      this.code = 404;
      this.message = err.stack;

      return res.status(404).json(this.Response());
    }
  }

  public async getCloudNumbers(req: IRequest, res: IResponse): Promise<any> {
    const authId = req.JWTUser?.authId;
    const query = {
      ...req.query,
      acc_id: authId,
    };

    const numberDetails = await getNumbers(query);
    const count = await countNumberDocuments(query);

    const data = {
      data: numberDetails,
      totalCount: count,
    };
    this.data = data;
    this.status = true;
    this.message = "Details Fetched!";
    this.code = 200;

    return res.status(200).json(this.Response());
  }

  public async killCallConference(req: IRequest, res: IResponse): Promise<any> {
    const FriendlyName = req.body.roomId;

    if (!FriendlyName) {
      this.status = false;
      this.code = 403;
      this.message = "Provide roomId!";
      this.data = [];

      return res.status(403).json(this.Response());
    }

    const companyId = req.JWTUser?.companyId ? req.JWTUser?.companyId : false;
    if (!companyId) {
      this.status = false;
      this.code = 403;
      this.message = "User is not assigned to any company!";
      this.data = [];

      return res.status(403).json(this.Response());
    }

    const query = {
      companyId: companyId,
    };
    //Fetch Auth id and Auth Secret from vibconnect table using company-id
    const vibDetails = await getVibconnect(query);

    const authId = vibDetails.length > 0 ? vibDetails[0].authId : false;
    const authSecretId =
      vibDetails.length > 0 ? vibDetails[0].authSecret : false;
    console.log("Friendly name : ", FriendlyName);
    const queryForConference = {
      FriendlyName: FriendlyName,
    };
    const callDetails: any = await getConferenceCallBacks(queryForConference);
    console.log("Call Details : ", callDetails);
    let noOfParticipantsJoins = 0;
    let conferenceSidWhenCustomerJoinsTheCall;

    if (callDetails.length === 0) {
      //Agent didn't pick up the call but click on hangup button to so kill agent call.
      const queryForRealTime = {
        AccountSid: authId,
        FriendlyName: FriendlyName,
      };
      const callDetails: any = await getParticularRealtimeCall(
        queryForRealTime
      );
      console.log("this is the parent call details you need to kill : ");

      if (callDetails !== undefined && callDetails !== null) {
        console.log("callDetails.ChildCallId : ", callDetails);
        const CallSid = callDetails.ParentCallId;
        //@ts-ignore
        const killCallData: any = await killParticularCall(CallSid,authId,authSecretId);
        console.log("kill call data : ", killCallData);
        this.data = [];
        this.status = true;
        this.code = 200;
        this.message = "Conference End";
        return res.json(this.Response());
      }
    }

    if (callDetails.length > 0) {
      for (let i = 0; i < callDetails.length; i++) {
        if (callDetails[i].StatusCallbackEvent === "participant-join") {
          noOfParticipantsJoins = noOfParticipantsJoins + 1;
          conferenceSidWhenCustomerJoinsTheCall = callDetails[i].ConferenceSid;
        }
      }
    }
    console.log("noOfParticipantsJoins : ", noOfParticipantsJoins);
    if (noOfParticipantsJoins === 1) {
      if (req.body.direction !== undefined) {
        if (req.body.direction === "inbound") {
          // const conferenceId = callDetails[0].ConferenceSid;
          this.data = [];
          this.status = true;
          this.code = 200;
          this.message = "Conference End";
          return res.json(this.Response());
        }
      } else {
        console.log(
          "There is only agent in call kill the initiated Child Call to customer :"
        );
        const queryForRealTime = {
          AccountSid: authId,
          FriendlyName: FriendlyName,
        };
        const callDetails: any = await getParticularRealtimeCall(
          queryForRealTime
        );
        console.log("this is the child call details you need to kill : ");

        if (callDetails !== undefined && callDetails !== null) {
          console.log("callDetails.ChildCallId : ", callDetails.ChildCallId);
          const CallSid = callDetails.ChildCallId;
          const conferenceId = callDetails.ConferenceSid;
          //@ts-ignore
          const killCallData: any = await killParticularCall(CallSid,authId,authSecretId);
          //@ts-ignore
          await endConference(authId, authSecretId, conferenceId);
          console.log("kill call data : ", killCallData);
          this.data = [];
          this.status = true;
          this.code = 200;
          this.message = "Conference End";
          return res.json(this.Response());
        }
      }
    }

    const conferenceId = callDetails.ConferenceSid
      ? callDetails.ConferenceSid
      : conferenceSidWhenCustomerJoinsTheCall;
    //@ts-ignore
    const endConferenceResult = await endConference(authId,authSecretId,conferenceId);
    console.log("end conference : ", endConferenceResult);
    this.data = [];
    this.status = true;
    this.code = 200;
    this.message = "Conference End";
    return res.json(this.Response());
  }

  public async singleContactDetails(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    const authId = req.JWTUser?.authId;
    let firstName;
    let lastName;
    let phoneNumber;
    let email;
    let designation;
    let department;
    let city;
    let phoneSecondary;
    let fullName;
    let isActive;
    let AssignUser;
    let tags : any;
    let status;
    let limit;
    let sort;
    let populate;
    let fields;
    let offset;

    if(req.query.limit){
      limit = req.query.limit
    }
    if(req.query.sort){
      sort = req.query.sort
    }
    if(req.query.populate){
      populate = req.query.populate
    }
    if(req.query.fields){
      fields = req.query.fields
    }
    if(req.query.offset){
      offset = req.query.offset
    }
    if (req.query.isActive) {
      isActive = req.query.isActive;
    }

    if (req.query.firstName) {
      firstName = req.query.firstName;
    }
    if (req.query.lastName) {
      lastName = req.query.lastName;
    }
    if (req.query.phoneNumber) {
      phoneNumber = req.query.phoneNumber;
    }
    if (req.query.email) {
      email = req.query.email;
    }
    if (req.query.designation) {
      designation = req.query.designation;
    }
    if (req.query.department) {
      department = req.query.department;
    }
    if (req.query.city) {
      city = req.query.city;
    }
    if (req.query.phoneSecondary) {
      phoneSecondary = req.query.phoneSecondary;
    }
    if (req.query.fullName) {
      fullName = req.query.fullName;
    }
    if (req.query.AssignUser) {
      AssignUser = req.query.AssignUser;
    }
    if (req.query.tags) {
      tags = req.query.tags;
    }
    if (
      req.query.status !== undefined &&
      req.query.status !== null &&
      req.query.status !== ""
    ) {
      let tempStatus: any = req.query.status;
      status = tempStatus.split(",");
    }
    let tagsArray;

    if (tags) {
      console.log("Tags :", tags, req.query.tags);
      tagsArray = tags.split(",");
    }

    const fisrtNameFilter = firstName
      ? { firstName: { $regex: firstName, $options: "i" } }
      : {};
    const lastNameFilter = lastName
      ? { lastName: { $regex: lastName, $options: "i" } }
      : {};
    const phoneNumberFilter = phoneNumber
      ? { phoneNumber: { $regex: phoneNumber, $options: "i" } }
      : {};
    const emailFilter = email
      ? { email: { $regex: email, $options: "i" } }
      : {};
    const designationFilter = designation
      ? { designation: { $regex: designation, $options: "i" } }
      : {};
    const departmentFilter = department
      ? { department: { $regex: department, $options: "i" } }
      : {};
    const cityFilter = city ? { city: { $regex: city, $options: "i" } } : {};
    const phoneSecondaryFilter = phoneSecondary
      ? { phoneSecondary: { $regex: phoneSecondary, $options: "i" } }
      : {};
    const fullNameFilter = fullName
      ? [
          { firstName: { $regex: fullName, $options: "i" } },
          { lastName: { $regex: fullName, $options: "i" } },
        ]
      : [
          { firstName: { $regex: fullName, $options: "i" } },
          { lastName: { $regex: fullName, $options: "i" } },
        ];
    const isActiveFilter = isActive ? { isActive: isActive } : {};
    const isAssignUserFilter = AssignUser
      ? { AssignUser: { $regex: AssignUser, $options: "i" } }
      : {};
    const tagsFilter = tags ? { "Tags.name": { $in: tagsArray } } : {};
    const statusFilter = status ? { "status.name": { $in: [...status] } } : {};

    let queryParams : any = {
      ...fisrtNameFilter,
      ...lastNameFilter,
      ...phoneNumberFilter,
      ...emailFilter,
      ...designationFilter,
      ...departmentFilter,
      ...cityFilter,
      ...phoneSecondaryFilter,
      ...isActiveFilter,
      ...isAssignUserFilter,
      ...tagsFilter,
      ...statusFilter,
      AccountSid: authId,
      limit: limit,
      sort: sort,
      offset : offset,
      fields : fields,
      populate : populate,
      isDeleted : false // hard coded because we dont want to fetch details of deleted contacts
    };    
    let finalQuery : any ;
    if (fullName === undefined) {
      console.log("fullName === undefined");
      finalQuery = queryParams;
    } else if (fullName === "") {
      console.log("fullName === ''");
      finalQuery = queryParams;
    } else if (fullName !== undefined) {
      console.log("fullName !== undefined");
      finalQuery = { ...queryParams, $or: fullNameFilter };
    } else if (fullName !== "") {
      console.log("fullName !== ''");
      finalQuery = { ...queryParams, $or: fullNameFilter };
    } else {
      console.log("no query");
      finalQuery = queryParams;
    }

    //Fetch contacts
    const contacts = await getContacts(finalQuery);
    const contactsCount = await countContactDocuments(finalQuery);

    const response = {
      data: contacts,
      totalCount: contactsCount,
    };

    this.data = response;
    this.code = 200;
    this.status = true;
    this.message = "Details fetched!";

    return res.status(200).json(this.Response());
  }

  public async getUsersDetails(req: IRequest, res: IResponse): Promise<any> {
    const authId = req.JWTUser?.authId;

    const query = {
      ...req.query,
      auth_id: authId,
    };
    const usersDetails = await getUser(query);
    const count = await countUserDocuments(query);
    const response = {
      data: usersDetails,
      totalCount: count,
    };
    this.data = response;
    this.status = true;
    this.code = 200;
    this.message = "Details fetched!";

    return res.status(200).json(this.Response());
  }

  public async phoneCall(req: IRequest, res: IResponse): Promise<any> {
    const CloudNumber = req.body.From;
    const AgentNumber = req.body.To;
    const CustomerNumber = req.body.Destination;
    const Source = req.body.Source ? req.body.Source : "Web";
    const userID = req.JWTUser?._id ? req.JWTUser?._id : "";

    // Get Company id from token
    const companyId = req.JWTUser?.companyId ? req.JWTUser?.companyId : false;
    if (!companyId) {
      this.status = false;
      this.code = 403;
      this.message = "User is not assigned to any company!";
      this.data = [];

      return res.status(403).json(this.Response());
    }
    const query = {
      companyId: companyId,
    };
    //Fetch Auth id and Auth Secret from vibconnect table using company-id
    const vibDetails = await getVibconnect(query);
    const AccountSid = vibDetails.length > 0 ? vibDetails[0].authId : false;
    const AuthSecretId =
      vibDetails.length > 0 ? vibDetails[0].authSecret : false;
    if (!AccountSid || !AuthSecretId) {
      this.status = false;
      this.code = 401;
      this.message = "Not Authorized!";
      this.data = [];

      return res.status(401).json(this.Response());
    }

    if (!CloudNumber) {
      this.status = false;
      this.code = 403;
      this.message = "Provide From!";
      this.data = [];

      return res.status(403).json(this.Response());
    }

    if (!AgentNumber) {
      this.status = false;
      this.code = 403;
      this.message = "Provide To!";
      this.data = [];

      return res.status(403).json(this.Response());
    }

    if (!CustomerNumber) {
      this.status = false;
      this.code = 403;
      this.message = "Provide Destination!";
      this.data = [];

      return res.status(403).json(this.Response());
    }

    const randomId = Math.random().toString(36).substr(2, 25);
    const roomName = "Room_" + randomId;

    const correctCloudNumber = CloudNumber.replaceAll("+", "");

    const data = {
      statusCallback: `${conf.BaseUrl}/api/v2/webhooks/vibconnect/cp/phone`,
      statusCallbackEvent: "initiated, ringing, answered, completed",
      Record: "true",
      To: AgentNumber,
      //"TimeOut": ringTimeOut,
      From: correctCloudNumber, // purchased number without filtering input
      Method: "GET",
      Url: `${conf.BaseUrl}/api/getConferenceRoomForCloudPhone/${roomName}/empty`,
    };
    //@ts-ignore
    const responseOfCall: any = await makeCall(AccountSid, AuthSecretId, data);
    const json = JSON.parse(responseOfCall);

    const dataForRealTime = {
      AccountSid: AccountSid,
      FriendlyName: roomName,
      ParentCallId: json.sid ? json.sid : "",
      CallType: "Outbound",
      Direction : "Outbound",
      CloudNumber: CloudNumber,
      Caller: AgentNumber,
      Receiver: CustomerNumber,
      StartTime: json.queue_time ? json.queue_time : "",
      Recording: json.subresource_uris ? json.subresource_uris.recordings : "",
      AccountSecretId: AuthSecretId,
      Source: Source,
      userID: userID,
    };

    await createDetail(dataForRealTime);

    const dataToSend = {
      ...json,
      Destination: CustomerNumber,
      FriendlyName: roomName,
    };

    this.data = dataToSend;
    this.message = "Call Made Successfully";
    this.status = true;
    this.code = 200;
    return res.json(this.Response());
  }

  public async getSingleUserInfo(req: IRequest, res: IResponse): Promise<any> {
    const userId = req.JWTUser?._id;
    console.log("User : ", typeof userId, req.User);
    const queryParams = { ...req.query };

    const data = await getDetailById(userId, queryParams);
    console.log("Data :", data);
    this.data = data;
    this.code = 200;
    this.status = true;
    this.message = "Details fetched!";

    return res.status(200).json(this.Response());
  }

  public async getCallLogs(req: IRequest, res: IResponse): Promise<any> {
    const authId = req.JWTUser?.authId;
    const queryParams = { ...req.query, AccountSid: authId };
    //console.log("Query controller : ", queryParams);
    const data = await getDetails(queryParams);
    const count = await countDocuments(queryParams);
    //console.log("Data is ", data);

    this.data = { data: data, totalCount: count };
    this.status = true;
    this.code = 200;
    this.message = "Details fetched!";

    return res.status(200).json(this.Response());
  }

  public async getConferenceRoomForTransfercall ( req : IRequest , res : IResponse ) :Promise<any>{
    const customer_number = req.params.customer_number;
    const url = req.params.url;
    res.set("Content-Type", "text/xml");
    const defaultVRI: VoiceResponse | any = new VoiceResponse();
    try {
      if (req.params.url) {
        if (req.params.url !== "empty") {
          const voice: VoiceResponse | any = new VoiceResponse();
          console.log("url : ", url);
          voice.play(`https://vibtreedan.s3.amazonaws.com/public/${url}`);
          let Parentdial = voice.dial();
          Parentdial.conference(
            { endConferenceOnExit: "true" },
            customer_number
          );
          return res.send(voice.toString());
        }
        const voice: VoiceResponse | any = new VoiceResponse();
        let Parentdial = voice.dial();
        Parentdial.conference(
          {
            endConferenceOnExit: "true"
          },
          customer_number
        );
        return res.send(voice.toString());
      }
      const voice: VoiceResponse | any = new VoiceResponse();
      let Parentdial = voice.dial();
      Parentdial.conference({ endConferenceOnExit: "true" }, customer_number);
      return res.send(voice.toString());
    } catch (err:any) {
      console.log(err);
      this.message = err.message;
      this.status = false;
      this.code = 500;
      defaultVRI.say(err.message);
    }
    return res.send(defaultVRI.toString());
  }

  public async transferCall ( req : IRequest , res : IResponse ) : Promise<any>{
    const body : ITransferBody = req.body
    console.log("Body : ", body)
    const transferType = body.transferType || 'transfernow'
    if(!body.conferenceSid || !body.from || !body.number || !body.parentCallSid || !body.roomId || !body.transferredFrom ){
      this.data = []
      this.code = 403
      this.status = false
      this.message = 'Parameter missing!'

      return res.status(403).json(this.Response())
    }

    //1. generate XML with same conference room-id.
    const conferenceXmlWithSameRoomId  = `${conf.BaseUrl}/api/getConferenceRoomForTranferCall/${body.roomId}/empty`
    //2. make a call to agent with same conference room-id.

    //2.a check company details 
    const companyId = req.JWTUser?.companyId ? req.JWTUser?.companyId : false;
    if (!companyId) {
      this.status = false;
      this.code = 403;
      this.message = "User is not assigned to any company!";
      this.data = [];

      return res.status(403).json(this.Response());
    }

    const query = {
      companyId: companyId,
    };
    const vibDetails = await getVibconnect(query);
    const AccountSid = vibDetails.length > 0 ? vibDetails[0].authId : false;
    const AuthSecretId =
      vibDetails.length > 0 ? vibDetails[0].authSecret : false;
    
    if (!AccountSid || !AuthSecretId) {
        this.status = false;
        this.code = 401;
        this.message = "Not Authorized check company details!";
        this.data = [];
  
        return res.status(401).json(this.Response());
    }

    //Get customer call id.
    let customerCallId
    let conferenceId 
    let listOfPreviousCallIdThatAreTransferred : string[] = [] 
    const queryToGetCustomerCall = {$or: [{ ParentCallId : body.parentCallSid},{ParentCallSid : body.parentCallSid} , {ParentCallIdTransferCall : body.parentCallSid}]}
    const responseOfCurrentcallDetail : any = await getParticularRealtimeCall(queryToGetCustomerCall)
    // console.log("Response of current call : ", responseOfCurrentcallDetail)
    if(responseOfCurrentcallDetail){
      if(responseOfCurrentcallDetail.Direction.toLowerCase() === 'inbound'){
        customerCallId = responseOfCurrentcallDetail?.ParentCallSid
        conferenceId = responseOfCurrentcallDetail?.ConferenceSid
      }else if(responseOfCurrentcallDetail.Direction.toLowerCase() === 'outbound'){
        customerCallId = responseOfCurrentcallDetail.CustomerCallId ? responseOfCurrentcallDetail.CustomerCallId : responseOfCurrentcallDetail.ChildCallId
        conferenceId =  body.conferenceSid
        listOfPreviousCallIdThatAreTransferred  = responseOfCurrentcallDetail.ListOfTransferredCalls
      }
    }
    //2.b put customer on hold.
    const holdMusic =  "https://raw.githubusercontent.com/Danish-Asghar2909/mp3.xml/main/hold.xml"
    const payloadToPutOnHold = {
      "friendly_name": body.roomId,
      "hold": true,
      "hold_method": "GET",
      "hold_url": holdMusic,
      "conferenceId" : conferenceId,
      "callId": customerCallId //customer call id.
    }
    const responseOfHold = await handleHold( AccountSid , AuthSecretId , payloadToPutOnHold)
    logger.info('response of hold before trnasfer: ' + responseOfHold)
    const jsonResponseOfHold : IHoldResponse = JSON.parse(responseOfHold)
    if(jsonResponseOfHold.conference_sid === ""){
      this.data = []
      this.message = 'Conference does not exist to hold a customer!'
      this.status = false
      this.code = 400

      return res.status(400).json(this.Response())
    }
    //2.c get vibconnect credentials of user to make call
    //@ts-ignore
    const correctCloudNumber = body.from.replaceAll("+", "");
    const method = 'GET';
    const sendDigitsObj =  body.SendDigits ? { "SendDigits" : body.SendDigits} : {}
    const payloadToMakeCallToAgent = {
      statusCallback: `${conf.BaseUrl}/api/v2/webhook/vibconnect/cp/phone/transfer`,
      statusCallbackEvent: "initiated, ringing, answered, completed",
      Record: "true",
      recordingStatusCallback: `${conf.BaseUrl}/api/vibconnect/webhook/recordings`,
      recordingStatusCallbackEvent: "in-progress, completed, absent",
      recordingStatusCallbackMethod: "POST",
      To: body.number,
      //"TimeOut": ringTimeOut,
      From: correctCloudNumber, // purchased number without filtering input
      Method: method,
      Url: conferenceXmlWithSameRoomId,
      ...sendDigitsObj
    }

    const responseOfCall: any = await makeCall(AccountSid,AuthSecretId,payloadToMakeCallToAgent);
    logger.info('response of transfer call : ', responseOfCall)
    const json = JSON.parse(responseOfCall);
    console.log("JSON : ", json)
    //4. send data to socket in frontend.
    //3. generate a log in realTime database to generate CDR after calls end.
    const dataForRealTime = {
      AccountSecretId : AuthSecretId,
      FriendlyName : body.roomId,
      Source : 'Web-Transfer',
      userID : body.transferredTo,
      // ParentCallId : body.parentCallSid,
      ParentCallIdTransferCall : body.parentCallSid, // New key same as parent call so it will not get deleted after the call transferred
      CallType : 'Outbound',
      Direction : "Outbound",
      CloudNumber : body.from,
      Receiver: body.caller,// Customer number
      Caller : body.number, // Agent number
      CallStatus : json?.status,
      AccountSid :  AccountSid,
      // ConferenceSid : body.conferenceSid,
      ConferenceSidTransfer : body.conferenceSid,
      ChildCallId : json.sid,
      Type : 'Transfer',
      TransferType : transferType.toLocaleLowerCase(),
      transferFrom : body.transferredFrom,
      ListOfTransferredCalls : [json.sid , ...listOfPreviousCallIdThatAreTransferred],
      CustomerCallId : customerCallId 
    }
    console.log("data For realtime : ", dataForRealTime)
    const data = await createDetail(dataForRealTime)

      this.data = data
      this.code = 201
      this.status = true
      this.message = 'Call transferred Successfully!'
  
      return res.status(201).json(this.Response())
  }

  public async hangupTransferCallAndSaveCdr ( req : IRequest , res : IResponse ) : Promise<any>{
    const body : IHangupTransferCallBody = req.body
    console.log("Body : ", body)
    // We can use this code to hangup through Admin because here we are using ID for that.
    // if(!body.id){

    //   this.data = []
    //   this.code = 403
    //   this.status = false
    //   this.message = 'Please provide ID to hangup call!'

    //   return res.status(403).json(this.Response())
    // }

    // if(!isValidMongoDbObjectId(body.id)){
    //   this.data = []
    //   this.code = 403
    //   this.status = false
    //   this.message = 'Please check ID to hangup call!'

    //   return res.status(403).json(this.Response())
    // }

    const callId = body.callId
    //1. Find particular data in realtime
    // const dataInRealTime : any = await getRealtimeCallById(body.id)
    const dataInRealTime : any = await getParticularRealtimeCall({ChildCallId : callId})
    if(!dataInRealTime){

      const queryToFindTransfercall = { "listOfChildCalls.CallSid" : callId , "Source" : 'Web-Transfer' }
      const updates = { $set : { Notes : body.Notes ? body.Notes : [] ,  Tags : body.Tags ? body.Tags : [] }}
      const options = { upsert : false}

      const response = await ivrFlowFindOneAndUpdate( queryToFindTransfercall , updates , options)
      console.log("Response : ", response)
      if(!response){

        this.data = []
        this.code = 404
        this.status = false
        this.message = 'No row found in Realtime'
  
        return res.status(404).json(this.Response())

      }
      this.data = []
      this.status = true
      this.code = 201
      this.message = 'Call hangup!'
  
      return res.status(201).json(this.Response())
    }
    console.log("Data in realtime : ", dataInRealTime)
    //2. Add Notes and Tags 
    const formattedDataToGenerateDataLikeIVR = {
      ParentCallSid : dataInRealTime.ParentCallIdTransferCall,
      ChildCallSid : dataInRealTime.ChildCallId,
      listOfChildCallSid  : [dataInRealTime.ChildCallId],
      Source : `${dataInRealTime.Source}`,
      userID : dataInRealTime.userID,
      CloudNumber : dataInRealTime.CloudNumber,
      DirectionFromCloudPhone : 'Outbound',
      Notes : body.Notes ? body.Notes : [],
      Tags : body.Tags ? body.Tags : [],
      ReceiverInOutBound : dataInRealTime.Receiver ? dataInRealTime.Receiver : null,
      Caller : dataInRealTime.Caller,
      transferFrom : dataInRealTime?.transferFrom,
    }
    //This is for intial level where if transfree don't pick a call we are disconnecting the entire conference [not needed now]
    // const authId = dataInRealTime?.AccountSid;
    // const authSecretId = dataInRealTime?.AccountSecretId;
    // const conferenceId = dataInRealTime.ConferenceSidTransfer;

    // const endConferenceResponse = await endConference(authId, authSecretId, conferenceId);
    // logger.info('End conference response after hangup transfer call : '+ endConferenceResponse)
    logger.info('Formatted data for Transfer Call : ' + JSON.stringify(formattedDataToGenerateDataLikeIVR))
    //3. Create a Temperory Value to save data into CDR.
    setTimeout(() => {
      // console.log("inside setTimeout" , ifConferenceExist)
      this.createALogFortransferCall(formattedDataToGenerateDataLikeIVR)
      // webSocketController.useConferenceDetailsToConvertData(formattedDataToGenerateDataLikeIVR)
      findOneAndDeleteRealtimeDetails({ConferenceSidTransfer : dataInRealTime.ConferenceSidTransfer})
    }, 10000);

    this.data = []
    this.status = true
    this.code = 201
    this.message = 'Call hangup!'

    return res.status(201).json(this.Response())
  }

  // ------------------------------------------------------

  getRecordingSid = async (arr: any) => {
    let RecordingUrl = "";
    let RecordingSid;
    let CallSid;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].CallStatus === "completed") {
        RecordingUrl = arr[i].RecordingUrl;
        CallSid = arr[i].CallSid;
        if (CallSid !== undefined && CallSid !== null) {
          const recordingDetails = await CallRecordinsModel.findOne({
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

  //It take all callbacks of particular call and return a summary of that call in object.
  createSummaryOfChildCall = async (childArray: any) => {
    if (childArray.length === 0) return null;
    let RecordingSid = await this.getRecordingSid(childArray);
    let ChildObject = new Object();
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

    if (
      childArray[0].From !== undefined &&
      childArray[0].From.startsWith("sip")
    ) {
      let val = childArray[0].From.split(":")[1];
      let num = val.substring(0, 12);
      //@ts-ignore
      ChildObject["From"] = num;
    }
    const callDurationFromArray = childArray.filter((val: any) => {
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

  //It Create a formatted object of timing of calls with call status
  formatCallStatusObjectFromArray(ivrFlow: any) {
    let tempObj: any = {};
    ivrFlow.map((val: any) => {
      if (val.CallStatus === "in-progress") {
        if (tempObj["in-progress"] === undefined) {
          tempObj[val.CallStatus] = val.subscribeDate.toUTCString();
        }
      } else {
        tempObj[val.CallStatus] = val.subscribeDate.toUTCString();
      }
      // tempObj[val.CallStatus] = val.subscribeDate.toUTCString() // if we remove toUtcString() the code will return local time only
    });

    return tempObj;
  }

  findUserNameFromNumber = async (number: any, authId: any) => {
    let tempObj = { name: "", userId: "" };
    const myQuery = {
      phone: { $regex: number, $options: "i" },
      auth_id: authId,
    };
    const user = await UserPermissionUserModel.findOne(myQuery);
    //console.log("user ",user)
    if (user) {
      return (tempObj = { name: user.fullName, userId: user._id });
    }
    return tempObj;
  };

  findContactNameFromNumber = async (number: any, authId: any) => {
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

  

  useArrayOfChildCallsToMakeChildCallLifeCycle = async (arr: any) => {
    let requiredListOfFormattedChildCalls: any = [];

    await Promise.all(
      arr.map(async (val: any) => {
        const detailsOfChildCallSid = await IvrStudiosStatusModel.find({
          ParentCallSid: val,
        }).sort("subscribeDate");
        const childCallDetailsInSingleObject: any =
          await this.createSummaryOfChildCall(detailsOfChildCallSid);
        let Receiver;
        let AuthId;
        if (
          childCallDetailsInSingleObject !== null &&
          childCallDetailsInSingleObject !== undefined
        ) {
          if (
            childCallDetailsInSingleObject.To !== null &&
            childCallDetailsInSingleObject.To !== undefined
          ) {
            Receiver = childCallDetailsInSingleObject.To
              ? childCallDetailsInSingleObject.To.slice(-10)
              : null;
            AuthId = childCallDetailsInSingleObject.AccountSid
              ? childCallDetailsInSingleObject.AccountSid
              : null;
          }
        }

        //let AuthId = childCallDetailsInSingleObject.AccountSid ? childCallDetailsInSingleObject.AccountSid : null
        let userDetails : any = {};
        let contactDetails : any = {};
        if (Receiver) {
          userDetails = await this.findUserNameFromNumber(Receiver, AuthId);
          if(userDetails.userId === ""){
            //search in contact
            contactDetails = await this.findContactNameFromNumber(Receiver , AuthId)
          }
        }
        // console.log("userDetails ", userDetails);
        let tempObj = { ...childCallDetailsInSingleObject, ...userDetails , ...contactDetails };
        requiredListOfFormattedChildCalls.push(tempObj);
      })
    );

    return await requiredListOfFormattedChildCalls;
  };

  sortArrayOfChildCallsAccordingTotime(arrayOfChildCalls: any) {
    arrayOfChildCalls.sort(function (a: any, b: any) {
      return a.StartTime - b.StartTime;
    });
    return arrayOfChildCalls;
  }

  makeObjectFromArrayOfObjects = async (ivrFlow: any) => {
    let FromWithoutSip;

    if (!ivrFlow[0].From) {
      FromWithoutSip = "";
    } else {
      if (ivrFlow[0].From !== undefined || ivrFlow[0].From !== null) {
        if (ivrFlow[0].From.startsWith("sip")) {
          let val = ivrFlow[0].From.split(":")[1];
          let num = val.substring(0, 12);
          FromWithoutSip = num;
        } else {
          FromWithoutSip =
            ivrFlow[0].From.length > 12
              ? ivrFlow[0].From.slice(-12)
              : ivrFlow[0].From;
        }
      }
    }

    let newBody: any = {};
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
    newBody.ParentCall.CallStatus = ParentCallStatusObject;

    return newBody;
  };

  calculateQueueTimeForParticularCall = (arr: any) => {
    let queueTime = 0;
    if (!arr[0].Status) return { QueueTime: queueTime };
    let startTimeOfFirstCall;
    let startTimeOfConnectedCall;
    let result: any = {};
    if (arr.length > 0) {
      if (arr[0] === null) {
        return { QueueTime: queueTime };
      }
      startTimeOfFirstCall = arr[0].Status.initiated;
      if (arr[0].Status === undefined) return { QueueTime: queueTime };
      if (arr[arr.length - 1].Status.completed) {
        if (arr[arr.length - 1].Status["in-progress"]) {
          startTimeOfConnectedCall = arr[arr.length - 1].Status["in-progress"];
        }
      } else {
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


      let startTime = new Date(startTimeOfFirstCall);
      let endTime = new Date(startTimeOfConnectedCall);
      let diff = endTime.getTime() - startTime.getTime();
      let diffSeconds = Math.floor(diff / 1000);

      return { QueueTime: diffSeconds.toString() };
    } else {
      result = { QueueTime: queueTime };
    }
    return result;
  };

  calculateFinalStatus = (data: any) => {
    let FinalStatus = "completed";
    if (!data) return FinalStatus;
    const format = JSON.stringify(data);
    if (format === "[{}]") return FinalStatus;
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

  useNumberToFindDetailsOfCloudNumber = async (number: any) => {
    const numberDetails = await NumberModel.find({
      phone_number: { $regex: number },
    });
    return numberDetails;
  };

  useNumberToFoundDetailsOfContacts = async (number: any, AccountSid: any) => {
    const contactDetails = await contactModel.find({
      AccountSid: AccountSid,
      phoneNumber: { $regex: number },
    });
    return contactDetails;
  };

  getCountryCode = (input: any) => {
    const firstLetterOfNumber = input[0];
    if (firstLetterOfNumber === "1") {
      logger.info("It is a USA number");
      return "1";
    } else {
      logger.info("It is not a USA number");
      const countryCode = input.substring(0, 2);
      logger.info("Country Code : " + countryCode);
      return countryCode;
    }
  };

  checkDataFormatAndAddPlusToAllNumber = (data: any) => {
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

  createALogFortransferCall = async ( body : any ) =>{

    //Create mai CDR body 
    let ParentCallSid = body?.ParentCallSid;
    let ChildCallSid = body?.ChildCallSid;
    let Notes = body.Notes ? body.Notes : [];
    let Tag = body.Tags ? body.Tags : [];
    let Source = body.Source ? body.Source : "";
    let userID = body.userID ? body.userID : null;
    let listOfChildCallSid = body?.listOfChildCallSid;
    let Reciever = body?.Caller // agent who receive transferred call
    let ContactNumber = body?.ReceiverInOutBound // Customer who is already in call while transfer
    //Create ParentCall Body 
    let queueTimeObj = {};
    const detailsOfParentCallSid = await IvrStudiosStatusModel.find({
      ParentCallSid: ParentCallSid,
    }).sort("subscribeDate");
    let FinalCallStatus = body.FinalCallStatus ? body.FinalCallStatus : "completed";
    let parentCallDuration;
    let ConnectedChildCallDuration;
    let ReceiverInOutBound = Reciever;
    let countryCode = "91";
    if (body.CloudNumber) {
      countryCode = this.getCountryCode(body.CloudNumber);
    }


    if (detailsOfParentCallSid.length > 0) {
      for (let i = 0; i < detailsOfParentCallSid.length; i++) {
        if (detailsOfParentCallSid[i]?.CallStatus === "completed") {
          parentCallDuration = detailsOfParentCallSid[i]?.CallDuration;
        }
      }
    }

    let bodyOfIvrFlow : any = await this.makeObjectFromArrayOfObjects(detailsOfParentCallSid);
    if (
      body.DirectionFromCloudPhone !== undefined &&
      body.DirectionFromCloudPhone !== null
    ) {
      bodyOfIvrFlow.CloudNumber = body.CloudNumber;
    }

    //Create a list of child call
    if (body?.listOfChildCallSid.length > 0) {
      listOfChildCallSid = [...new Set(body?.listOfChildCallSid)];
    }

    let arrayOfFormattedChildCalls =
    await this.useArrayOfChildCallsToMakeChildCallLifeCycle(
      listOfChildCallSid
    );

    bodyOfIvrFlow.ParentCall.ChildCall = [...arrayOfFormattedChildCalls] //it is just for UI so that UI won't break

    let formattedArrayOfChildCallsAccordingToTime = this.sortArrayOfChildCallsAccordingTotime(arrayOfFormattedChildCalls);
    console.log("Call Sid : ", ParentCallSid, ChildCallSid)

    if (formattedArrayOfChildCallsAccordingToTime.length > 0) {
      queueTimeObj = this.calculateQueueTimeForParticularCall(
        formattedArrayOfChildCallsAccordingToTime
      );
    }
    //Get Cloud Number Details
    const FlowId = await ivrFlowUIModel.find({ number: body.CloudNumber });
    if (FlowId.length > 0) {
      if (FlowId[0]._id !== undefined) {
        bodyOfIvrFlow.FlowId = FlowId[0]?._id;
        bodyOfIvrFlow.FlowName = FlowId[0]?.name;
      }
    }
    FinalCallStatus = this.calculateFinalStatus(arrayOfFormattedChildCalls);
    const MissedCallType = FinalCallStatus !== "completed" ? "Unattended" : "Attended";
    const numberDetails: any = await this.useNumberToFindDetailsOfCloudNumber(body.CloudNumber);
    const nameOfNumber = numberDetails.length > 0 ? numberDetails[0].name : "";
    //Get or Create Contact for both Agent and Customer
    let contactId;
    let contactIdOfReceiver;
    const contactDetails = await this.useNumberToFoundDetailsOfContacts(ContactNumber.slice(-10),detailsOfParentCallSid[0].AccountSid);
    if (contactDetails.length > 0) {
      contactId = contactDetails[0]._id;
    }
  
    const contactDetailsOfReceiver = await this.useNumberToFoundDetailsOfContacts(ReceiverInOutBound.slice(-10),detailsOfParentCallSid[0].AccountSid);
    if (contactDetailsOfReceiver.length > 0) {
      contactIdOfReceiver = contactDetailsOfReceiver[0]._id;
    }

    const callerFirstName =
    contactDetails.length > 0 ? contactDetails[0].firstName : "Unknown";
    const callerLastName =
      contactDetails.length > 0 ? contactDetails[0].lastName : "";

    const ReceiverFirstName =
      contactDetailsOfReceiver.length > 0
        ? contactDetailsOfReceiver[0].firstName
        : "Unknown";
    const ReceiverLastName =
      contactDetailsOfReceiver.length > 0
        ? contactDetailsOfReceiver[0].lastName
        : "";

    const CallerFullName = callerFirstName + " " + callerLastName;
    const ReceiverFullName = ReceiverFirstName + " " + ReceiverLastName;

    if (contactDetails.length === 0) {
      const ContactModel = new contactModel({
        firstName: "Unknown",
        lastName: "",
        phoneNumber: `${countryCode}${ContactNumber}`,
        // user_id: userDetails?._id,
        AccountSid: detailsOfParentCallSid[0].AccountSid,
      });
      // console.log("New Contact ID Inbound : ", ContactModel);
      contactId = ContactModel._id;
      await ContactModel.save();
    }

    if (contactDetailsOfReceiver.length === 0) {
      const ContactModel = new contactModel({
        firstName: "Unknown",
        lastName: "",
        phoneNumber: `${countryCode}${Reciever.slice(-10)}`,
        // user_id: userDetails?._id,
        AccountSid: detailsOfParentCallSid[0].AccountSid,
      });
      // console.log("New Contact ID Outbound : ", ContactModel);
      contactIdOfReceiver = ContactModel._id;
      await ContactModel.save();
    }

    bodyOfIvrFlow.ivrDetails = [{ivrName : 'Test'}] // to stop error in UI in call lifecycle
    let finalDataToSave = {
      Notes: Notes,
      ...bodyOfIvrFlow,
      ...queueTimeObj,
      ContactName: CallerFullName,
      ContactNumber: ContactNumber,
      Source: Source,
      userID : userID,
      transferFrom : body.transferFrom,
      contactId: contactId,
      CallerName: CallerFullName,
      ReceiverName: ReceiverFullName,
      CloudNumberName: nameOfNumber,
      ContactIdOfReceiver : contactIdOfReceiver,
      // UnAttendedCallCdrList: unAttendedCallCdrList,
      CallerType: "Repeat",
      Receiver: ReceiverInOutBound, // Agent who receive call
      CallStatus: body.FinalCallStatus
        ? body.FinalCallStatus
        : FinalCallStatus,
      MissedCallType: MissedCallType,
      ParentCallDuration: parentCallDuration,
      ConnectedChildCallDuration: ConnectedChildCallDuration,
      listOfChildCalls: [
        ...arrayOfFormattedChildCalls,
      ],
      Tags: Tag,
    };
    // console.log("Final data : ", finalDataToSave)
    let formattedData = this.checkDataFormatAndAddPlusToAllNumber(finalDataToSave);
    const data = new ivrFlowModel(formattedData);
    data
    .save()
    .then(async ( response : any ) => {
      // console.log("Response 901 : ", response)
      logger.info(
        "data saved for transfer : " + 
        JSON.stringify(finalDataToSave)
      );

    })
    .catch((err: any ) => {
      logger.info("error in saving data "+ err);
    });
  }

  public async handleHoldOrUnhold ( req : IRequest , res : IResponse ) : Promise<any>{
    const body = req.body
    const companyId = req.JWTUser?.companyId ? req.JWTUser?.companyId : false;
    if (!companyId) {
      this.status = false;
      this.code = 403;
      this.message = "User is not assigned to any company!";
      this.data = [];

      return res.status(403).json(this.Response());
    }

    const query = {
      companyId: companyId,
    };
    const vibDetails = await getVibconnect(query);
    const AccountSid = vibDetails.length > 0 ? vibDetails[0].authId : false;
    const AuthSecretId =
      vibDetails.length > 0 ? vibDetails[0].authSecret : false;
    
    if (!AccountSid || !AuthSecretId) {
        this.status = false;
        this.code = 401;
        this.message = "Not Authorized check company details!";
        this.data = [];
  
        return res.status(401).json(this.Response());
    }

    //2.b put customer on hold.
    const holdMusic =  "https://raw.githubusercontent.com/Danish-Asghar2909/mp3.xml/main/hold.xml"
    const payloadToPutOnHold = {
      "friendly_name": body.roomId,
      "hold": body.hold,
      "hold_method": "GET",
      "hold_url": holdMusic,
      "conferenceId" : body.conferenceSid,
      "callId": body.parentCallSid //customer call id.
    }
    const responseOfHold = await handleHold( AccountSid , AuthSecretId , payloadToPutOnHold)
    const jsonResponseOfHold : IHoldResponse = JSON.parse(responseOfHold)
    if(jsonResponseOfHold.conference_sid === ""){
      this.data = []
      this.message = 'Conference does not exist to hold a customer!'
      this.status = false
      this.code = 400

      return res.status(400).json(this.Response())
    }

    this.data = jsonResponseOfHold
    this.code = 200
    this.status = true
    this.message = `Request complete!`

    return res.status(200).json(this.Response())
  }

  public async killParticularCall ( req : IRequest , res : IResponse ) : Promise<any>{
    const callsid  = req.body.callsid 

    if(!callsid){
      this.status = false;
      this.code = 403;
      this.message = "Missing parameter callsid!";
      this.data = [];

      return res.status(403).json(this.Response());
    }
    const companyId = req.JWTUser?.companyId ? req.JWTUser?.companyId : false;
    if (!companyId) {
      this.status = false;
      this.code = 403;
      this.message = "User is not assigned to any company!";
      this.data = [];

      return res.status(403).json(this.Response());
    }



    const query = {
      companyId: companyId,
    };
    const vibDetails = await getVibconnect(query);
    const AccountSid = vibDetails.length > 0 ? vibDetails[0].authId : false;
    const AuthSecretId =
      vibDetails.length > 0 ? vibDetails[0].authSecret : false;
    
    if (!AccountSid || !AuthSecretId) {
        this.status = false;
        this.code = 401;
        this.message = "Not Authorized check company details!";
        this.data = [];
  
        return res.status(401).json(this.Response());
    }

    //Kill call

    try{
      const killCallResponse : any= await killParticularCall( callsid , AccountSid , AuthSecretId)
      
      this.data = JSON.parse(killCallResponse)
      this.code = 200
      this.status = true
      this.message = `Request complete!`
    }catch(err:any){
      logger.error('Error in kill call : '+ err)
      this.data = []
      this.code = 500
      this.status = true
      this.message = `Something went wrong!`
    }



    return res.status(200).json(this.Response())
  }
}
