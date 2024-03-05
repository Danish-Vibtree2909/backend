/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
interface SMSMessageType {
    conversationId: any;
    messageId: any;
    contactNumber: string;
    cloudNumber: string;
    createdAt: any;
    direction: string;
    status: string;
    messageType: string;
    conversationType: string;
    messageBody: string;
    isTemplate: boolean;
    peId?: string;
    senderId?: string;
    templateId?: string;
    tempId?: string;
    provider: string;
}
interface SMSConversationType {
    conversationId: string;
    lastMessageId: any;
    contactId: any;
    senderId: any;
    contactNumber: string;
    contactName: string;
    cloudNumber: string;
    companyId: any;
    createdAt: any;
    lastMessageAt: any;
    conversationType: string;
}
export default class SmsController extends Controller {
    constructor(model?: any);
    filterConversation(req: IRequest, res: IResponse): Promise<any>;
    checkAndCreateContact: (data: {
        number: string;
        authId: string;
    }) => Promise<{
        status: boolean;
        contact: any;
    }>;
    createMessage: (data: SMSMessageType) => Promise<false | import("mongoose").ModifyResult<import("mongoose").Document<unknown, {}, import("../types/SMSMessageType").default> & Omit<import("../types/SMSMessageType").default & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    checkAndCreateConversation: (data: SMSConversationType) => Promise<false | import("mongoose").ModifyResult<import("mongoose").Document<unknown, {}, import("../types/SMSConversationType").default> & Omit<import("../types/SMSConversationType").default & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    createCreditLog: (data: any, source: any, amount: any, companyId: any) => Promise<void>;
    deductBalanceFromCredits: (data: any, source: any, amount: number) => Promise<void>;
    sendMessageFromThinq(req: IRequest, res: IResponse): Promise<any>;
    getAllConversations(req: IRequest, res: IResponse): Promise<any>;
    getAllMessageOfConversation(req: IRequest, res: IResponse): Promise<any>;
}
export {};
//# sourceMappingURL=SmsController.d.ts.map