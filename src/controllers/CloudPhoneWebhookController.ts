import Controller from "./Index";
import CloudPhoneRealTimeModel from "../models/IvrStudiousRealTime";
import { IRequest, IResponse } from "../types/IExpress";
import * as conf from "../config/index";
import moment from "moment";

import { createConferenceCallBack } from "../services/conferenceCallBackModel";
import {
  getParticularRealtimeCall,
  updateRealtimeDetails,
  findOneAndDeleteRealtimeDetails,
  deleteRealtimeDetailsById,
  findManyAndDeleteRealtimeDetails
} from "../services/realTimeIvrStudiosModel";
import { createIvrStudiosCdrCallBack  } from "../services/ivrStudiosCdrModel";
import {
  makeCall,
  endConference,
  killParticularCall,
  handleHold
} from "../services/Vibconnect/index";
import { getConferenceCallBacks } from "../services/conferenceCallBackModel";
import logger from "../config/logger";
import WebSocketController from "../controllers/WebSocketController";
const webSocketController = new WebSocketController();
import request from "request";
import {findOneAndUpdateConference} from '../controllers/ConferenceController';
import { getVibconnect } from '../services/vibconnectModel'
import { getOneConference } from '../services/conferenceModel';
const httpClient = request;

interface Conference {
  AccountSid: string;
  ConferenceSid: string;
  FriendlyName: string;
  StatusCallbackEvent: string;
  Timestamp: string;
  CallSid: string;
  EndConferenceOnExit?: string;
  Hold?: string;
  Muted?: string;
  SequenceNumber?: string;
  StartConferenceOnEnter?: string;
}

interface CallData {
  AccountSid: string;
  AnswerTime: string;
  ApiVersion: string;
  CallDuration?: string;
  CallSid: string;
  CallStatus: string;
  CallbackSource: string;
  Called: string;
  Caller: string;
  Direction: string;
  From: string;
  FromStripped: string;
  HangupTime?: string;
  InitiationTime?: string;
  ParentCallSid: string;
  RingTime?: string;
  SequenceNumber: string;
  Timestamp: string;
  To: string;
}



export default class CloudPhoneWebhookController extends Controller {
  public constructor(model?: any) {
    super(model);
    this.cloudPhoneConferenceWebhook =
      this.cloudPhoneConferenceWebhook.bind(this);
    this.cloudPhoneConferenceAndCallWebhookForWebRtc =
      this.cloudPhoneConferenceAndCallWebhookForWebRtc.bind(this);
    this.cloudPhoneTransferWebhook = this.cloudPhoneTransferWebhook.bind(this);
  }

  checkTheNumberContainsSymbolOrNOT(number: any) {
    // console.log("number : ",number)
    number = decodeURIComponent(number);
    if (number.includes("+")) {
      return number.replace(/[^0-9]/g, "");
    }
    return number;
  }

  filterDataAccordingToConferenceAndSendToUi = async (
    callback: any,
    io: any,
    type: any,
    conferenceDetails: any
  ) => {
    // console.log("conferenceDetails ",conferenceDetails)

    io.of("/dropcodes").on("join", (room: any) => {
      io.join(room);
      //  io.to(room).emit('roomData', call_back_status )
      io.of("/dropcodes").to(room).emit("roomData", callback);
    });

    io.of("/dropcodes").emit("test", {
      callback: callback,
      type: type,
      conferenceDetails: conferenceDetails,
    });
    io.of("/dropcodes")
      .to(conferenceDetails.FriendlyName)
      .emit("roomData", callback);
  };

  sendFakeCompletedToUIOnly = async ( data : any , io : any ) => {
    //find current call
    const parentCallId = data.ParentCallSid
    const queryToGetCurrentCallDetails =  { ChildCallId : parentCallId , sort : "_id"}
    const currentTransferData : any = await getParticularRealtimeCall(queryToGetCurrentCallDetails)
    if(currentTransferData){
        //find trnasferrer call detail
        const currentConferencData = {FriendlyName : currentTransferData.FriendlyName , sort : "_id"}
        let parentCallWhoInitiateTransfer : any  = await getParticularRealtimeCall(currentConferencData)
        // console.log("Parent call who initiate call : ", parentCallWhoInitiateTransfer)
        if(parentCallWhoInitiateTransfer){
        //Check inbound or outbound call it is 
        if(parentCallWhoInitiateTransfer.Direction){
          if(parentCallWhoInitiateTransfer.Direction.toLowerCase() === 'inbound'){
             logger.info("This is an inbound call.")
          }
          if(parentCallWhoInitiateTransfer.Direction.toLowerCase() === 'outbound' && currentTransferData.TransferType === 'transfernow'){
            //  this.updateTransferredCallWithDisconnectedCall(parentCallWhoInitiateTransfer , data) 
            io.of("/dropcodes").on("join", (room: any) => {
              io.join(room);
              //  io.to(room).emit('roomData', call_back_status )
              io.of("/dropcodes").to(room).emit("roomData", parentCallWhoInitiateTransfer);
            });
        
            io.of("/dropcodes").emit("test", {
              callback: data,
              type: 'transfer',
              conferenceDetails: parentCallWhoInitiateTransfer,
            });
            //change the status
            parentCallWhoInitiateTransfer["CallStatus"] = 'completed'
            io.of("/dropcodes")
              .to(parentCallWhoInitiateTransfer.FriendlyName)
              .emit("roomData", parentCallWhoInitiateTransfer);
          }
        }    
      }
    }
  }

  updateTransferredCallWithDisconnectedCall = async ( data : any , currentCall? : any ) =>{
    //get previous call sid.
    logger.info("Data to replace : " + JSON.stringify(data) )
    //if current call is in-progress then add new child call id to transferred call.
    if(currentCall.CallStatus === 'in-progress'){
      //create a list of child calls
      const previousChildCallId = data?.ChildCallId
      const queryToSearchTransferredCall =  { transferFrom : data?.userID }
      const updates = { $push : { ListOfTransferredCalls : previousChildCallId }}
      const options = { upsert : false , new : true }
      const responseOfUpdate = await updateRealtimeDetails(queryToSearchTransferredCall , updates , options )
      if(responseOfUpdate){
        //delete previous call because the transferrer picks call so we don't need previous.
        const response = await deleteRealtimeDetailsById(data?._id)
        logger.info("Response of deleting previous call because transferrer picks call : " +  JSON.stringify(response))
      }
    }else{
      //if tranferrer didn't pick the call then update the previous call
      const currentCallId = currentCall?.ParentCallSid
      const queryToSearchTransferrerCall =  { _id : data._id }
      const updates = { $push : { ListOfTransferredCalls : currentCallId }}
      const options = { upsert : false , new : true }
      const responseOfUpdate = await updateRealtimeDetails(queryToSearchTransferrerCall , updates , options )
      if(responseOfUpdate){
        //delete new call because the transferrer didn't pick call so may be they again transfer to new number
        const queryToSearchTransferredCall =  { transferFrom : data?.userID }
        const response = await findOneAndDeleteRealtimeDetails(queryToSearchTransferredCall)
        logger.info("Response of deleting new call because transferrer did not picks call : " +  JSON.stringify(response))
      }
    }
    //rest conference callback handle it for outbound.
  }

  killInitiatedCallIfConferenceEnd = async ( data : Conference ) =>{
    //get trnasferred call data from realtime
    const queryToGetTransferredCall = { ConferenceSidTransfer : data.ConferenceSid , Source : 'Web-Transfer'}
    const transferredCall : any = await getParticularRealtimeCall(queryToGetTransferredCall)
    if(transferredCall){
      //transferred call exist so kill call of that agent.
      const agentCallSid = transferredCall.ChildCallId
      const killCallResponse = await killParticularCall( agentCallSid , transferredCall.AccountSid , transferredCall.AccountSecretId)
      logger.info('Kill call of agent if agent not pick call ' +killCallResponse)
    }
  }

  sendCompletedDataToUiInTalkFirst = async ( data : any , io : any ) =>{
        //find trnasferrer call detail
        const currentConferencData = { ParentCallIdTransferCall : data.ParentCallSid , sort : "_id"}
        let parentCallWhoInitiateTransfer : any  = await getParticularRealtimeCall(currentConferencData)
        // logger.info("Parent call who initiate call : ", parentCallWhoInitiateTransfer.toString())
        if(parentCallWhoInitiateTransfer){
        //Check inbound or outbound call it is 
        if(parentCallWhoInitiateTransfer.Direction){
          if(parentCallWhoInitiateTransfer.Direction.toLowerCase() === 'inbound'){
             logger.info("This is an inbound call.")
          }
          if(parentCallWhoInitiateTransfer.Direction.toLowerCase() === 'outbound' && parentCallWhoInitiateTransfer.TransferType === 'talkfirst'){
            //  this.updateTransferredCallWithDisconnectedCall(parentCallWhoInitiateTransfer , data) 
            io.of("/dropcodes").on("join", (room: any) => {
              io.join(room);
              //  io.to(room).emit('roomData', call_back_status )
              io.of("/dropcodes").to(room).emit("roomData", parentCallWhoInitiateTransfer);
            });
        
            io.of("/dropcodes").emit("test", {
              callback: data,
              type: 'transfer',
              conferenceDetails: parentCallWhoInitiateTransfer,
            });
            //change the status
            parentCallWhoInitiateTransfer["CallStatus"] = 'completed'
            parentCallWhoInitiateTransfer["Source"] = 'Web'
            parentCallWhoInitiateTransfer["ParentCallSid"] = data.ParentCallSid
            delete parentCallWhoInitiateTransfer["ParentCallIdTransferCall"]
            console.log("Parent call need to transfer to ui : " + JSON.stringify(parentCallWhoInitiateTransfer))
            io.of("/dropcodes")
              .to(parentCallWhoInitiateTransfer.FriendlyName)
              .emit("roomData", parentCallWhoInitiateTransfer);
          }
        }    
      }
    
  }

  public async cloudPhoneConferenceWebhook(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    logger.info("body of conference cloud phone " + JSON.stringify(req.body));
    const body: any = req.body;
    let query;
    let updates;

    if (req.body.ConferenceSid) {
      createConferenceCallBack({
        ...body,
        ConferenceId: req.body.ConferenceSid,
      });

      const myQuery = {
        AccountSid: body.AccountSid,
        FriendlyName: body.FriendlyName,
      };
      const ifConferenceExist: any = await getParticularRealtimeCall(myQuery);
      logger.info("if Conference Exist : " + JSON.stringify(ifConferenceExist));
      if (ifConferenceExist) {
        logger.info("write logic to update the data present in realtime ");
        logger.info("body of conference cloud phone " + JSON.stringify(body));
        let From = this.checkTheNumberContainsSymbolOrNOT(
          ifConferenceExist.CloudNumber
        );
        let Receiver = ifConferenceExist.Receiver
          ? this.checkTheNumberContainsSymbolOrNOT(ifConferenceExist.Receiver)
          : "";

        let dataNeedToUpdate;
        let timeObj = new Object();

        if (body.StatusCallbackEvent === "conference-create") {
          //@ts-ignore
          timeObj[body.StatusCallbackEvent] = body.Timestamp;
          dataNeedToUpdate = {
            $set: {
              ConferenceSid: body.ConferenceSid,
              ConferenceStatus: body.StatusCallbackEvent,
            },
            $push: { ConferenceTimeStampArray: timeObj },
          };
          const myUpdate = dataNeedToUpdate;
          const myOptions = { upsert: false };
          await updateRealtimeDetails(myQuery, myUpdate, myOptions);
        }

        if (body.StatusCallbackEvent === "participant-join") {
          //look if parent call (Agent) join or child call (customer) join
          if (body.CallSid === ifConferenceExist.ParentCallId) {
            logger.info("parent call join");
            //@ts-ignore
            timeObj[body.StatusCallbackEvent] = body.Timestamp;

            logger.info(
              "Make a Child call to customer agent is in conference "
            );
            const dataForApiCall: any = {
              statusCallback: `${conf.BaseUrl}/api/v2/webhooks/vibconnect/cp/phone`,
              // "statusCallback":`https://dataneuronbackend.herokuapp.com/subscribers`, //For testing Only
              statusCallbackEvent: "initiated, ringing, answered, completed",
              Record: "true",
              To: Receiver,
              From: From,
              Method: "GET",
              // "Url" : `${conf.BaseUrl}/api/getConferenceRoom/Room_${parentCallSid}/${url}`
              Url: `${conf.BaseUrl}/api/getConferenceRoomForCloudPhone/${body.FriendlyName}/empty`,
              recordingStatusCallback: `${conf.BaseUrl}/api//vibconnect/webhook/recordings`,
              recordingStatusCallbackEvent: "in-progress, completed, absent",
              recordingStatusCallbackMethod: "POST",
              record: "true",
            };
            let authId = ifConferenceExist.AccountSid
              ? ifConferenceExist.AccountSid
              : "";
            let authSecretId = ifConferenceExist.AccountSecretId
              ? ifConferenceExist.AccountSecretId
              : "";
            // console.log("authId ",authId)
            // console.log("authSecretId ",authSecretId)
            const callResult = await makeCall(
              authId,
              authSecretId,
              dataForApiCall
            );
            // console.log("callResult ",callResult)
            //@ts-ignore
            const jsonResponseOfCallResult = JSON.parse(callResult);
            // console.log("jsonResponseOfCallResult ",jsonResponseOfCallResult)
            dataNeedToUpdate = {
              $set: {
                ConferenceSid: body.ConferenceSid,
                ConferenceStatus: body.StatusCallbackEvent,
                ChildCallId: jsonResponseOfCallResult.sid,
                ListOfTransferredCalls : [jsonResponseOfCallResult.sid]
              },
              $push: { ConferenceTimeStampArray: timeObj },
            };
          }
          if (body.CallSid === ifConferenceExist.ChildCallId) {
            logger.info("child call join");
            //@ts-ignore
            timeObj[body.StatusCallbackEvent] = body.Timestamp;
            dataNeedToUpdate = {
              $set: {
                ConferenceSid: body.ConferenceSid,
                ConferenceStatus: body.StatusCallbackEvent,
              },
              $push: { ConferenceTimeStampArray: timeObj },
            };
          }

          const myUpdate = dataNeedToUpdate;
          const myOptions = { upsert: false };
          await updateRealtimeDetails(myQuery, myUpdate, myOptions);
        }

        if (body.StatusCallbackEvent === "participant-leave") {
          //look if parent call (Agent) leave or child call (customer) leave
          logger.info("Calculate the number of members in participants ");
          const noOfParticipants = await getConferenceCallBacks({
            FriendlyName: body.FriendlyName,
            AccountSid: body.AccountSid,
          });

          let ifConferenceEndBeforeParticipantLeaves = 0;

          let noOfParticipantsJoins = 0;
          let noOfParticipantsLeaves = 0;

          if (noOfParticipants.length > 0) {
            for (let i = 0; i < noOfParticipants.length; i++) {
              if (
                noOfParticipants[i].StatusCallbackEvent === "participant-join"
              ) {
                noOfParticipantsJoins = noOfParticipantsJoins + 1;
              }
              if (
                noOfParticipants[i].StatusCallbackEvent === "participant-leave"
              ) {
                noOfParticipantsLeaves = noOfParticipantsLeaves + 1;
              }

              if (noOfParticipants[i].StatusCallbackEvent == "conference-end") {
                ifConferenceEndBeforeParticipantLeaves =
                  ifConferenceEndBeforeParticipantLeaves + 1;
              }
            }
          }

          let noOfParticipantsPresentInConference =
            noOfParticipantsJoins - noOfParticipantsLeaves;

          logger.info("no of participants joins : " + noOfParticipantsJoins);
          logger.info("no of participants leaves : " + noOfParticipantsLeaves);
          logger.info(
            "no of participant present in call : " +
              noOfParticipantsPresentInConference
          );

          if (noOfParticipantsPresentInConference === 1) {
            let conferenceId = req.body.ConferenceSid;
            let authId = ifConferenceExist.AccountSid
              ? ifConferenceExist.AccountSid
              : "";
            let authSecretId = ifConferenceExist.AccountSecretId
              ? ifConferenceExist.AccountSecretId
              : "";

            const endConferencee = await endConference(
              authId,
              authSecretId,
              conferenceId
            );
            //kill transferred call if agent is in call and customer leaves the call when 1st agent is on hold.
            await this.killInitiatedCallIfConferenceEnd(req.body)
            logger.info(
              "result of end conference if participants in call is 1 :" +
                JSON.stringify(endConferencee)
            );
          }

          //No need now once we implement assign user then we can end conference based on agent and user .
          // if (body.CallSid === ifConferenceExist.ParentCallId) {
          //   logger.info("parent call leave");
          //   //@ts-ignore
          //   timeObj[body.StatusCallbackEvent] = body.Timestamp;
          //   dataNeedToUpdate = {
          //     $set: {
          //       ConferenceSid: body.ConferenceSid,
          //       ConferenceStatus: body.StatusCallbackEvent,
          //     },
          //     $push: { ConferenceTimeStampArray: timeObj },
          //   };
          //   const childCallIdWhichWeNeedToKill = ifConferenceExist.ChildCallId
          //     ? ifConferenceExist.ChildCallId
          //     : false;
          //   if (childCallIdWhichWeNeedToKill) {
          //     try {
          //       let authId = ifConferenceExist.AccountSid
          //         ? ifConferenceExist.AccountSid
          //         : "";
          //       let authSecretId = ifConferenceExist.AccountSecretId
          //         ? ifConferenceExist.AccountSecretId
          //         : "";
          //       await killParticularCall(
          //         childCallIdWhichWeNeedToKill,
          //         authId,
          //         authSecretId
          //       );
          //     } catch (err) {
          //       logger.error("Error in killing child call ");
          //       logger.error(JSON.stringify(err));
          //     }
          //   }
          // }


          //   if(body.CallSid === ifConferenceExist.ChildCallId){
          //     console.log("child call leave")
          //     timeObj[body.StatusCallbackEvent] = body.Timestamp
          //     dataNeedToUpdate = {$set : {ConferenceSid : body.ConferenceSid , ConferenceStatus : body.StatusCallbackEvent} , $push :{ ConferenceTimeStampArray : timeObj}}
          //     let conferenceId = req.body.ConferenceSid
          //     let authId = ifConferenceExist.AccountSid ? ifConferenceExist.AccountSid : "" ;
          //     let authSecretId = ifConferenceExist.AccountSecretId ? ifConferenceExist.AccountSecretId : "";
          //     const result = await endConference(authId , authSecretId , conferenceId)
          //     console.log("result of end conference : ",result)
          //   }

          //   const myUpdate = dataNeedToUpdate
          //   const myOptions = {upsert : false}
          //   if(ifConferenceEndBeforeParticipantLeaves === 0 ){
          //     const result = await updateRealtimeDetails(myQuery , myUpdate , myOptions)
          //     console.log("result of conference cloud phone after update : ",result)
          //   }
        }

        if (body.StatusCallbackEvent === "conference-end") {
          //@ts-ignore
          timeObj[body.StatusCallbackEvent] = body.Timestamp;
          dataNeedToUpdate = {
            $set: {
              ConferenceSid: body.ConferenceSid,
              ConferenceStatus: body.StatusCallbackEvent,
            },
            $push: { ConferenceTimeStampArray: timeObj },
          };
          let conferenceId = req.body.ConferenceSid;
          let childCallSid = ifConferenceExist.ChildCallId
            ? ifConferenceExist.ChildCallId
            : ifConferenceExist.ChildCallSid;

          let listOfChildCallIfTransfer: any[] = []
          if(ifConferenceExist.ListOfTransferredCalls){
            logger.info('Found transfer call to format.')
            if(ifConferenceExist.ListOfTransferredCalls.length > 0 ){
            listOfChildCallIfTransfer = [...new Set(ifConferenceExist.ListOfTransferredCalls)]
            }
          }

          let formattedDataToGenerateDataLikeIVR = {
            ParentCallSid: ifConferenceExist.ParentCallId
              ? ifConferenceExist.ParentCallId
              : ifConferenceExist.ParentCallSid,
            ChildCallSid: childCallSid,
            listOfChildCallSid:listOfChildCallIfTransfer.length > 0 ? listOfChildCallIfTransfer : [childCallSid],
            Source: ifConferenceExist.Source,
            userID: ifConferenceExist.userID,
            CloudNumber: ifConferenceExist.CloudNumber,
            DirectionFromCloudPhone: ifConferenceExist.CallType,
            Notes: ifConferenceExist.Notes ? ifConferenceExist.Notes : [],
            Tags: ifConferenceExist.Tags ? ifConferenceExist.Tags : [],
          };

          if(ifConferenceExist.Source){
            console.log("Updated Source of parent call : ", ifConferenceExist.Source)
            if(ifConferenceExist.Source === 'Web-Transfer'){
              formattedDataToGenerateDataLikeIVR.ParentCallSid = ifConferenceExist?.ParentCallIdTransferCall
            }
          }

          logger.info(
            "Formatted Data to send in IVR table for formatting : " +
              JSON.stringify(formattedDataToGenerateDataLikeIVR)
          );

          setTimeout(async () => {
            // console.log("inside setTimeout" , ifConferenceExist)
            webSocketController.useConferenceDetailsToConvertData(
              formattedDataToGenerateDataLikeIVR
            );
            // findOneAndDeleteRealtimeDetails({ ConferenceSid: conferenceId });
            console.log("Query : ", conferenceId)
            const response = await findManyAndDeleteRealtimeDetails({$or : [{ ConferenceSid: conferenceId } , {ConferenceSidTransfer : conferenceId }]});
            console.log("Response : ", response)
          }, 10000);
        }

        return res.json({ status: true, message: "success" });
      }
    } else {
      const parentCallId = req.body.ParentCallSid;
      const callStatus = req.body.CallStatus;

      const dateAfterThreeDay = moment().add(2, "d").toDate();
      const tempObj = {
        ...body,
        source: "cloud_phone_outbound",
        expireDate: dateAfterThreeDay,
      };
      createIvrStudiosCdrCallBack(tempObj);

      var io = req.app.get("socketio");

      const queryForParentCall = {
        $or: [{ ParentCallId: parentCallId }, { CallSid: parentCallId }],
      };

      const options = { upsert: false };

      const parentCallResult: any = await getParticularRealtimeCall(
        queryForParentCall
      );
      // logger.info("parentCallResult : ", JSON.stringify(parentCallResult) )

      const queryForChildCall = { ChildCallId: parentCallId };
      const childCallResult: any = await getParticularRealtimeCall(
        queryForChildCall
      );

      if(req.body.CallStatus === "completed"){
        await this.sendCompletedDataToUiInTalkFirst(req.body , io)
      }

      if (parentCallResult) {
        const result = parentCallResult;
        let callEndedByAgent = false;
        logger.info("this is a parent call");
        await this.filterDataAccordingToConferenceAndSendToUi(
          body,
          io,
          "parent",
          result
        );
        query = { ParentCallId: parentCallId };
        //updates = {$set : {StatusCallbackEvent : req.body.StatusCallbackEvent}}
        switch (callStatus) {
          case "initiated":
            let statusTime = req.body.InitiationTime
              ? req.body.InitiationTime
              : "";
            updates = {
              $set: {
                PC_intiated: statusTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
          case "ringing":
            let ringTime = req.body.RingTime ? req.body.RingTime : "";
            let initiateTime = req.body.InitiationTime
              ? req.body.InitiationTime
              : "";
            updates = {
              $set: {
                PC_ringing: ringTime,
                CC_intiated: initiateTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
          case "in-progress":
            // query = {"ChildCallId" : parentCallId}
            let inProgressTime = req.body.AnswerTime ? req.body.AnswerTime : "";
            updates = {
              $set: {
                PC_in_progress: inProgressTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            break;
          case "completed":
            // query = {"ChildCallId" : parentCallId}
            let duration = req.body.CallDuration ? req.body.CallDuration : "0";
            let completedTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                PC_completed: completedTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
                Duration: duration,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            setTimeout(async () => {
              await CloudPhoneRealTimeModel.deleteMany(queryForParentCall);
            }, 10000);

            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
          case "failed":
            // query = {"ChildCallId" : parentCallId}
            let failedTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                CC_failed: failedTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            callEndedByAgent = true;
            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
          case "busy":
            // query = {"ChildCallId" : parentCallId}
            let busyTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                PC_busy: busyTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            callEndedByAgent = true;
            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
          case "no-answer":
            // query = {"ChildCallId" : parentCallId}
            let noAnswerTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                PC_no_answer: noAnswerTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            callEndedByAgent = true;
            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
          case "canceled":
            // query = {"ChildCallId" : parentCallId}
            let canceledTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                PC_canceled: canceledTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            callEndedByAgent = true;
            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
          default:
            // query = {"ChildCallId" : parentCallId}
            let hangupTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: { PC_failed: hangupTime, ChildCallSid: parentCallId },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
        }

        if (callEndedByAgent) {
          const ChildCallSid = result.ChildCallId
            ? result.ChildCallId
            : result.CallSidOfConferenceChildCall;
          let listOfChildCallSid: any = [];
          if (ChildCallSid) {
            listOfChildCallSid = [ChildCallSid];
          }

          const formattedDataToGenerateDataLikeIVR = {
            ParentCallSid: result.ParentCallId
              ? result.ParentCallId
              : result.CallSid,
            ChildCallSid: ChildCallSid,
            listOfChildCallSid: listOfChildCallSid,
            Source: result.Source,
            userID: result.userID,
            CloudNumber: result.CloudNumber,
            DirectionFromCloudPhone: result.CallType,
            Notes: result.Notes ? result.Notes : [],
            Tags: result.Tags ? result.Tags : [],
            ReceiverInOutBound: result.Receiver ? result.Receiver : null,
            FinalCallStatus: result.CallStatus ? result.CallStatus : null,
          };

          logger.info(
            "Formatted Data to send in IVR table for formatting if customer don't pick call : " +
              JSON.stringify(formattedDataToGenerateDataLikeIVR)
          );

          setTimeout(async () => {
            // console.log("inside setTimeout" , ifConferenceExist)
            webSocketController.useConferenceDetailsToConvertData(
              formattedDataToGenerateDataLikeIVR
            );
            findOneAndDeleteRealtimeDetails(queryForParentCall);
          }, 10000);
          // await CloudPhoneRealTimeModel.findOneAndDelete(query)
        }
        return res.status(200).json({ ...body });
      }

      if (childCallResult) {
        const result = childCallResult;
        logger.info("this is a child call");
        await this.filterDataAccordingToConferenceAndSendToUi(
          body,
          io,
          "parent",
          result
        );
        query = { ChildCallId: parentCallId };
        let authId = result.AccountSid ? result.AccountSid : "";
        let authSecretId = result.AccountSecretId ? result.AccountSecretId : "";
        let conferenceId = result.ConferenceSid ? result.ConferenceSid : "";
        //updates = {$set : {StatusCallbackEvent : req.body.StatusCallbackEvent}}
        switch (callStatus) {
          case "initiated":
            let statusTime = req.body.InitiationTime
              ? req.body.InitiationTime
              : "";
            updates = {
              $set: {
                CC_intiated: statusTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            break;
          case "ringing":
            let ringTime = req.body.RingTime ? req.body.RingTime : "";
            let initiateTime = req.body.InitiationTime
              ? req.body.InitiationTime
              : "";
            updates = {
              $set: {
                CC_ringing: ringTime,
                CC_intiated: initiateTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            break;
          case "in-progress":
            query = { ChildCallId: parentCallId };
            let inProgressTime = req.body.AnswerTime ? req.body.AnswerTime : "";
            updates = {
              $set: {
                CC_in_progress: inProgressTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            break;
          case "completed":
            query = { ChildCallId: parentCallId };
            let duration = req.body.CallDuration ? req.body.CallDuration : "0";
            let completedTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                CC_completed: completedTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
                Duration: duration,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            break;
          case "failed":
            query = { ChildCallId: parentCallId };
            let failedTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                CC_failed: failedTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            await endConference(authId, authSecretId, conferenceId);
            break;
          case "busy":
            query = { ChildCallId: parentCallId };
            let busyTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                CC_busy: busyTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            await endConference(authId, authSecretId, conferenceId);
            break;
          case "no-answer":
            query = { ChildCallId: parentCallId };
            let noAnswerTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                CC_no_answer: noAnswerTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            await endConference(authId, authSecretId, conferenceId);
            break;
          case "canceled":
            query = { ChildCallId: parentCallId };
            let canceledTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                CC_canceled: canceledTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            await endConference(authId, authSecretId, conferenceId);
            break;
          default:
            query = { ChildCallId: parentCallId };
            let hangupTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: { CC_failed: hangupTime, ChildCallSid: parentCallId },
            };
            await updateRealtimeDetails(query, updates, options);
            break;
        }
        return res.status(200).json({ ...body });
      }
      return res.json({ status: false, message: "conference sid not found" });
    }

    return res.status(200).json({ ...body });
  }

  public async cloudPhoneConferenceAndCallWebhookForWebRtc(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    logger.info("body of webrtc cloud phone " + JSON.stringify(req.body));
    const body = req.body;
    let query;
    let updates;

    if (req.body.ConferenceSid) {
      createConferenceCallBack({
        ...body,
        ConferenceId: req.body.ConferenceSid,
      });

      const myQuery = {
        AccountSid: body.AccountSid,
        FriendlyName: body.FriendlyName,
      };
      const ifConferenceExist: any = await getParticularRealtimeCall(myQuery);
      logger.info("if Conference Exist " + JSON.stringify(ifConferenceExist));
      if (ifConferenceExist) {
        logger.info("write logic to update the data present in realtime ");
        logger.info("body of webrtc cloud phone " + JSON.stringify(body));
        // logger.info("for conference ",ifConferenceExist)
        //let From = this.checkTheNumberContainsSymbolOrNOT(ifConferenceExist.CloudNumber)
        //let Receiver = ifConferenceExist.Receiver ? this.checkTheNumberContainsSymbolOrNOT(ifConferenceExist.Receiver) : ""

        let dataNeedToUpdate;
        let timeObj = new Object();

        if (body.StatusCallbackEvent === "conference-create") {
          //@ts-ignore
          timeObj[body.StatusCallbackEvent] = body.Timestamp;
          dataNeedToUpdate = {
            $set: {
              ConferenceSid: body.ConferenceSid,
              ConferenceStatus: body.StatusCallbackEvent,
            },
            $push: { ConferenceTimeStampArray: timeObj },
          };
          const myUpdate = dataNeedToUpdate;
          const myOptions = { upsert: false };
          const result = await updateRealtimeDetails(
            myQuery,
            myUpdate,
            myOptions
          );
          console.log(
            "result of conference cloud phone after update : ",
            result
          );
        }

        if (body.StatusCallbackEvent === "participant-leave") {
          //look if parent call (Agent) leave or child call (customer) leave
          logger.info("Calculate the number of members in participants ");
          const noOfParticipants = await getConferenceCallBacks({
            FriendlyName: body.FriendlyName,
            AccountSid: body.AccountSid,
          });

          let ifConferenceEndBeforeParticipantLeaves = 0;

          let noOfParticipantsJoins = 0;
          let noOfParticipantsLeaves = 0;

          if (noOfParticipants.length > 0) {
            for (let i = 0; i < noOfParticipants.length; i++) {
              if (
                noOfParticipants[i].StatusCallbackEvent === "participant-join"
              ) {
                noOfParticipantsJoins = noOfParticipantsJoins + 1;
              }
              if (
                noOfParticipants[i].StatusCallbackEvent === "participant-leave"
              ) {
                noOfParticipantsLeaves = noOfParticipantsLeaves + 1;
              }

              if (noOfParticipants[i].StatusCallbackEvent == "conference-end") {
                ifConferenceEndBeforeParticipantLeaves =
                  ifConferenceEndBeforeParticipantLeaves + 1;
              }
            }
          }

          let noOfParticipantsPresentInConference =
            noOfParticipantsJoins - noOfParticipantsLeaves;

          logger.info("no of participants joins : " + noOfParticipantsJoins);
          logger.info("no of participants leaves : " + noOfParticipantsLeaves);
          logger.info(
            "no of participant present in call : " +
              noOfParticipantsPresentInConference
          );

          if (noOfParticipantsPresentInConference === 1) {
            let conferenceId = req.body.ConferenceSid;
            let authId = ifConferenceExist.AccountSid
              ? ifConferenceExist.AccountSid
              : "";
            let authSecretId = ifConferenceExist.AccountSecretId
              ? ifConferenceExist.AccountSecretId
              : "";

            const endConferencee = endConference(
              authId,
              authSecretId,
              conferenceId
            );
            console.log(
              "result of end conference if participants in call is 1 :",
              endConferencee
            );
          }

          if (body.CallSid === ifConferenceExist.ParentCallId) {
            logger.info("parent call leave");
            //@ts-ignore
            timeObj[body.StatusCallbackEvent] = body.Timestamp;
            dataNeedToUpdate = {
              $set: {
                ConferenceSid: body.ConferenceSid,
                ConferenceStatus: body.StatusCallbackEvent,
              },
              $push: { ConferenceTimeStampArray: timeObj },
            };
            const childCallIdWhichWeNeedToKill = ifConferenceExist.ChildCallId
              ? ifConferenceExist.ChildCallId
              : false;
            if (childCallIdWhichWeNeedToKill) {
              try {
                let authId = ifConferenceExist.AccountSid
                  ? ifConferenceExist.AccountSid
                  : "";
                let authSecretId = ifConferenceExist.AccountSecretId
                  ? ifConferenceExist.AccountSecretId
                  : "";
                killParticularCall(
                  childCallIdWhichWeNeedToKill,
                  authId,
                  authSecretId
                );
              } catch (err) {
                logger.error("Error in killing child call ");
                logger.error(JSON.stringify(err));
              }
            }
          }
          if (body.CallSid === ifConferenceExist.ChildCallId) {
            logger.info("child call leave");
            //@ts-ignore
            timeObj[body.StatusCallbackEvent] = body.Timestamp;
            dataNeedToUpdate = {
              $set: {
                ConferenceSid: body.ConferenceSid,
                ConferenceStatus: body.StatusCallbackEvent,
              },
              $push: { ConferenceTimeStampArray: timeObj },
            };
            let conferenceId = req.body.ConferenceSid;
            let authId = ifConferenceExist.AccountSid
              ? ifConferenceExist.AccountSid
              : "";
            let authSecretId = ifConferenceExist.AccountSecretId
              ? ifConferenceExist.AccountSecretId
              : "";
            const result = await endConference(
              authId,
              authSecretId,
              conferenceId
            );
            console.log("result of end conference : ", result);
          }
          //console.log("data need to update : ", dataNeedToUpdate)
          const myUpdate = dataNeedToUpdate;
          const myOptions = { upsert: false };
          if (ifConferenceEndBeforeParticipantLeaves === 0) {
            const result = await updateRealtimeDetails(
              myQuery,
              myUpdate,
              myOptions
            );
            console.log(
              "result of conference cloud phone after update : ",
              result
            );
          }
        }

        if (body.StatusCallbackEvent === "conference-end") {
          //@ts-ignore
          timeObj[body.StatusCallbackEvent] = body.Timestamp;
          dataNeedToUpdate = {
            $set: {
              ConferenceSid: body.ConferenceSid,
              ConferenceStatus: body.StatusCallbackEvent,
            },
            $push: { ConferenceTimeStampArray: timeObj },
          };
          let conferenceId = req.body.ConferenceSid;
          let childCallSid = ifConferenceExist.ChildCallId
            ? ifConferenceExist.ChildCallId
            : ifConferenceExist.ChildCallSid;

          const formattedDataToGenerateDataLikeIVR = {
            ParentCallSid: ifConferenceExist.ParentCallId
              ? ifConferenceExist.ParentCallId
              : ifConferenceExist.ParentCallSid,
            ChildCallSid: childCallSid,
            listOfChildCallSid: [childCallSid],
            Source: ifConferenceExist.Source,
            userID: ifConferenceExist.userID,
            CloudNumber: ifConferenceExist.CloudNumber,
            DirectionFromCloudPhone: ifConferenceExist.CallType,
            Notes: ifConferenceExist.Notes ? ifConferenceExist.Notes : [],
            Tags: ifConferenceExist.Tags ? ifConferenceExist.Tags : [],
            ReceiverInOutBound: ifConferenceExist.Receiver
              ? ifConferenceExist.Receiver
              : null,
            FinalDirection: "outbound-api",
          };

          logger.info(
            "Formatted Data to send in IVR table for formatting : " +
              JSON.stringify(formattedDataToGenerateDataLikeIVR)
          );

          setTimeout(() => {
            // console.log("inside setTimeout" , ifConferenceExist)
            webSocketController.useConferenceDetailsToConvertData(
              formattedDataToGenerateDataLikeIVR
            );
            findManyAndDeleteRealtimeDetails({$or : [{ ConferenceSid: conferenceId } , {ConferenceSidTransfer : conferenceId }]});
          }, 10000);
        }

        return res.json({ status: true, message: "success" });
      }
      // }else{
      //   const callBacks = new  ConferenceModel({...body , "ConferenceId" : req.body.ConferenceSid})
      //   const result = await callBacks.save()
      //   this.data = result
      //   this.status = true
      //   this.message = 'success'
      //   return res.json(this.Response())
      // }
    } else {
      const parentCallId = req.body.ParentCallSid;
      const callStatus = req.body.CallStatus;

      const dateAfterThreeDay = moment().add(2, "d").toDate();
      const tempObj = {
        ...body,
        source: "cloud_phone_outbound",
        expireDate: dateAfterThreeDay,
      };
      createIvrStudiosCdrCallBack(tempObj);

      var io = req.app.get("socketio");

      const queryForParentCall = {
        $or: [{ ParentCallId: parentCallId }, { CallSid: parentCallId }],
      };

      const options = { upsert: false };

      const parentCallResult: any = await getParticularRealtimeCall(
        queryForParentCall
      );
      // console.log("parentCallResult : ", parentCallResult )

      const queryForChildCall = { ChildCallId: parentCallId };
      const childCallResult: any = await getParticularRealtimeCall(
        queryForChildCall
      );

      if (parentCallResult) {
        const result = parentCallResult;
        let callEndedByAgent = false;
        logger.info("this is a parent call");
        await this.filterDataAccordingToConferenceAndSendToUi(
          body,
          io,
          "parent",
          result
        );
        query = { ParentCallId: parentCallId };
        //updates = {$set : {StatusCallbackEvent : req.body.StatusCallbackEvent}}
        switch (callStatus) {
          case "initiated":
            let statusTime = req.body.InitiationTime
              ? req.body.InitiationTime
              : "";
            updates = {
              $set: {
                PC_intiated: statusTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
          case "ringing":
            let ringTime = req.body.RingTime ? req.body.RingTime : "";
            let initiateTime = req.body.InitiationTime
              ? req.body.InitiationTime
              : "";
            updates = {
              $set: {
                PC_ringing: ringTime,
                CC_intiated: initiateTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
          case "in-progress":
            // query = {"ChildCallId" : parentCallId}
            let inProgressTime = req.body.AnswerTime ? req.body.AnswerTime : "";
            updates = {
              $set: {
                PC_in_progress: inProgressTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            break;
          case "completed":
            // query = {"ChildCallId" : parentCallId}
            let duration = req.body.CallDuration ? req.body.CallDuration : "0";
            let completedTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                PC_completed: completedTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
                Duration: duration,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            setTimeout(async () => {
              await CloudPhoneRealTimeModel.deleteMany(queryForParentCall);
            }, 10000);

            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
          case "failed":
            // query = {"ChildCallId" : parentCallId}
            let failedTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                CC_failed: failedTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            callEndedByAgent = true;
            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
          case "busy":
            // query = {"ChildCallId" : parentCallId}
            let busyTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                PC_busy: busyTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            callEndedByAgent = true;
            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
          case "no-answer":
            // query = {"ChildCallId" : parentCallId}
            let noAnswerTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                PC_no_answer: noAnswerTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            callEndedByAgent = true;
            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
          case "canceled":
            // query = {"ChildCallId" : parentCallId}
            let canceledTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                PC_canceled: canceledTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            callEndedByAgent = true;
            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
          default:
            // query = {"ChildCallId" : parentCallId}
            let hangupTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: { PC_failed: hangupTime, ChildCallSid: parentCallId },
            };
            await updateRealtimeDetails(queryForParentCall, updates, options);
            //await CloudPhoneModel.findOneAndUpdate(query , updates)
            break;
        }

        if (callEndedByAgent) {
          const ChildCallSid = result.ChildCallId
            ? result.ChildCallId
            : result.CallSidOfConferenceChildCall;
          let listOfChildCallSid: any = [];
          if (ChildCallSid) {
            listOfChildCallSid = [ChildCallSid];
          }

          const formattedDataToGenerateDataLikeIVR = {
            ParentCallSid: result.ParentCallId
              ? result.ParentCallId
              : result.CallSid,
            ChildCallSid: ChildCallSid,
            listOfChildCallSid: listOfChildCallSid,
            Source: result.Source,
            userID: result.userID,
            CloudNumber: result.CloudNumber,
            DirectionFromCloudPhone: result.CallType,
            Notes: result.Notes ? result.Notes : [],
            Tags: result.Tags ? result.Tags : [],
            ReceiverInOutBound: result.Receiver ? result.Receiver : null,
            FinalCallStatus: result.CallStatus ? result.CallStatus : null,
          };

          logger.info(
            "Formatted Data to send in IVR table for formatting if customer don't pick call : " +
              JSON.stringify(formattedDataToGenerateDataLikeIVR)
          );

          setTimeout(async () => {
            // console.log("inside setTimeout" , ifConferenceExist)
            webSocketController.useConferenceDetailsToConvertData(
              formattedDataToGenerateDataLikeIVR
            );
            findOneAndDeleteRealtimeDetails(queryForParentCall);
          }, 10000);
          // await CloudPhoneRealTimeModel.findOneAndDelete(query)
        }
        return res.status(200).json({ ...body });
      }

      if (childCallResult) {
        const result = childCallResult;
        logger.info("this is a child call");
        await this.filterDataAccordingToConferenceAndSendToUi(
          body,
          io,
          "parent",
          result
        );
        query = { ChildCallId: parentCallId };
        let authId = result.AccountSid ? result.AccountSid : "";
        let authSecretId = result.AccountSecretId ? result.AccountSecretId : "";
        let conferenceId = result.ConferenceSid ? result.ConferenceSid : "";
        //updates = {$set : {StatusCallbackEvent : req.body.StatusCallbackEvent}}
        switch (callStatus) {
          case "initiated":
            let statusTime = req.body.InitiationTime
              ? req.body.InitiationTime
              : "";
            updates = {
              $set: {
                CC_intiated: statusTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            break;
          case "ringing":
            let ringTime = req.body.RingTime ? req.body.RingTime : "";
            let initiateTime = req.body.InitiationTime
              ? req.body.InitiationTime
              : "";
            updates = {
              $set: {
                CC_ringing: ringTime,
                CC_intiated: initiateTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            break;
          case "in-progress":
            query = { ChildCallId: parentCallId };
            let inProgressTime = req.body.AnswerTime ? req.body.AnswerTime : "";
            updates = {
              $set: {
                CC_in_progress: inProgressTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            break;
          case "completed":
            query = { ChildCallId: parentCallId };
            let duration = req.body.CallDuration ? req.body.CallDuration : "0";
            let completedTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                CC_completed: completedTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
                Duration: duration,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            break;
          case "failed":
            query = { ChildCallId: parentCallId };
            let failedTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                CC_failed: failedTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            await endConference(authId, authSecretId, conferenceId);
            break;
          case "busy":
            query = { ChildCallId: parentCallId };
            let busyTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                CC_busy: busyTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            await endConference(authId, authSecretId, conferenceId);
            break;
          case "no-answer":
            query = { ChildCallId: parentCallId };
            let noAnswerTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                CC_no_answer: noAnswerTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            await endConference(authId, authSecretId, conferenceId);
            break;
          case "canceled":
            query = { ChildCallId: parentCallId };
            let canceledTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: {
                CC_canceled: canceledTime,
                CallStatus: callStatus,
                ChildCallSid: parentCallId,
              },
            };
            await updateRealtimeDetails(query, updates, options);

            await endConference(authId, authSecretId, conferenceId);
            break;
          default:
            query = { ChildCallId: parentCallId };
            let hangupTime = req.body.HangupTime ? req.body.HangupTime : "";
            updates = {
              $set: { CC_failed: hangupTime, ChildCallSid: parentCallId },
            };
            await updateRealtimeDetails(query, updates, options);
            break;
        }
        return res.status(200).json({ ...body });
      }
      return res.json({ status: false, message: "conference sid not found" });
    }

    return res.status(200).json({ ...body });
  }

  handleTransferCallback = async (callback: any, io: any) => {
    const agentNumber = callback.Called;
    io.of("/dropcodes").on("join", (room: any) => {
      io.join(room);
      io.of("/dropcodes").to(room).emit("transferCallData", callback);
    });
    io.of("/dropcodes").on("join_transferred_from", (room: any) => {
      io.join(room);
      io.of("/dropcodes").to(room).emit("transferredCallStatus", callback);
    });

    io.of("/dropcodes").to(agentNumber).emit("transferCallData", callback);
    io.of("/dropcodes").to(agentNumber).emit("transferredCallStatus", callback);

  };

  handleHangupTransferCall = async ( data : any )=>{
    const callSidOfAgent = data.callId

    const link = `${conf.BaseUrl}/api/cp/hangup/transfer`;
    const options = {
      'method': 'POST',
      'url': link,
      'headers': {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "callId": callSidOfAgent
      })
    };
    logger.info("option in delete transfer call : " + JSON.stringify(options))

    return new Promise((resolve: any, reject: any) => {
      httpClient(options, (error, response, body) => {
        if (error) {
          logger.error("error in kill transfer call : " + error);
          reject(error);
        }
        logger.info("kill transfer call response : " + body);
        resolve(body);
      });
    });
  }

  deleteTransferredCallLogsFromRealtime = async ( data : any ) =>{

      const queryToDelete = { ChildCallId : data.ParentCallSid , Source : 'Web-Transfer'}
      await findOneAndDeleteRealtimeDetails(queryToDelete)

  }

  updateTransferredCallInConferenceForInbound = async ( currentCallDetails : any , transferCallBack : any) =>{
    //collect conference id of ongoing call
    const ConferenceSid = currentCallDetails.ConferenceSid
    const queryToUpdateInboundConf = { ConferenceSid : ConferenceSid }
    const updates = { $push : { listOfChildCallSid : transferCallBack.ParentCallSid }}
    const options = { upsert : false }
    try{
    //update it to list of child call in conference 
    logger.info('Adding trnasferred call details to conference model for inbound ' + JSON.stringify(queryToUpdateInboundConf))
    //update the callsid and receiver number in transferred call logs to get proper data in UI for available agents.
    const queryToUpdateMainCall = {_id : currentCallDetails._id}
    const ongoingCallDetailsNeedToUpdateInPrevious = { $set : {CallSidOfConferenceChildCall : transferCallBack.ParentCallSid , Receiver : transferCallBack.To} }
    await updateRealtimeDetails(  queryToUpdateMainCall , ongoingCallDetailsNeedToUpdateInPrevious , options )
    await findOneAndUpdateConference( queryToUpdateInboundConf , updates , options )    
    //rest conference callback take care.
    this.deleteTransferredCallLogsFromRealtime(transferCallBack)
    }catch(err : any){
      logger.err('error in updating data while transferring inbound call : ' + JSON.stringify(err))
    }
  }

  findPreviousCallFromCurrentCallDetails = async ( data : any ) =>{
        //find current call
        const parentCallId = data.ParentCallSid
        const queryToGetCurrentCallDetails =  { ChildCallId : parentCallId , sort : "_id"}
        const currentTransferData : any = await getParticularRealtimeCall(queryToGetCurrentCallDetails)
        if(currentTransferData){
          //find trnasferrer call detail
          const currentConferencData = {FriendlyName : currentTransferData.FriendlyName , sort : "_id"}
          const parentCallWhoInitiateTransfer : any  = await getParticularRealtimeCall(currentConferencData)
          // console.log("Parent call who initiate call : ", parentCallWhoInitiateTransfer)
          if(parentCallWhoInitiateTransfer){
            //Check inbound or outbound call it is 
            if(parentCallWhoInitiateTransfer.Direction){
              if(parentCallWhoInitiateTransfer.Direction.toLowerCase() === 'inbound'){
              //  console.log("This is an inbound call.")
               await this.updateTransferredCallInConferenceForInbound(parentCallWhoInitiateTransfer , data)
              }
              if(parentCallWhoInitiateTransfer.Direction.toLowerCase() === 'outbound'){
               this.updateTransferredCallWithDisconnectedCall(parentCallWhoInitiateTransfer , data)           
              }
            }    
          }
        }
  }

  disconnectTransferrerCall = async ( data : any ) =>{
    //find current call
    let parentCallIdWhomWeNeedToKillCall
    let callIdOfCustomerWhomWeNeedToUnhold 
    const parentCallId = data.ParentCallSid
    const queryToGetCurrentCallDetails =  { ChildCallId : parentCallId , sort : "_id"}
    const currentTransferData : any = await getParticularRealtimeCall(queryToGetCurrentCallDetails)
    if(currentTransferData){
      //Check if the transferred call is transfernow or talkfirst
      if(currentTransferData.TransferType){
        if(currentTransferData.TransferType === 'transfernow'){
          //find trnasferrer call detail
          const currentConferencData = {FriendlyName : currentTransferData.FriendlyName , sort : "_id"}
          const parentCallWhoInitiateTransfer : any  = await getParticularRealtimeCall(currentConferencData)
          logger.info(`Parent call who initiate transfer : ${JSON.stringify(parentCallWhoInitiateTransfer)}`)
          if(parentCallWhoInitiateTransfer){

            //Check inbound or outbound call it is 
            if(parentCallWhoInitiateTransfer.Direction){
              if(parentCallWhoInitiateTransfer.Direction.toLowerCase() === 'inbound'){
              parentCallIdWhomWeNeedToKillCall = parentCallWhoInitiateTransfer?.CallSidOfConferenceChildCall
              callIdOfCustomerWhomWeNeedToUnhold = parentCallWhoInitiateTransfer?.ParentCallSid
              }
              if(parentCallWhoInitiateTransfer.Direction.toLowerCase() === 'outbound'){
              if(parentCallWhoInitiateTransfer.Source.toLowerCase() === 'web-transfer'){
                parentCallIdWhomWeNeedToKillCall = parentCallWhoInitiateTransfer.ChildCallId ? parentCallWhoInitiateTransfer.ChildCallId : parentCallWhoInitiateTransfer.ParentCallIdTransferCall
                logger.info('call which need to disconnect web-transfer : ' + parentCallIdWhomWeNeedToKillCall )
              }else{
                parentCallIdWhomWeNeedToKillCall = parentCallWhoInitiateTransfer.ParentCallIdTransferCall ? parentCallWhoInitiateTransfer.ParentCallIdTransferCall : parentCallWhoInitiateTransfer.ParentCallId
                logger.info('call which need to disconnect web : ' + parentCallIdWhomWeNeedToKillCall )

              }
              callIdOfCustomerWhomWeNeedToUnhold = parentCallWhoInitiateTransfer.CustomerCallId ? parentCallWhoInitiateTransfer.CustomerCallId : parentCallWhoInitiateTransfer.ChildCallId        
              }
            }
            //collect parentcall-id 
            // parentCallIdWhomWeNeedToKillCall = parentCallWhoInitiateTransfer?.ParentCallId

            const authId = parentCallWhoInitiateTransfer?.AccountSid
            const queryToFetchVibCred = {authId : authId}
            const vibconnectCred : any = await getVibconnect(queryToFetchVibCred)
            if(vibconnectCred){
              const authSecret = vibconnectCred[0].authSecret
              //unhold customer whom we keep in hold while trnasfering.
              const holdMusic =  "https://raw.githubusercontent.com/Danish-Asghar2909/mp3.xml/main/hold.xml"
              const payloadToUnholdCustomer = {
                "friendly_name": parentCallWhoInitiateTransfer?.FriendlyName,
                "hold": false,
                "hold_method": "GET",
                "hold_url": holdMusic,
                "conferenceId" : parentCallWhoInitiateTransfer?.ConferenceSid,
                "callId": callIdOfCustomerWhomWeNeedToUnhold
              }
              logger.info('Unhold call '+ callIdOfCustomerWhomWeNeedToUnhold)
              await handleHold(authId,authSecret,payloadToUnholdCustomer)
              //send kill call request to vibconnect to hangup
              const responseOfKillCall = await killParticularCall( parentCallIdWhomWeNeedToKillCall , authId , authSecret)
              logger.info(`Transferrer Call Hanged up : ${responseOfKillCall}`)
            

          }
          } 
        }
      }
    }
  }

  addTransferTypeInCallBack = async ( data : CallData )=>{
    //find transfer type from current call
    const queryToGetCurrentCall = {ChildCallId : data.ParentCallSid}
    const currentCallDetails : any = await getParticularRealtimeCall(queryToGetCurrentCall)
    console.log("currentCallDetails : ", currentCallDetails)
    if(currentCallDetails){
      //this is for outbound transfer 
      let TransferTypeObj : any = {}
      if(currentCallDetails.TransferType){
        //update the type in call back so we can filter and add type while we create final logs
        TransferTypeObj = { TransferType : currentCallDetails.TransferType }
      }
      const dateAfterThreeDay = moment().add(2, "d").toDate();
      const tempObj = {
        ...data,
        ...TransferTypeObj,
        source: "cloud_phone_outbound_transfer",
        expireDate: dateAfterThreeDay,
      };
  
      await createIvrStudiosCdrCallBack(tempObj);
    }else{
      //this is for inbound transfer
      //collect main call parent call sid from conference model
      const queryToGetParentCallId = {  listOfChildCallSid : {$in: [data.ParentCallSid ]} , fields:"ParentCallSid" } 
      const conferenceData : any = await getOneConference(queryToGetParentCallId)
      console.log("Conference Data : ", conferenceData)
      //get transfer type from realtime 
      if(conferenceData){
        const queryToGetCurrentCall = {ParentCallSid : conferenceData.ParentCallSid}
        const currentCallDetails : any = await getParticularRealtimeCall(queryToGetCurrentCall)
        console.log("currentCallDetails : ", currentCallDetails)
        let TransferTypeObj : any = {}
        if(currentCallDetails){
          if(currentCallDetails.TransferType){
            //update the type in call back so we can filter and add type while we create final logs
            TransferTypeObj = { TransferType : currentCallDetails.TransferType }
          }
        }

        const dateAfterThreeDay = moment().add(2, "d").toDate();
        const tempObj = {
          ...data,
          ...TransferTypeObj,
          source: "cloud_phone_outbound_transfer",
          expireDate: dateAfterThreeDay,
        };
    
        await createIvrStudiosCdrCallBack(tempObj);
        //create a log

      }

    }
  }

  public async cloudPhoneTransferWebhook(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    logger.info("Body of trnasfer call : " + JSON.stringify(req.body));
    var io = req.app.get("socketio");
    this.handleTransferCallback(req.body, io);

    const parentCallId = req.body.ParentCallSid;
    const callStatus = req.body.CallStatus;
    // const dateAfterThreeDay = moment().add(2, "d").toDate();
    // const tempObj = {
    //   ...req.body,
    //   source: "cloud_phone_outbound_transfer",
    //   expireDate: dateAfterThreeDay,
    // };
    // await createIvrStudiosCdrCallBack(tempObj);
    this.addTransferTypeInCallBack( req.body )
    let query = { ChildCallId: parentCallId };
    let updates;
    const options = { upsert: false };
    // let queryToHangupTransferCall = { callId : parentCallId}
    try{

      switch (callStatus) {
        case "initiated":
          let statusTime = req.body.InitiationTime ? req.body.InitiationTime : "";
          updates = {
            $set: {
              CC_intiated: statusTime,
              CallStatus: callStatus,
              ChildCallSid: parentCallId,
            },
          };
          await updateRealtimeDetails(query, updates, options);
          
          break;
        case "ringing":
          let ringTime = req.body.RingTime ? req.body.RingTime : "";
          let initiateTime = req.body.InitiationTime
            ? req.body.InitiationTime
            : "";
          updates = {
            $set: {
              CC_ringing: ringTime,
              CC_intiated: initiateTime,
              CallStatus: callStatus,
              ChildCallSid: parentCallId,
            },
          };
          await updateRealtimeDetails(query, updates, options);
  
          break;
        case "in-progress":
          query = { ChildCallId: parentCallId };
          let inProgressTime = req.body.AnswerTime ? req.body.AnswerTime : "";
          updates = {
            $set: {
              CC_in_progress: inProgressTime,
              CallStatus: callStatus,
              ChildCallSid: parentCallId,
            },
          };
          //send a completed event to socket so UI can show hangup screen
          await this.sendFakeCompletedToUIOnly( req.body , io)
          await updateRealtimeDetails(query, updates, options);
          await this.disconnectTransferrerCall(req.body)
          await this.findPreviousCallFromCurrentCallDetails(req.body)
          break;
        case "completed":
          query = { ChildCallId: parentCallId };
          let duration = req.body.CallDuration ? req.body.CallDuration : "0";
          let completedTime = req.body.HangupTime ? req.body.HangupTime : "";
          updates = {
            $set: {
              CC_completed: completedTime,
              CallStatus: callStatus,
              ChildCallSid: parentCallId,
              Duration: duration,
            },
          };
          await updateRealtimeDetails(query, updates, options);
          // this.handleHangupTransferCall(queryToHangupTransferCall)//this code generate a seperate log of transfer call.
          break;
        case "failed":
          query = { ChildCallId: parentCallId };
          let failedTime = req.body.HangupTime ? req.body.HangupTime : "";
          updates = {
            $set: {
              CC_failed: failedTime,
              CallStatus: callStatus,
              ChildCallSid: parentCallId,
            },
          };
          await updateRealtimeDetails(query, updates, options);
          // this.handleHangupTransferCall(queryToHangupTransferCall)//this code generate a seperate log of transfer call.
          await this.findPreviousCallFromCurrentCallDetails(req.body)
          break;
        case "busy":
          query = { ChildCallId: parentCallId };
          let busyTime = req.body.HangupTime ? req.body.HangupTime : "";
          updates = {
            $set: {
              CC_busy: busyTime,
              CallStatus: callStatus,
              ChildCallSid: parentCallId,
            },
          };
          await updateRealtimeDetails(query, updates, options);
          // this.handleHangupTransferCall(queryToHangupTransferCall)//this code generate a seperate log of transfer call.
          await this.findPreviousCallFromCurrentCallDetails(req.body)
          break;
        case "no-answer":
          query = { ChildCallId: parentCallId };
          let noAnswerTime = req.body.HangupTime ? req.body.HangupTime : "";
          updates = {
            $set: {
              CC_no_answer: noAnswerTime,
              CallStatus: callStatus,
              ChildCallSid: parentCallId,
            },
          };
          await updateRealtimeDetails(query, updates, options);
          // this.handleHangupTransferCall(queryToHangupTransferCall)//this code generate a seperate log of transfer call.
          await this.findPreviousCallFromCurrentCallDetails(req.body)
          break;
        case "canceled":
          query = { ChildCallId: parentCallId };
          let canceledTime = req.body.HangupTime ? req.body.HangupTime : "";
          updates = {
            $set: {
              CC_canceled: canceledTime,
              CallStatus: callStatus,
              ChildCallSid: parentCallId,
            },
          };
          await updateRealtimeDetails(query, updates, options);
          // this.handleHangupTransferCall(queryToHangupTransferCall)//this code generate a seperate log of transfer call.
          await this.findPreviousCallFromCurrentCallDetails(req.body)
          break;
        default:
          query = { ChildCallId: parentCallId };
          let hangupTime = req.body.HangupTime ? req.body.HangupTime : "";
          updates = {
            $set: { CC_failed: hangupTime, ChildCallSid: parentCallId },
          };
          await updateRealtimeDetails(query, updates, options);
          break;
      }
  
      this.data = req.body;
      this.code = 200;
      this.status = true;
      this.message = "Event Received!";
      return res.status(200).json(this.Response());

    }catch(err){

      this.data = [];
      this.code = 404;
      this.status = false;
      this.message = "Something went wrong!";
      return res.status(200).json(this.Response());

    }
  }
}
