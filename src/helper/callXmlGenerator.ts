import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import * as conf from "../config/index";
import logger from "../config/logger";
import UserPermissionUserModel from "../models/UserPermissionUserModel";
import Vibconnect from "../services/Vibconnect/index";
import ConferenceModel from "../models/ConferenceModel";
import IvrStudiosRealTime from "../models/IvrStudiousRealTime";
import ivrFlowUIModel from "../models/ivrFlowUIModel";
import IvrStudiosStatusModel from "../models/ivrStudiosModelCallBacks";
import smsModel from "../models/smsModel";
const { contactModel } = require("../models/ContactsModel");
interface playNodeDetail {
  loop: number;
  playAudioPause: number;
  audioUrl: string;
  playAudioUrl?: string;
}

interface stickyAgentNodeDataType {
  authSecret: string;
  authId: string;
  callingPattern: string;
  SendDigits? : string;
}

interface connectorType {
  style: {
    stroke: string;
  };
  source: string;
  sourceHandle: string;
  target: string;
  animated: boolean;
  type: string;
  id: string;
}
interface ivrNodeDetail {
  loop: number;
  ivrAudioUrl: string;
  ivrPlayAudioPause: string;
  inputLength: string;
}

interface multiPartyCallNodeDataInputs {
  mpcCallDistribustion: string;
  mpcAudio: string;
  mpcCallUsingNumbers: {
    countryCode?: string;
    number?: string;
    ringTimeOut?: string;
    priority?: string;
    userName?: string;
    userId?: string;
  }[];
  mpcCallUsing: string;
  mpcAudioLoop: string;
  mpcAudioPause: string;
  authId: string;
  authSecret: string;
  url?: string;
  dialingPattern?: string;
  SendDigits? : string;
}
export interface dataFromVibconnectForIncoming {
  AccountSid: string;
  ApiVersion: string;
  CallSid: string;
  CallStatus: string;
  CallbackSource: string;
  Called: string;
  Caller: string;
  Direction: string;
  From: string;
  InitiationTime?: string;
  ParentCallSid: string;
  SequenceNumber?: string;
  Timestamp: string;
  To: string;
}

interface messageNodeDataInputs {
  messageCountryCode: string;
  senderId: string;
  smsTo: string;
  carrierType: string;
  peId?: string;
  templateId?: string;
  messageBody: string;
  toNumbers?: { number: string }[];
  AuthId: string;
  AuthSecret: string;
  sendSmsName: string;
}

export function generateXmlForPlayNode(
  id: string,
  source: string,
  target: string,
  data: playNodeDetail
) {
  const voice: VoiceResponse | any = new VoiceResponse();
  try {
    voice.play({ loop: data.loop, digits: "wwwww3" }, data.audioUrl);
    voice.pause({ length: data.playAudioPause });
    voice.redirect(
      { method: "GET" },
      `${conf.BaseUrl}/api/v2/ivrstudios/convert/${id}/${target}/${source}`
    );

    let xml = voice.toString();
    logger.info(xml);
    return xml;
  } catch (err: any) {
    voice.say(err.message);
    const xml = voice.toString();
    logger.error(xml);
    return xml;
  }
}

export function generateXmlForIvrNode(
  id: string,
  source: string,
  target: string,
  data: ivrNodeDetail
) {
  const voice: VoiceResponse | any = new VoiceResponse();
  try {
    const numDigits = data.inputLength ? data.inputLength : "1";
    let Parent: any;
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
    logger.info(xml);
    return xml;
  } catch (err: any) {
    voice.say(err.message);
    let xml = voice.toString();
    logger.error(xml);
    return xml;
  }
}

function checkTheNumberContainsSymbolOrNOT(number: string) {
  number = decodeURIComponent(number);
  if (number.includes("+")) {
    return number.replace(/[^0-9]/g, "");
  }
  return number;
}

function correctFormatOfCloudNumberAccordingToState(cloudNumber: string) {
  cloudNumber = cloudNumber.slice(-12);
  if (cloudNumber.includes("223531")) {
    return `+${cloudNumber}`;
  } else if (cloudNumber.includes("336811")) {
    return `${cloudNumber}`;
  } else if (cloudNumber.includes("806937")) {
    return `+${cloudNumber}`;
  } else {
    return cloudNumber;
  }
}

async function extractAllNumberOfCorrespondingUser(
  detailsOfNumbersFromUI: multiPartyCallNodeDataInputs["mpcCallUsingNumbers"]
) {
  let x: any = Promise.all(
    detailsOfNumbersFromUI.map(async (val: any) => {
      const detailsOfUser: any = await UserPermissionUserModel.findOne({
        _id: val.userId,
      });
      let tempObj = {
        number: detailsOfUser.phone,
        ringTimeOut: val.ringTimeOut,
      };
      return await tempObj;
    })
  );
  //  console.log("numbers of users : " , await x);
  return await x;
}

async function extractAllSipOfCorrespondingUser(
  detailsOfNumbersFromUI: multiPartyCallNodeDataInputs["mpcCallUsingNumbers"]
) {
  console.log(
    "this is the details of call extract numbers using this : ",
    detailsOfNumbersFromUI
  );
  let x: any = Promise.all(
    detailsOfNumbersFromUI.map(async (val: any) => {
      const detailsOfUser: any = await UserPermissionUserModel.findOne({
        _id: val.userId,
      });
      let tempObj = {
        number: detailsOfUser.sip_user,
        ringTimeOut: val.ringTimeOut,
      };
      return await tempObj;
    })
  );
  //  console.log("numbers of users : " , await x);
  return await x;
}

async function updateRealTimeDataOfIvrStudiousForApiCall(
  query: any,
  updates: any
) {
  try {
    await IvrStudiosRealTime.findOneAndUpdate(query, updates);
  } catch (err) {
    logger.error(err);
  }
}

async function handleMultiPartyCallDistributionOfTypePriority(
  id: string,
  source: string,
  target: string,
  data: multiPartyCallNodeDataInputs,
  dataFromVibconnect: dataFromVibconnectForIncoming
) {
  const voice: VoiceResponse | any = new VoiceResponse();

  if (!data.authId || !data.authSecret) {

    logger.error("No Auth ID or Auth Secret is present : " + JSON.stringify(dataFromVibconnect));
    voice.hangup();
    let xml = voice.toString();
    return xml;
  }

  let Parent;
  Parent = voice.dial({
    action: `${conf.BaseUrl}/api/v2/ivrstudios/convert/${id}/conference|Room_${dataFromVibconnect.ParentCallSid}/${target}`,
    method: "GET",
  });
  Parent.conference(
    {
      waitUrl: data.mpcAudio,
      statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
      statusCallbackEvent: "start end join leave mute hold",
    },
    `Room_${dataFromVibconnect.ParentCallSid}`
  );
  let timeOut: string | any = "60";
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
      const numbersFromUerID = await extractAllNumberOfCorrespondingUser(
        data.mpcCallUsingNumbers
      );
      console.log("List of numbers from user : ", numbersFromUerID);
      correctNumberArray = numbersFromUerID;
    } else if (dialingPattern === "sip") {
      console.log("Dialing Pattern is Sip fetch sip user");
      const numbersFromUerID = await extractAllSipOfCorrespondingUser(
        data.mpcCallUsingNumbers
      );
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

  if(data.SendDigits){
    url = `SendDigits|${data.SendDigits}`
  }

  // we will write condition based on realtime checking in DB thats why extra decleration is here
  const nextNumberIfbusy = correctNumberArray[0]
    ? correctNumberArray[0].number
    : "";
  To = nextNumberIfbusy;
  const sendDigitsObj =  data.SendDigits ? { "SendDigits" : data.SendDigits} : {}
  const body = {
    statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call`, // it also save data to ivrStudios dataBase but only for API-Call
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

  const vibconnect = new Vibconnect();
  const call_details: any = await vibconnect.makeCall(
    data.authId ? data.authId : dataFromVibconnect.AccountSid,
    data.authSecret,
    body
  );
  if(call_details.length === 0){
    voice.hangup();
    let xml = voice.toString();
    return xml;
  }
  console.log("call details from vibconnect : ",  typeof call_details, call_details)
  logger.info("call details from vibconnect : ",  typeof call_details, call_details);
  const call_details_json = JSON.parse(call_details);
  const data_required_to_filter_conference_details = {
    AccountSid: dataFromVibconnect.AccountSid,
    ParentCallSid: dataFromVibconnect.ParentCallSid,
    ConferenceId: "",
    CallSid: call_details_json.sid,
    FriendlyName: `Room_${dataFromVibconnect.ParentCallSid}`,
    ChildCallSid: call_details_json.sid,
    source: target, // current MPC node ID
    id: id,
    listOfChildCallSid: [call_details_json.sid],
    whispherUrl: url,
  };

  const conference = new ConferenceModel(
    data_required_to_filter_conference_details
  );
  await conference.save();
  let queryToSend = { ParentCallSid: dataFromVibconnect.ParentCallSid };
  let updateToSend = {
    $set: { CallSidOfConferenceChildCall: call_details_json.sid },
  };
  updateRealTimeDataOfIvrStudiousForApiCall(queryToSend, updateToSend);
  let xml = voice.toString();
  logger.info("xml is : " + xml);
  return xml;
}

async function handleMultiPartyCallDistributionProcess(
  id: string,
  source: string,
  target: string,
  targetNode: multiPartyCallNodeDataInputs,
  dataFromVibconnect: dataFromVibconnectForIncoming
) {
  const voice: VoiceResponse | any = new VoiceResponse();
  logger.info(
    `call type is parallel : ${targetNode} :::: details receive from vibconnect : ${dataFromVibconnect}`
  );
  try {
    //send customer in conference
    let Parent: any;
    Parent = voice.dial({
      action: `${conf.BaseUrl}/api/v2/ivrstudios/convert/${id}/conference|Room_${dataFromVibconnect.ParentCallSid}/${source}`,
      method: "GET",
    });
    Parent.conference(
      {
        waitUrl: targetNode.mpcAudio,
        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
        statusCallbackEvent: "start end join leave mute hold",
      },
      `Room_${dataFromVibconnect.ParentCallSid}`
    );

    //send Api request of call to every agent
    let purchasedNumber: any = dataFromVibconnect.To;
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

    let callSidOfAgents: any = [];

    if (targetNode.mpcCallUsing === "User") {
      let detailsOfNumbersFromUI = targetNode.mpcCallUsingNumbers;
      const numbersFromUerID = await extractAllNumberOfCorrespondingUser(
        detailsOfNumbersFromUI
      );
      logger.info(
        `list of number if customer select call using User : ${numbersFromUerID}`
      );
      const sendDigitsObj =  targetNode.SendDigits ? { "SendDigits" : targetNode.SendDigits} : {}
      await Promise.all(
        numbersFromUerID.map(async (number: any) => {
          const body: any = {
            statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call/parallel`, // it also save data to ivrStudios dataBase but only for API-Call
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

          console.log(
            "node credentials : ",
            targetNode.authId,
            " : ",
            targetNode.authSecret
          );
          const vibconnect = new Vibconnect();
          const call_details: any = await vibconnect.makeCall(
            targetNode.authId,
            targetNode.authSecret,
            body
          );
          const callDetailsJson = JSON.parse(call_details);
          callSidOfAgents = [...callSidOfAgents, callDetailsJson.sid];
        })
      );
    }
    const sendDigitsObj =  targetNode.SendDigits ? { "SendDigits" : targetNode.SendDigits} : {}
    if (targetNode.mpcCallUsing === "Number") {
      await Promise.all(
        targetNode.mpcCallUsingNumbers.map(async (number: any) => {
          const body: any = {
            statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call/parallel`, // it also save data to ivrStudios dataBase but only for API-Call
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

          console.log(
            "node credentials : ",
            targetNode.authId,
            " : ",
            targetNode.authSecret
          );
          const vibconnect = new Vibconnect();
          const call_details: any = await vibconnect.makeCall(
            targetNode.authId,
            targetNode.authSecret,
            body
          );
          const callDetailsJson = JSON.parse(call_details);
          callSidOfAgents = [...callSidOfAgents, callDetailsJson.sid];
        })
      );
    }

    const data_required_to_filter_conference_details: any = {
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
    console.log(
      "data_required_to_filter_conference_details 5142 : ",
      data_required_to_filter_conference_details
    );
    const conference = new ConferenceModel(
      data_required_to_filter_conference_details
    );
    await conference.save();

    console.log("callSidOfAgents : ", callSidOfAgents);
    let xml = voice.toString();
    return xml;
  } catch (error: any) {
    voice.say(error.message);
    let xml = voice.toString();
    return xml;
  }
}

async function handleMultiPartyCallDistributionOfTypeRoundRobin(
  id: string,
  source: string,
  target: string,
  targetNode: multiPartyCallNodeDataInputs,
  dataFromVibconnect: dataFromVibconnectForIncoming
) {
  const voice: VoiceResponse | any = new VoiceResponse();

  try {
    let numbersArray;
    let lastCalledNumber: any;
    let To = targetNode.mpcCallUsingNumbers[0].number;
    let From = dataFromVibconnect.To;
    let timeOut: string | any = "60";
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
      const numbersFromUerID = await extractAllNumberOfCorrespondingUser(
        detailsOfNumbersFromUI
      );

      numbersArray = numbersFromUerID;
    }

    if (targetNode.mpcCallUsing === "Number") {
      numbersArray = targetNode.mpcCallUsingNumbers;
    }

    const flowDetails: any = await ivrFlowUIModel.findOne({ _id: id });
    lastCalledNumber = flowDetails.lastCalledNumber;
    console.log("lastCalledNumber : ", lastCalledNumber);
    if (lastCalledNumber) {
      const lastCalledNumberIndex = numbersArray.findIndex(
        (x: any) => x.number === lastCalledNumber
      );
      if (lastCalledNumberIndex !== -1) {
        numbersArray.splice(lastCalledNumberIndex, 1);
      }
    }

    //by commenting this we stop checking number in realtime_db if agent available or not
    // const nextNumberIfbusy = await this.loopOverNumberToGetAvailableNumberOfAgent(correctNumberArray)
    const nextNumberIfbusy = numbersArray[0] ? numbersArray[0].number : "";
    console.log("next number if busy : ", nextNumberIfbusy);

    To = nextNumberIfbusy;
    const sendDigitsObj =  targetNode.SendDigits ? { "SendDigits" : targetNode.SendDigits} : {}
    const body: any = {
      statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call`, // it also save data to ivrStudios dataBase but only for API-Call
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

    const vibconnect = new Vibconnect();
    const call_details: any = await vibconnect.makeCall(
      targetNode.authId,
      targetNode.authSecret,
      body
    );
    const call_details_json = JSON.parse(call_details);
    const data_required_to_filter_conference_details: any = {
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
    console.log(
      "data_required_to_filter_conference_details 3709 : ",
      data_required_to_filter_conference_details
    );
    const conference = new ConferenceModel(
      data_required_to_filter_conference_details
    );
    await conference.save();
    let queryToSend = { ParentCallSid: dataFromVibconnect.ParentCallSid };
    let updateToSend = {
      $set: { CallSidOfConferenceChildCall: call_details_json.sid },
    };
    updateRealTimeDataOfIvrStudiousForApiCall(queryToSend, updateToSend);

    let Parent: any;
    Parent = voice.dial({
      action: `${conf.BaseUrl}/api/v2/ivrstudios/convert/${id}/conference|Room_${dataFromVibconnect.ParentCallSid}/${source}`,
      method: "GET",
    });
    Parent.conference(
      {
        waitUrl: targetNode.mpcAudio,
        statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
        statusCallbackEvent: "start end join leave mute hold",
      },
      `Room_${dataFromVibconnect.ParentCallSid}`
    );

    let xml = voice.toString();
    logger.info("xml is : " + xml);
    return xml;
  } catch (error: any) {
    voice.say(error.message);
    let xml = voice.toString();
    return xml;
  }
}

//need proper testing only tested with cloud number node not in gather just in first level
export async function generateXmlForMultiPartyCallNode(
  id: string,
  source: string,
  target: string,
  data: multiPartyCallNodeDataInputs,
  dataFromVibconnect: dataFromVibconnectForIncoming
) {
  const voice: VoiceResponse | any = new VoiceResponse();
  try {
    if (data.mpcCallDistribustion.toLowerCase() === "priority") {
      const xml = await handleMultiPartyCallDistributionOfTypePriority(
        id,
        source,
        target,
        data,
        dataFromVibconnect
      );
      return xml;
    } else if (data.mpcCallDistribustion.toLowerCase() === "parallel") {
      const xml = await handleMultiPartyCallDistributionProcess(
        id,
        source,
        target,
        data,
        dataFromVibconnect
      );
      return xml;
    } else if (data.mpcCallDistribustion.toLowerCase() === "roundrobin") {
      const xml = await handleMultiPartyCallDistributionOfTypeRoundRobin(
        id,
        source,
        target,
        data,
        dataFromVibconnect
      );
      return xml;
    }
  } catch (err: any) {
    voice.say(err.message);
    let xml = voice.toString();
    logger.error(xml);
    return xml;
  }
}

export async function generateXmlForMessage(
  data: messageNodeDataInputs,
  dataFromVibconnect: dataFromVibconnectForIncoming
) {
  const voice: VoiceResponse | any = new VoiceResponse();
  try {
    if (!data.AuthId || !data.AuthSecret)
      return voice.say("Check Flow").toString();
    let value: any = data;
    let ParentCallSid = dataFromVibconnect.ParentCallSid;
    const customerVariablesDetails: any = await IvrStudiosRealTime.findOne({
      ParentCallSid: ParentCallSid,
    });
    let dataBaseVariables = {};
    if (customerVariablesDetails) {
      const tempObj = customerVariablesDetails.variables.map(
        (variable: any) => {
          const stringObj = `{"${variable.key}":"${variable.value}"}`;
          return JSON.parse(stringObj);
        }
      );
      const a = tempObj.reduce(
        (acc: any, obj: any) => Object.assign(acc, obj),
        {}
      );
      dataBaseVariables = a;
    }

    const myQuery: any = { ParentCallSid: ParentCallSid };
    const customer: any = await IvrStudiosStatusModel.find(myQuery);
    // console.log("customer : ",customer)
    const time = customer[0].subscribeDate;
    const call_back_with_digits = customer.filter((customer: any) => {
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

    let removed_sip: any; //customer number
    let customer_number_only_10_deigits: any;
    if (customer[0].From) {
      if (customer[0].From.includes("sip:")) {
        let removed_ip = customer[0].From.split("@")[0];
        removed_sip = removed_ip.split(":")[1];
      } else {
        removed_sip = customer[0].From;
        removed_sip = removed_sip.replace(/^0+/, "");
        customer_number_only_10_deigits = removed_sip.substr(
          removed_sip.length - 10
        );
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
      const Obj2: any = {
        ...Obj,
        ...dataBaseVariables,
      };

      var RE = new RegExp(Object.keys(Obj2).join("|"), "gi");
      const x = text.replace(RE, function (matched: any) {
        return Obj2[matched];
      });
      // console.log("x : ",x)
      const y = x.replace(/\[/g, "").replace(/\]/g, "").replace(/\#/g, ""); //value of string after replacing [] from the messageBody
      if (value.carrierType.toLowerCase() === "domestic") {
        Promise.all(
          value.toNumbers.map(async (to: any) => {
            console.log("to : ", to);
            const correctFormatOfCustomerNumber =
              checkTheNumberContainsSymbolOrNOT(to.number);
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
              StatusCallbackMethod:
                "queued, failed , sent , delivered ,undelivered",
            };

            const vibconnect = new Vibconnect();
            const string_result: any = await vibconnect.sendMessage(
              value.AuthId,
              value.AuthSecret,
              payloadForMessage
            );
            const json_result = JSON.parse(string_result);
            const sms_data = new smsModel(json_result);
            await sms_data.save();
          })
        );
      }
      if (value.carrierType.toLowerCase() === "international") {
        Promise.all(
          value.toNumbers.map(async (to: any) => {
            // console.log("to : ",to)
            const correctFormatOfCustomerNumber =
              checkTheNumberContainsSymbolOrNOT(to.number);
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
              StatusCallbackMethod:
                "queued, failed , sent , delivered ,undelivered",
            };

            const vibconnect = new Vibconnect();
            const string_result: any = await vibconnect.sendMessage(
              value.AuthId,
              value.AuthSecret,
              payloadForMessage
            );
            const json_result = JSON.parse(string_result);
            const sms_data = new smsModel(json_result);
            await sms_data.save();
          })
        );
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
      const x = text.replace(RE, function (matched: any) {
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
        const correctFormatOfCustomerNumber =
          checkTheNumberContainsSymbolOrNOT(removed_sip);
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
          StatusCallbackMethod:
            "queued, failed , sent , delivered ,undelivered",
        };

        const vibconnect = new Vibconnect();
        const string_result: any = await vibconnect.sendMessage(
          value.AuthId,
          value.AuthSecret,
          payloadForMessage
        );
        const json_result = JSON.parse(string_result);
        const sms_data = new smsModel(json_result);
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
        const correctFormatOfCustomerNumber =
          checkTheNumberContainsSymbolOrNOT(removed_sip);
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
          StatusCallbackMethod:
            "queued, failed , sent , delivered ,undelivered",
        };
        const vibconnect = new Vibconnect();
        const string_result: any = await vibconnect.sendMessage(
          value.AuthId,
          value.AuthSecret,
          payloadForMessage
        );
        const json_result = JSON.parse(string_result);
        const sms_data = new smsModel(json_result);
        await sms_data.save();
      }
    }

    voice.hangup();
    let xml = voice.toString();
    return xml;
  } catch (err: any) {
    voice.say(err.message);
    let xml = voice.toString();
    logger.error(xml);
    return xml;
  }
}

export async function getOrCreateContact(data: dataFromVibconnectForIncoming) {
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
      .then((detailsOfContact: any) => {
        console.log("Data in Contact : ", detailsOfContact);
        if (!detailsOfContact) {
          const ContactModel = new contactModel({
            firstName: "Unknown",
            lastName: "",
            phoneNumber: `91${contact.slice(-10)}`,
            AccountSid: data.AccountSid,
          });

          ContactModel.save()
            .then((data: any) => {
              console.log(
                "Since No Contact found new contact created : ",
                data
              );
            })
            .catch((err: any) => {
              console.log("Error : ", err);
            });
        }
      })
      .catch((err: any) => {
        console.log("Error : ", err);
      });
  }
}

export async function checkIsAgentIsAssignedToCustomer(
  customer: string,
  authId: string
) {
  const queryToFindContact = {
    AccountSid: authId,
    phoneNumber: { $regex: customer.slice(-10), $options: "i" },
  };
  console.log("queryToFindContact : ", queryToFindContact);
  const contactDetails: any = await contactModel
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

export async function makeCallToAssignedAgent(
  id: string,
  source: string,
  target: string,
  data: stickyAgentNodeDataType,
  dataFromVibconnect: dataFromVibconnectForIncoming,
  assignedTo: string
) {
  const voice: VoiceResponse | any = new VoiceResponse();
  let Parent;
  Parent = voice.dial({
    action: `${conf.BaseUrl}/api/v2/ivrstudios/convert/${id}/conference|Room_${dataFromVibconnect.ParentCallSid}/${source}`,
    method: "GET",
  });
  Parent.conference(
    {
      statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/conference`,
      statusCallbackEvent: "start end join leave mute hold",
    },
    `Room_${dataFromVibconnect.ParentCallSid}`
  );

  let timeOut: string = "60";
  let purchasedNumber;
  let url = "empty";

  const cloudNumber = dataFromVibconnect.To;
  purchasedNumber = checkTheNumberContainsSymbolOrNOT(cloudNumber);
  purchasedNumber = correctFormatOfCloudNumberAccordingToState(purchasedNumber);
  const sendDigitsObj =  data.SendDigits ? { "SendDigits" : data.SendDigits} : {}
  const body = {
    statusCallback: `${conf.BaseUrl}/api/webhook/vibconnect/ivr_studios/api_call`, // it also save data to ivrStudios dataBase but only for API-Call
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

  const vibconnect = new Vibconnect();
  const call_details: any = await vibconnect.makeCall(
    data.authId,
    data.authSecret,
    body
  );

  logger.info("call details from vibconnect : " + call_details);
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

  const conference = new ConferenceModel(
    data_required_to_filter_conference_details
  );
  await conference.save();
  let queryToSend = { ParentCallSid: dataFromVibconnect.ParentCallSid };
  let updateToSend = {
    $set: { CallSidOfConferenceChildCall: call_details_json.sid },
  };
  updateRealTimeDataOfIvrStudiousForApiCall(queryToSend, updateToSend);

  let xml = voice.toString();
  logger.info("xml is : " + xml);
  return xml;
}

export async function generateXMLForStickyAgentNode(
  id: string,
  source: string,
  target: string,
  data: stickyAgentNodeDataType,
  dataFromVibconnect: dataFromVibconnectForIncoming,
  connectors: connectorType[]
) {
  const voice: VoiceResponse | any = new VoiceResponse();
  try {
    const isAssignedToUser = await checkIsAgentIsAssignedToCustomer(
      dataFromVibconnect.Caller,
      dataFromVibconnect.AccountSid
    );
    let xml;
    if (isAssignedToUser.status) {
      logger.info(
        "this contact is assigned to user this is the details of user" +
          isAssignedToUser.data
      );
      // console.log("is assigned user : ", isAssignedToUser)
      const xml = makeCallToAssignedAgent(
        id,
        source,
        target,
        data,
        dataFromVibconnect,
        isAssignedToUser.data.AssignTo.phone
      );
      return xml;
    }

    if (!isAssignedToUser.status) {
      logger.info("No User is assigned");
      const currentNodeId = source;
      const nextNodeIdIfFailed = connectors.find((node) => {
        if (
          node.source === currentNodeId &&
          node.sourceHandle === "tickyAgentFailed"
        ) {
          return node;
        }
        return false;
      });
      if (nextNodeIdIfFailed) {
        voice.redirect(
          { method: "GET" },
          `${conf.BaseUrl}/api/v2/ivrstudios/convert/${id}/${nextNodeIdIfFailed.target}/${nextNodeIdIfFailed.source}`
        );
        xml = voice.toString();
        logger.info("xml is : " + xml);
        return xml;
      }
      xml = voice.hangup();
      logger.info("xml is something went wrong : " + xml);
      return xml;
    }
  } catch (err: any) {
    voice.say(err.message);
    let xml = voice.toString();
    logger.error(xml);
    return xml;
  }
}
