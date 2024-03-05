import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
import { sendMessage } from "../services/Thinq/index";
import { getOneContact, createContact } from "../services/contactModel";
import {
  findOneAndUpdateSmsMessage,
  getAllSmsMessage,
  countDocumentsSmsMessage,
} from "../services/SMSMessageModel";
import {
  countDocumentsSmsConversation,
  findOneAndUpdateSmsConversatio,
  getAllSmsConversations,
} from "../services/SMSConversationModel";
import { getVibconnect } from "../services/vibconnectModel";
import { updateOneSubscription } from "../services/SubscriptionModel";
import { createCreditCdr } from "../services/CreditCdrModel";
import moment from "moment";
interface IMessageBody {
  from: string;
  to: string;
  message: string;
  countryCode: string;
  tempId?: string;
  conversationId?: string; // If you are sending message second time you need to send me conversation id
}

interface SMSMessageType {
  conversationId: any;
  messageId: any; // message id we got from thinq
  // contactId : any ;
  contactNumber: string;
  cloudNumber: string;
  // companyId : any ;
  createdAt: any;
  direction: string;
  status: string; // delivered / undelivered
  messageType: string; // text / mms
  conversationType: string; //one-on-one / group
  messageBody: string;
  isTemplate: boolean;
  peId?: string;
  senderId?: string;
  templateId?: string;
  tempId?: string;
  provider: string; // Carrier from where we are sending or receiving messages.
}

interface SMSConversationType {
  conversationId: string;
  lastMessageId: any;
  contactId: any;
  senderId: any; //user id who is sending message
  contactNumber: string;
  contactName: string;
  cloudNumber: string;
  companyId: any;
  createdAt: any;
  lastMessageAt: any;
  conversationType: string; //One-on-One / group
}

// interface IFilterConversation {
//     name : string,
//     number : string
// }

export default class SmsController extends Controller {
  public constructor(model?: any) {
    super(model);
    this.sendMessageFromThinq = this.sendMessageFromThinq.bind(this);
    this.getAllConversations = this.getAllConversations.bind(this);
    this.getAllMessageOfConversation =
      this.getAllMessageOfConversation.bind(this);
    this.filterConversation = this.filterConversation.bind(this);
  }

  public async filterConversation(req: IRequest, res: IResponse): Promise<any> {
    const companyId = req.JWTUser?.companyId;

    let numberFilter = {};
    let nameFilter = {};

    if (req.query.number) {
      numberFilter = {
        contactNumber: { $regex: req.query.number, $options: "i" },
      };
    }

    if (req.query.name) {
      nameFilter = { contactName: { $regex: req.query.name, $options: "i" } };
    }

    const finalQueryFilter = {
      ...req.query,
      ...numberFilter,
      ...nameFilter,
      companyId: companyId,
    };

    const conversations = await getAllSmsConversations(finalQueryFilter);
    const count = await countDocumentsSmsConversation(finalQueryFilter);
    this.data = { data: conversations, totalCount: count };
    this.status = true;
    this.code = 200;
    this.message = "SMS Conversations fetched!";

    return res.status(200).json(this.Response());
  }

  checkAndCreateContact = async (data: { number: string; authId: string }) => {
    const { authId, number } = data;
    const queryToFindContact = {
      AccountSid: authId,
      phoneNumber: { $regex: number.slice(-10), $options: "i" },
    };
    const response = await getOneContact(queryToFindContact);

    if (response) {
      console.log("Contact found return contact id : ", response);
      return { status: true, contact: response };
    } else {
      console.log("Contact not found create a contact and return _id : ");
      const dataToCreateContact = {
        AccountSid: authId,
        phoneNumber: number,
        firstName: "Unknown",
      };

      const response = await createContact(dataToCreateContact);
      if (response) {
        return { status: true, contact: response };
      } else {
        return { status: false, contact: null };
      }
    }
  };

  createMessage = async (data: SMSMessageType) => {
    console.log("SMS message data : ", data);
    const query = { messageId: data.messageId };
    const update = { $set: { ...data } };
    const options = { upsert: true, new: true };
    // const response = await createSmsMessage(data)
    const response = await findOneAndUpdateSmsMessage(query, update, options);
    return response;
  };

  checkAndCreateConversation = async (data: SMSConversationType) => {
    console.log("SMS conversation data : ", data);
    const query = { cloudNumber: data.cloudNumber, contactId: data.contactId };
    const updates = { $set: { ...data } };
    const options = { upsert: true, new: true };
    const response = await findOneAndUpdateSmsConversatio(
      query,
      updates,
      options
    );
    return response;
  };

  createCreditLog = async (
    data: any,
    source: any,
    amount: any,
    companyId: any
  ) => {
    const utcMoment = moment.utc();
    const utcDate = new Date(utcMoment.format());

    let tempData = {
      companyId: companyId,
      source: source,
      amount: amount,
      createdAt: utcDate,
      callId: null,
      smsId: null,
      numberId: null,
    };

    if (source === "call") {
      tempData.callId = data._id;
    }
    if (source === "sms") {
      tempData.smsId = data.lastMessageId;
    }

    await createCreditCdr(tempData);
  };

  deductBalanceFromCredits = async (data: any, source: any, amount: number) => {
    if (source === "call") {
      const authId = data.AccountSid;
      // get company id
      let companyId;
      const queryToGetCompanyDetails = { authId: authId };
      try {
        const userDetails = await getVibconnect(queryToGetCompanyDetails);
        if (userDetails.length > 0) {
          companyId = userDetails[0].companyId;
          const queryForSubscription = { companyId: companyId };
          const update = { $inc: { credits: -amount } };
          const option = { upsert: false };
          //deduct balance
          await updateOneSubscription(queryForSubscription, update, option);
          await this.createCreditLog(data, source, amount, companyId);
        }
      } catch (err: any) {
        console.log("Error in deducting credits : ", err);
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
        await updateOneSubscription(queryForSubscription, update, option);
        await this.createCreditLog(data, source, amount, companyId);
      } catch (err: any) {
        console.log("Error in deducting credits : ", err);
      }
    }
  };

  public async sendMessageFromThinq(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    //Check if payload is correct or not.
    const body = req.body as IMessageBody;

    if (!body.from) {
      this.data = [];
      this.code = 403;
      this.status = false;
      this.message = "Provide from!";

      return res.status(403).json(this.Response());
    }

    if (!body.to) {
      this.data = [];
      this.code = 403;
      this.status = false;
      this.message = "Provide to!";

      return res.status(403).json(this.Response());
    }

    if (!body.message) {
      this.data = [];
      this.code = 403;
      this.status = false;
      this.message = "Provide message!";

      return res.status(403).json(this.Response());
    }

    if (!body.countryCode) {
      this.data = [];
      this.code = 403;
      this.status = false;
      this.message = "Provide Country Code!";

      return res.status(403).json(this.Response());
    }
    //Check if contact is created with that number or not

    const authId = req.JWTUser?.authId as string;
    const number = `${req.body.countryCode}${body.to}`;

    const contact: any = await this.checkAndCreateContact({
      number: number,
      authId: authId,
    });
    let contactId;
    let contactName = "Unknown";
    if (contact.status) {
      contactId = contact.contact._id;
      contactName = `${
        contact.contact.firstName ? contact.contact.firstName : "Unknown"
      } ${contact.contact.lastName ? contact.contact.lastName : ""}`;
    }
    //Send Message
    const payloadForMessage = {
      from_did: body.from,
      to_did: body.to,
      message: body.message,
    };
    const response: any = await sendMessage(payloadForMessage);
    console.log("Response : ", response, contactId);
    //Check if error in sending Message
    if (response.guid) {
      //Else create conversation and message
      const randomNumber = Math.floor(Math.random() * 100000000);
      // Ensure the number has 8 digits by padding with leading zeros if necessary
      const conversationId = randomNumber.toString().padStart(8, "0");

      const messagePayload: SMSMessageType = {
        conversationId: body.conversationId
          ? body.conversationId
          : conversationId,
        messageId: response.guid as string,
        contactNumber: body.to,
        cloudNumber: body.from,
        createdAt: new Date(),
        direction: "outbound",
        status: "sent",
        messageType: "text",
        conversationType: "one-on-one",
        messageBody: body.message,
        isTemplate: false,
        provider: "thinq",
        tempId: body.tempId,
      };
      const message: any = await this.createMessage(messagePayload);
      console.log("Message : ", message);
      if (message) {
        const conversationPayload: SMSConversationType = {
          lastMessageAt: new Date(),
          lastMessageId: message._id,
          contactId: contactId,
          senderId: req.JWTUser?._id,
          contactNumber: body.to,
          contactName: contactName,
          companyId: req.JWTUser?.companyId,
          createdAt: new Date(),
          conversationType: "one-on-one",
          cloudNumber: body.from,
          conversationId: conversationId,
        };
        const conversation = await this.checkAndCreateConversation(
          conversationPayload
        );
        console.log("Conversation : ", conversation);
        if (conversation) {
          this.deductBalanceFromCredits(conversationPayload, "sms", 25);
          this.data = messagePayload;
          (this.status = true), (this.code = 200);
          this.message = "Message sent";

          return res.status(200).json(this.Response());
        } else {
          this.data = [];
          (this.status = false), (this.code = 404);
          this.message = "Something went wrong in conversation!";

          return res.status(200).json(this.Response());
        }
      } else {
        this.data = [];
        (this.status = false), (this.code = 404);
        this.message = "Something went wrong in saving message!";

        return res.status(200).json(this.Response());
      }
    } else {
      //If error dont create conversation and message and return error

      this.data = response;
      this.code = response.code;
      this.status = false;
      this.message = response.message;

      return res.status(response.code).json(this.Response());
    }
  }

  public async getAllConversations(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    const companyId = req.JWTUser?.companyId;
    const queryToGetConversations = { ...req.query, companyId: companyId };
    const conversations = await getAllSmsConversations(queryToGetConversations);
    const count = await countDocumentsSmsConversation(queryToGetConversations);
    this.data = { data: conversations, totalCount: count };
    this.status = true;
    this.code = 200;
    this.message = "SMS Conversations fetched!";

    return res.status(200).json(this.Response());
  }

  public async getAllMessageOfConversation(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    const conversationId = req.params.conversationId;
    const query = { ...req.query, conversationId: conversationId };
    const messages = await getAllSmsMessage(query);
    const count = await countDocumentsSmsMessage(query);
    this.data = { data: messages, totalCount: count };
    this.status = true;
    this.code = 200;
    this.message = "Messages fetched!";

    return res.status(200).json(this.Response());
  }
}
