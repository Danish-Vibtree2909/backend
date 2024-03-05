import request from "request";
import logger from "../../config/logger";
const httpClient = request;
import * as config from "../../config/index";

interface sendMessageBody {
  From: string;
  To: string;
  PEId?: string;
  TemplateId?: string;
  Body: string;
  StatusCallback?: string;
  StatusCallbackMethod?: string;
}

interface makeCallInput {
  statusCallback: string;
  statusCallbackEvent: string;
  Record: string;
  To: string;
  From: string;
  Method: string;
  Url: string;
  recordingStatusCallback?: string;
  recordingStatusCallbackEvent?: string;
  recordingStatusCallbackMethod?: string;
  record?: string;
  SendDigits? : string; // eg : 'wwww1#' each w represent 0.5 sec so here 4*w means send 1 after 2 sec to server.
}

interface IHold {
  friendly_name: string;
  hold: boolean;
  hold_method?: string;
  hold_url?: string;
  conferenceId: string;
  callId: string;
}

export default class Vibconnect {
  public vibconnectBaseUrl: string = "https://api.vibconnect.io";
  public version: string = "v1";
  public constructor(model?: any) {
    this.sendMessage = this.sendMessage.bind(this);
    this.makeCall = this.makeCall.bind(this);
  }

  public async sendMessage(
    authId: string,
    authSecretId: string,
    data: sendMessageBody
  ) {
    const link = `${this.vibconnectBaseUrl}/${this.version}/Accounts/${authId}/Messages`;
    const token = authId + ":" + authSecretId;
    const hash = Buffer.from(token).toString("base64");

    const options = {
      method: "POST",
      url: link,
      headers: {
        Authorization: "Basic " + hash,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    //console.log("option : ", options)
    return new Promise((resolve: any, reject: any) => {
      httpClient(options, (err: Error, res: any, body: any) => {
        if (err) {
          logger.error("error in message from vibconnect : " + err);
          reject(err);
        }
        //logger.info("message response from vibconnect : " + body);
        if (res.statusCode === 404)
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

  public async makeCall(
    authId: string,
    authSecretId: string,
    data: makeCallInput
  ) {
    const link = `${this.vibconnectBaseUrl}/${this.version}/Accounts/${authId}/Calls`;
    const token = authId + ":" + authSecretId;
    const hash = Buffer.from(token).toString("base64");

    console.log("From : ", data.From);
    if (data.From.includes("918069")) {
      data.From = "+" + data.From.slice(-12);
    }

    if (data.From.includes("91223531")) {
      data.From = "+" + data.From.slice(-12);
    }

    if (data.From.includes("91336811")) {
      data.From = data.From.slice(-12);
    }

    const options = {
      method: "POST",
      url: link,
      headers: {
        Authorization: "Basic " + hash,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    logger.info("option in making call : " + JSON.stringify(options));
    return new Promise((resolve: any, reject: any) => {
      httpClient(options, (err: Error, res: any, body: any) => {
        if (err) {
          logger.error("error in call from vibconnect : " + err);
          reject(err);
        }
        logger.info("call response from vibconnect : " + body);
        resolve(body);
      });
    });
  }
}

const vibconnectBaseUrl: string = "https://api.vibconnect.io";
const version: string = "v1";

export async function sendMessage(
  authId: string,
  authSecretId: string,
  data: sendMessageBody
) {
  const link = `${vibconnectBaseUrl}/${version}/Accounts/${authId}/Messages`;
  const token = authId + ":" + authSecretId;
  const hash = Buffer.from(token).toString("base64");

  const options = {
    method: "POST",
    url: link,
    headers: {
      Authorization: "Basic " + hash,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  //console.log("option : ", options)
  return new Promise((resolve: any, reject: any) => {
    httpClient(options, (err: Error, res: any, body: any) => {
      if (err) {
        logger.error("error in message from vibconnect : " + err);
        reject(err);
      }
      //logger.info("message response from vibconnect : " + body);
      if (res.statusCode === 404)
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

export async function makeCall(
  authId: string,
  authSecretId: string,
  data: makeCallInput
) {
  const link = `${vibconnectBaseUrl}/${version}/Accounts/${authId}/Calls`;
  const token = authId + ":" + authSecretId;
  const hash = Buffer.from(token).toString("base64");

  console.log("From : ", data.From);
  if (data.From.includes("918069")) {
    data.From = "+" + data.From.slice(-12);
  }

  if (data.From.includes("91223531")) {
    data.From = "+" + data.From.slice(-12);
  }

  if (data.From.includes("91336811")) {
    data.From = data.From.slice(-12);
  }

  const options = {
    method: "POST",
    url: link,
    headers: {
      Authorization: "Basic " + hash,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  logger.info("option in making call : " + JSON.stringify(options));
  return new Promise((resolve: any, reject: any) => {
    httpClient(options, (err: Error, res: any, body: any) => {
      if (err) {
        logger.error("error in call from vibconnect : " + err);
        reject(err);
      }
      logger.info("call response from vibconnect : " + body);
      resolve(body);
    });
  });
}

export async function killParticularCall(
  callId: string,
  authId: string,
  authSecretId: string
) {
  const link: string = `${vibconnectBaseUrl}/${version}/Accounts/${authId}/Calls/${callId}`;
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
  logger.info("option in delete call : " + JSON.stringify(options));
  return new Promise((resolve: any, reject: any) => {
    httpClient(options, (error, response, body) => {
      if (error) {
        logger.error("error in kill call from vibconnect : " + error);
        reject(error);
      }
      logger.info("kill call response from vibconnect : " + body);
      resolve(body);
    });
  });
}

export async function endConference(
  auth_id: string,
  authSecret_id: string,
  conference_id: string
): Promise<any> {
  const link: string =
    `${vibconnectBaseUrl}/${version}/Accounts/` +
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

  logger.info("option in end conference : " + JSON.stringify(options));
  return new Promise((resolve: any, reject: any) => {
    httpClient(options, (err: Error, res: any, body: any) => {
      if (err) {
        logger.error("error in end conference from vibconnect : " + err);
        reject(err);
      }
      //  console.log("res of target ",res)
      logger.info("end call response from vibconnect : " + body);
      resolve(body);
    });
  });
}

export async function CreateTenantFromTiniyo(
  auth_id: string,
  authSecret_id: string,
  email: string
): Promise<any> {
  const link: string =
    `${vibconnectBaseUrl}/${version}/Accounts/` + auth_id + "/Tenants/";
  const tok = auth_id + ":" + authSecret_id;
  const hash = Buffer.from(tok).toString("base64");
  console.log("body in target function ", email);
  const data_to_send = {
    email: email,
    first: "Dev",
    last: "Developer",
    password: "Vibtree@123",
    phone1: "0000000000",
  };
  console.log("data to send tiniyo ", data_to_send);

  const options = {
    method: "POST",
    url: link,
    headers: {
      Authorization: "Basic " + hash,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data_to_send,
    }),
  };

  console.log("Options : ", options);

  return new Promise((resolve: any, reject: any) => {
    httpClient(options, (err: Error, res: any, body: any) => {
      if (err) {
        console.log("error in creating User ", err);
        reject(err);
      }
      console.log("body of created User ", body);
      resolve(body);
    });
  });
}

export async function AddPayment(auth_id: string, body: number): Promise<any> {
  const link: string =
    `https://api.siprtc.io/v1/Accounts/${config.VIBCONNECT_ADMIN}/Balances/` +
    auth_id;
  const data_to_send = { auth_id: auth_id, balance: body };
  const options = {
    method: "patch",
    url: link,
    headers: {
      Authorization: `Basic ${config.VIBCONNECT_AUTH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data_to_send,
    }),
  };

  console.log(options);
  return new Promise((resolve: any, reject: any) => {
    httpClient(options, (err: Error, res: any, body: any) => {
      if (err) {
        console.log("error in Payment ", err);
        reject(err);
      }
      console.log("body of CompletePayment ", body);
      resolve(body);
    });
  });
}

export async function BuyNumber(
  id: string,
  secret: string,
  number: string
): Promise<any> {
  return new Promise((resolve: any, reject: any) => {
    const link: string =
      `${vibconnectBaseUrl}/${version}` +
      "/Accounts/" +
      id +
      "/PhoneNumbers/" +
      number;

    const tok = id + ":" + secret;
    const hash = Buffer.from(tok).toString("base64");

    const options = {
      headers: {
        Authorization: "Basic " + hash,
      },
    };

    console.log({
      token: id,
      header: options.headers,
    });

    httpClient.post(link, options, (err: Error, res: any, body: any) => {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  });
}

export async function handleHold(
  auth_id: string,
  authSecret_id: string,
  data: IHold
): Promise<any> {
  const link: string =
    `${vibconnectBaseUrl}/${version}/Accounts/` +
    auth_id +
    "/Conferences/" +
    data.conferenceId +
    "/Participants/" +
    data.callId;
  const tok = auth_id + ":" + authSecret_id;
  const hash = Buffer.from(tok).toString("base64");

  const data_to_send = {
    friendly_name: data.friendly_name,
    hold: data.hold,
    hold_method: data.hold_method,
    hold_url: data.hold_url,
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

  logger.info("option in hold conference : " + JSON.stringify(options));
  return new Promise((resolve: any, reject: any) => {
    httpClient(options, (err: Error, res: any, body: any) => {
      if (err) {
        logger.error("error in hold conference from vibconnect : " + err);
        reject(err);
      }
      //  console.log("res of target ",res)
      logger.info("hold conference response from vibconnect : " + body);
      resolve(body);
    });
  });
}
