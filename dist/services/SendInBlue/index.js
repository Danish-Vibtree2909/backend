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
exports.sendConfirmationMailUsingSendInBlue = exports.sendMailUsingSendInBlue = void 0;
const config = __importStar(require("../../config/index"));
const request_1 = __importDefault(require("request"));
const httpClient = request_1.default;
async function sendMailUsingSendInBlue(email, subject, content, name) {
    const link = config.SMTP_LINK;
    let time = new Date();
    console.log("time ", time.toDateString());
    let date = time.toDateString();
    var data = JSON.stringify({
        sender: {
            name: config.SMTP_SENDER_NAME,
            email: config.SMTP_SENDER_EMAIL,
        },
        to: [
            {
                email: email,
                name: "Vibtree",
            },
        ],
        subject: config.SMTP_SUBJECT,
        htmlContent: `<html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
           @media screen and (max-width:600px) {
              .ver-code-heading{
                  font-size: 10px;
                  display: none;
              }
              .date-width{
                  width: 200px;
              }
           }
          </style>
      </head>
      <body>
      
          <table style='margin-top:50px;
                        margin-bottom:50px;
                        width: 600px;
                        margin-left:auto;
                        min-width: 600px;
                        margin-right:auto;
                        border:2px solid #0046BB;
                        border-radius:13px;
                        border-collapse:separate;
                        font-family: Poppins, sans-serif;'
                    cellspacing=0 cellpadding=0>
      
              <tbody>
                  <tr  style="width: 600px;">
      
                      <td colspan="6" style="width: 300px;"></td>
      
                      <td colspan="3" style="width: 150px;">
                          <p style="color: #0046BB; 
                                text-decoration: underline; 
                                margin-top: 30px; 
                                margin-right: 30px; 
                                width: 150px;
                                float: right;
                                text-align: right;
                                font-size: 10px;"
                         class="res-font date-width">
                      ${date}</p>
                      </td>
                  </tr>
      
      
                  <tr  style="width: 600px;">
                      <td colspan="12" style="padding: 15px; padding-top: 0px;">
                            <p style="font-size: 15px; margin-top: 0px;">Hi, <br> <br>
                            We have received a request for a One Time Password (OTP) associated with your account. If you did not initiate this request, please ignore this message. <br> <br>
                            If you did request an OTP, please find the details below:. <br> <br>
                            OTP : ${content}. <br> <br>
                            Please note that this OTP is only valid for a limited period of time. Once it expires, you will need to request a new one.
                            </p>
                            <br>
                            <p style="font-size: 13px; margin: 0px;">If you didn’t make this request or you need assistance, contact our support team at support@vibtree.com.</p> 
                            <br>
                            <p style="font-size: 15px; margin: 0px;">
                              Cheers! <br>
                              Team Vibtree
                            </p>
                      </td>
                  </tr>
      
                  <tr style="width: 600px;">
                      <td colspan="7" style="width: 500px; border-top:1px solid #0046BB; border-collapse: collapse;">
                          <a style="color: #0046BB; padding: 5px;" class="res-font" href="https://www.vibtree.com/company/about/">About us</a>
                          <a style="color: #0046BB; padding: 5px;" class="res-font" href="https://www.vibtree.com/privacy-policy/">Privacy Policy</a>
                          <a style="color: #0046BB; padding: 5px;" class="res-font" href="https://www.vibtree.com/terms-of-use/">Terms Of Use</a>
                      </td>
                      <td colspan="3" style=" border-top:1px solid #0046BB;"></td>
                      <td colspan="1" style="width: 50px; border-top:1px solid #0046BB; border-collapse: collapse; padding: 10px;">
                          <a href="https://www.facebook.com/vibtree" style="color: #0046BB; margin: 5px; margin-bottom: 20px; width: 25px; height: 25px;">
                              <img src="https://vibtreedan.s3.eu-central-1.amazonaws.com/email-templates/template-facebook-icon.png" 
                                   alt="template-facebook-icon"
                                   style="width: 25px;">
                          </a>
                      </td>
                      <td colspan="1" style="width: 50px; border-top:1px solid #0046BB; border-collapse: collapse; padding: 10px;">
                          <a href="https://www.linkedin.com/company/vibtree/mycompany/" style="color: #0046BB; width: 25px; height: 25px;">
                              <img src="https://vibtreedan.s3.eu-central-1.amazonaws.com/email-templates/template-linkedin-icon.png" 
                                   alt="template-linkedin-icon"
                                   style="width: 25px;">
                          </a>
                      </td>
                  </tr>
      
              </tbody>
          </table>
          
      </body>
      </html>`,
    });
    var options = {
        method: "post",
        url: link,
        headers: {
            accept: "application/json",
            "api-key": config.SMTP_API_KEY,
            "content-type": "application/json",
        },
        body: data,
    };
    return new Promise((resolve, reject) => {
        httpClient(options, (err, res, body) => {
            if (err) {
                console.log("error ", err);
                reject(err);
            }
            console.log("body of send mail ", body);
            resolve(body);
        });
    });
}
exports.sendMailUsingSendInBlue = sendMailUsingSendInBlue;
async function sendConfirmationMailUsingSendInBlue(email, subject, customer_email, last_name, first_name, type, country, company, address, phoneNumber) {
    const link = config.SMTP_LINK;
    var data = JSON.stringify({
        sender: {
            name: config.SMTP_SENDER_NAME,
            email: config.SMTP_SENDER_EMAIL,
        },
        to: [
            {
                email: email,
                name: "Vibtree",
            },
        ],
        subject: subject,
        htmlContent: `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
         @media screen and (max-width:600px) {
            .ver-code-heading{
                font-size: 10px;
                display: none;
            }
            .date-width{
                width: 200px;
            }
         }
        </style>
    </head>
    <body>
    
        <table style='margin-top:50px;
                      margin-bottom:50px;
                      width: 600px;
                      margin-left:auto;
                      min-width: 600px;
                      margin-right:auto;
                      border:2px solid #0046BB;
                      border-radius:13px;
                      border-collapse:separate;
                      font-family: Poppins, sans-serif;'
                  cellspacing=0 cellpadding=0>
    
            <tbody>
                <tr  style="width: 600px;">
                    <td colspan="3" style="width: 150px;">
                        <img src="https://vibtreedan.s3.eu-central-1.amazonaws.com/email-templates/vibtree-template-logo.png" 
                        alt="email-verification-code"
                        style="margin-top: 30px; margin-left: 30px; width: 150px;">   
                    </td>
    
                    <td colspan="6" style="width: 300px;"></td>
                </tr>

                <tr  style="width: 600px;">
                    <td colspan="12" style="padding: 15px; padding-top: 0px;">
                          <p style="font-size: 15px; margin-top: 0px;">Hi, <br> <br>
                            A new account has been created
                          </p>
                          <br>
                          <p style="font-size: 13px; margin: 0px;">Email : ${customer_email}</p> 
                          <br>
                         
                          <p style="font-size: 13px; margin: 0px;">Full name : ${first_name} ${last_name}</p> 
                          
                          <br>
                          <p style="font-size: 13px; margin: 0px;">Type : ${type}</p> 
                         
                          <br>
                          <p style="font-size: 13px; margin: 0px;">Country : ${country}.</p> 
                         
                          <br>
                          <p style="font-size: 13px; margin: 0px;">Company : ${company}.</p> 
                       
                          <br>
                          <p style="font-size: 13px; margin: 0px;">Address : ${address}.</p> 
                          <br>
                          <br>
                          <p style="font-size: 13px; margin: 0px;">Phone Number : ${phoneNumber}.</p> 
                          <br>
                          <p style="font-size: 15px; margin: 0px;">
                            Cheers! <br>
                            Team Vibtree
                          </p>
                    </td>
                </tr>
    
                <tr style="width: 600px;">
                    <td colspan="7" style="width: 500px; border-top:1px solid #0046BB; border-collapse: collapse;">
                        <a style="color: #0046BB; padding: 5px;" class="res-font" href="https://www.vibtree.com/company/about/">About us</a>
                        <a style="color: #0046BB; padding: 5px;" class="res-font" href="https://www.vibtree.com/privacy-policy/">Privacy Policy</a>
                        <a style="color: #0046BB; padding: 5px;" class="res-font" href="https://www.vibtree.com/terms-of-use/">Terms Of Use</a>
                    </td>
                    <td colspan="3" style=" border-top:1px solid #0046BB;"></td>
                    <td colspan="1" style="width: 50px; border-top:1px solid #0046BB; border-collapse: collapse; padding: 10px;">
                        <a href="https://www.facebook.com/vibtree" style="color: #0046BB; margin: 5px; margin-bottom: 20px; width: 25px; height: 25px;">
                            <img src="https://vibtreedan.s3.eu-central-1.amazonaws.com/email-templates/template-facebook-icon.png" 
                                 alt="template-facebook-icon"
                                 style="width: 25px;">
                        </a>
                    </td>
                    <td colspan="1" style="width: 50px; border-top:1px solid #0046BB; border-collapse: collapse; padding: 10px;">
                        <a href="https://www.linkedin.com/company/vibtree/mycompany/" style="color: #0046BB; width: 25px; height: 25px;">
                            <img src="https://vibtreedan.s3.eu-central-1.amazonaws.com/email-templates/template-linkedin-icon.png" 
                                 alt="template-linkedin-icon"
                                 style="width: 25px;">
                        </a>
                    </td>
                </tr>
    
            </tbody>
        </table>
        
    </body>
    </html>`,
    });
    var options = {
        method: "post",
        url: link,
        headers: {
            accept: "application/json",
            "api-key": config.SMTP_API_KEY,
            "content-type": "application/json",
        },
        body: data,
    };
    return new Promise((resolve, reject) => {
        httpClient(options, (err, res, body) => {
            if (err) {
                console.log("error ", err);
                reject(err);
            }
            console.log("body of send mail ", body);
            resolve(body);
        });
    });
}
exports.sendConfirmationMailUsingSendInBlue = sendConfirmationMailUsingSendInBlue;
//# sourceMappingURL=index.js.map