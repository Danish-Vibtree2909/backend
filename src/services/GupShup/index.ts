import request from "request";
import logger from "../../config/logger";
const httpClient = request;

interface optInputType {
  method: string;
  format: string;
  userid: string;
  password: string;
  phone_number: string;
  v: string;
  auth_scheme: string;
  channel: string;
}

interface sendMessageInputType {
  userid: string;
  password: string;
  send_to: string;
  v: string;
  format: string;
  msg_type: string;
  method: string;
  msg: string;
  isTemplate: string;
  buttonUrlParam?: string;
  auth_scheme?: string;
}

export default class GupShup {
  public gupshupBaseUrl: string =
    process.env.GUPSHUP_BASE_URL ||
    "https://media.smsgupshup.com/GatewayAPI/rest";

  public constructor(model?: any) {
    this.sendMessage = this.sendMessage.bind(this);
    this.optetUser = this.optetUser.bind(this);
    this.sendMessageWithoutTemplate = this.sendMessageWithoutTemplate.bind(this);
  }

  public async sendMessageWithoutTemplate(input: sendMessageInputType) {
    const {
      userid,
      password,
      send_to,
      v,
      format,
      msg_type,
      method,
      msg,
      auth_scheme,
    } = input;
    console.log("Input : ", input);
    let link = `${this.gupshupBaseUrl}`;

    var options = {
      method: "POST",
      url: link,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      form: {
        method: method,
        userid: userid,
        password: password,
        msg: msg,
        msg_type: msg_type,
        format: format,
        v: v,
        auth_scheme: auth_scheme,
        send_to: send_to,
      },
    };
    logger.info("Options : " + JSON.stringify(options));
    return new Promise((resolve: any, reject: any) => {
      httpClient(options, (err: Error, res: any, body: any) => {
        if (err) {
          logger.error("error in send normal message from gupshup : " + err);
          reject(err);
        }
        logger.info("send normal message response from gupshup : " + body);
        resolve(body);
      });
    });
  }

  public async sendMessage(input: sendMessageInputType) {
    const {
      userid,
      password,
      send_to,
      v,
      format,
      msg_type,
      method,
      msg,
      isTemplate,
      buttonUrlParam,
    } = input;
    console.log("Input : ", input);
    let link;
    let subUrl;
    if (buttonUrlParam) {
      //link = `${this.gupshupBaseUrl}?userid=${userid}&password=${password}&send_to=${send_to}&v=${v}&format=${format}&msg_type=${msg_type}&method=${method}&msg=${msg}&isTemplate=${isTemplate}&buttonUrlParam=${buttonUrlParam}`;
      subUrl =
        `userid=${userid}&password=${password}&send_to=${send_to}&v=${v}&format=${format}&msg_type=${msg_type}&method=${method}&msg=${msg}&isTemplate=${isTemplate}` +
        `&buttonUrlParam=${buttonUrlParam}`;
    } else {
      if(isTemplate === 'false'){
        subUrl = `userid=${userid}&password=${password}&send_to=${send_to}&v=${v}&format=${format}&msg_type=${msg_type}&method=${method}&msg=${msg}`;
      }
      //link = `${this.gupshupBaseUrl}?userid=${userid}&password=${password}&send_to=${send_to}&v=${v}&format=${format}&msg_type=${msg_type}&method=${method}&msg=${msg}&isTemplate=${isTemplate}`;
      subUrl = `userid=${userid}&password=${password}&send_to=${send_to}&v=${v}&format=${format}&msg_type=${msg_type}&method=${method}&msg=${msg}&isTemplate=${isTemplate}`;
    }

    link = `${this.gupshupBaseUrl}?${subUrl}`;

    var options = {
      method: "GET",
      url: link,
    };
    logger.info("Options : " + JSON.stringify(options));
    return new Promise((resolve: any, reject: any) => {
      httpClient(options, (err: Error, res: any, body: any) => {
        if (err) {
          logger.error("error in send message from gupshup : " + err);
          reject(err);
        }
        logger.info("send message response from gupshup : " + body);
        resolve(body);
      });
    });
  }

  public async optetUser(input: optInputType) {
    const {
      method,
      format,
      userid,
      password,
      v,
      auth_scheme,
      channel,
      phone_number,
    } = input;
    const link = `${this.gupshupBaseUrl}?method=${method}&format=${format}&userid=${userid}&password=${password}&phone_number=${phone_number}&v=${v}&auth_scheme=${auth_scheme}&channel=${channel}`;
    const options = {
      method: "GET",
      url: link,
    };
    console.log("Options : ", options);
    return new Promise((resolve: any, reject: any) => {
      httpClient(options, (err: Error, res: any, body: any) => {
        if (err) {
          logger.error("error in optet from gupshup : " + err);
          reject(err);
        }
        logger.info("optet response from gupshup : " + body);
        resolve(body);
      });
    });
  }
}
