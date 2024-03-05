import request from "request";
import qs from "qs";
const httpClient = request;
import * as config from "../../config/index";

interface Did {
  carrierName: string;
  didSummary: string;
  id: number;
  npanxx: string;
  ratecenter: string;
  state: string;
  thinqTier: number;
  match: string;
}

export interface SearchResult {
  message: string;
  resultSet: string;
  exactDidsAmount: number;
  dids: Did[];
  statusCode?: number;
  error?: string;
}

export interface TN {
  account_location_id: string | null;
  caller_id: string | null;
  sms_routing_profile_id: string | null;
  route_id: number;
  features: {
    cnam: boolean;
    sms: boolean;
    e911: boolean;
  };
  did: number;
}

export interface TextMessage {
  from_did: string;
  to_did: string;
  message: string;
}

export interface MessageResponse {
  guid : string
}

export interface ErrorInMessageResponse {
  "code": number
  "message": string;
  "description": string;
}


export interface OriginationOrder {
  cooldown: number;
  message: string | null;
  account_id: string;
  user_id: string;
  status: string;
  tns: TN[];
  blocks: string[] | null;
  created: number;
  completed: number | null;
  invoice_id: number | null;
  invoice_url: string | null;
  sub_type: string;
  taxExemption: string | null;
  completion_started: number | null;
  account_name: string | null;
  billing_address: string | null;
  payment_type: string | null;
  payment_method: string | null;
  user_created: number | null;
  user_completed: number | null;
  total: number | null;
  subtotal: number | null;
  taxes: number | null;
  discount: number | null;
  credited_amount: number | null;
  summary: string | null;
  group_id: string | null;
  group_name: string | null;
  id: number;
  type: string;
  statusCode?: number;
  error?: string;
}

export async function getAllNumberFromInventory(data: any) {
  return new Promise((resolve: any, reject: any) => {
    const url = config.THINQ_BASEURL;
    const endPoint = `/inbound/get-numbers`;
    const { areaCode } = data;
    const params = {
      searchType: "domestic",
      searchBy: "npa",
      quantity: "50",
      contiguous: "false",
      npa: areaCode,
      related: true,
    };

    const queryString = qs.stringify(params);

    const userName = config.THINQ_USER;
    const password = config.THINQ_SECRET;
    const token = userName + ":" + password;
    const hash = Buffer.from(token).toString("base64");

    const options = {
      method: "GET",
      url: `${url}${endPoint}?${queryString}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + hash,
      },
    };
    httpClient(options, (error: Error, response: any, body: any) => {
      if (error) {
        reject(error);
      }
      const jsonBody: SearchResult = JSON.parse(body);
      resolve(jsonBody);
    });
  });
}

export async function createOrderBeforePurchase(data: any) {
  return new Promise((resolve: any, reject: any) => {
    const url = config.THINQ_BASEURL;
    const { number } = data;
    const endPoint = `/account/${config.THINQ_ACCOUNT_ID}/origination/order/create`;
    const userName = config.THINQ_USER;
    const password = config.THINQ_SECRET;
    const token = userName + ":" + password;
    const hash = Buffer.from(token).toString("base64");

    const body = {
      order: {
        tns: [
          {
            caller_id: null,
            account_location_id: null,
            sms_routing_profile_id: null,
            route_id: config.THINQ_ROUTE_ID,
            features: {
              cnam: false,
              sms: true,
              e911: false,
            },
            did: parseInt(number),
          },
        ],
      },
    };

    const option = {
      method: "POST",
      url: `${url}${endPoint}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + hash,
      },
      body: JSON.stringify({ ...body }),
    };
    console.log("Option : ", option)
    httpClient(option, (error: Error, response: any, body: any) => {
      if (error) {
        console.log("Error in creating order : ", error);
        reject(error);
      }

      const jsonBody: OriginationOrder = JSON.parse(body);
      resolve(jsonBody);
    });
  });
}

export async function confirmOrderAfterPurchase(data: any) {
  return new Promise((resolve: any, reject: any) => {
    const url = config.THINQ_BASEURL;
    const { orderId } = data;
    const endPoint = `/account/${config.THINQ_ACCOUNT_ID}/origination/order/complete/${orderId}`;
    const userName = config.THINQ_USER;
    const password = config.THINQ_SECRET;
    const token = userName + ":" + password;
    const hash = Buffer.from(token).toString("base64");

    var options = {
      method: "POST",
      url: `${url}${endPoint}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + hash,
      },
    };

    httpClient(options, (err: Error, response: any, body: any) => {
      if (err) {
        console.log("Error in confirming order of number from thinq : ", err);
        reject(err);
      }

      const jsonResponse: OriginationOrder = JSON.parse(body);

      resolve(jsonResponse);
    });
  });
}

export async function sendMessage ( data : TextMessage ) { 
  return new Promise((resolve : any , reject : any)=>{

    const userName = config.THINQ_USER;
    const password = config.THINQ_SECRET;
    const token = userName + ":" + password;
    const hash = Buffer.from(token).toString("base64");

    const options = {
      'method': 'POST',
      'url': `${config.THINQ_BASEURL}/account/${config.THINQ_ACCOUNT_ID}/product/origination/sms/send`,
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + hash
      },
      body: JSON.stringify({...data})
    };

    httpClient(options, (error: Error, response: any, body: any) => {
      if (error) {
        reject(error);
      }
      const jsonBody: MessageResponse | ErrorInMessageResponse  = JSON.parse(body);
      resolve(jsonBody);
    });

  })
}
