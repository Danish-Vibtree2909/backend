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
    senderId?: any;
    contactNumber: string;
    cloudNumber: string;
    companyId: any;
    createdAt: any;
    lastMessageAt: any;
    conversationType: string;
}
export default class WebSocketController extends Controller {
    constructor(models?: any);
    RecieveRecordingCallbacksAndSave(req: IRequest, res: IResponse): Promise<any>;
    sentConfirmationMessageToCustomer: (body: any) => Promise<void>;
    getInstagramMeta(req: IRequest, res: IResponse): Promise<any>;
    containsOnlyNumbers: (str: any) => boolean;
    isNumberPresentInStore: (query: any) => Promise<false | (import("mongoose").Document<unknown, {}, import("../types/StoreType").default> & Omit<import("../types/StoreType").default & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)>;
    replyAccordingToWowMomo: (data: any) => Promise<void>;
    replyOnButtonPress: (data: any) => Promise<void>;
    buildRegEx: (str: any, keywords: any) => RegExp;
    test: (str: any, keywords: any, expected: any) => boolean;
    postInstagramMeta(req: IRequest, res: IResponse): Promise<any>;
    makeFakeRequestToActionToSendMessage(body: any, id: any, source: any): Promise<unknown>;
    createCallStatusObjectForChild: (arr: any, obj: any) => any;
    getRecordingSid: (arr: any) => Promise<string | undefined>;
    firstStepOfChildConstructor: (childArray: any) => Promise<Object | null>;
    formatCallStatusObjectFromArray(ivrFlow: any): any;
    makeObjectFromArrayOfObjects: (ivrFlow: any, ChildivrFlow: any) => Promise<any>;
    checkIfCallerIsCallingFirstTimeOfNot: (caller: any) => Promise<{
        CallerType: string;
        count: number;
    }>;
    useDataWithNoChildCallToSave: (body: any) => Promise<void>;
    useInitiateCallDetailsToConvertData: (body: any) => Promise<void>;
    sortArrayOfChildCallsAccordingTotime(arrayOfChildCalls: any): any;
    findUserNameFromNumber: (number: any, authId: any) => Promise<{
        name: string;
        userId: any;
    }>;
    findContactNameFromNumber: (number: any, authId: any) => Promise<{
        name: any;
        contactId: any;
    }>;
    useArrayOfChildCallsToMakeChildCallLifeCycle: (arr: any) => Promise<any>;
    getNextNodeDetailsUsingTargetId(arr: any, targetId: any): any;
    getNextNodeTargetUsingSourceAndSourceHandle(arr: any, source: any, digit: any): any;
    useParentCallDetailsArrayToFormatDigits: (arr: any, FlowId: any) => {
        Digit: any;
        ivrName: any;
        pressedTime: any;
    }[];
    calculateQueueTimeForParticularCall: (arr: any) => any;
    useAuthIdToGetUserDetails: (authId: any) => Promise<(import("mongoose").Document<unknown, {}, import("../types/userPermissionUser").default> & Omit<import("../types/userPermissionUser").default & {
        _id: import("mongoose").Types.ObjectId;
    }, never>) | null>;
    calculateFinalStatus: (data: any) => string;
    checkTheChildIsFromSameParentCall: (parentCallSid: any) => Promise<{
        status: boolean;
        value: any;
    }>;
    getCountryCode: (input: any) => any;
    fetchUserIdFromConnectedChildCall: (data: any, direction?: any, userId?: any) => {
        status: boolean;
        userID: string;
    };
    replaceCallSidWithDocIdInTickets: (CallSid: string, ObjId: string) => void;
    addAssignUserToContact: (contactId: string, userId?: any) => Promise<void>;
    useConferenceDetailsToConvertData: (body: any) => Promise<void>;
    zohoIntegerationForParticularClient: (data: any) => Promise<unknown>;
    createCreditLog: (data: any, source: any, amount: any, companyId: any) => Promise<void>;
    deductBalanceFromCredits: (data: any, source: any, amount: number) => Promise<void>;
    checkDataFormatAndAddPlusToAllNumber: (data: any) => any;
    useNumberToFindDetailsOfCloudNumber: (number: any) => Promise<(import("mongoose").Document<unknown, {}, {
        [x: string]: any;
    }> & Omit<{
        [x: string]: any;
    } & Required<{
        _id: unknown;
    }>, never>)[]>;
    useNumberToFoundDetailsOfContacts: (number: any, AccountSid: any) => Promise<any>;
    useConferenceCallBackToUpdateRealTimeOfConference: (body: any) => Promise<void>;
    sendKillCallRequestToVibconnect: (callId: any, authId: any, authSecretId: any) => Promise<unknown>;
    killTheInitiatedCallIfCustomerHangUpCall: (parentCallSid: any, AccountSid: any) => Promise<void>;
    killAllCallsOfParellelCall: (listOfAgentsCallSid: any, AccountSid: any) => Promise<void>;
    saveDataToIvrStudiosCdr: (body: any) => Promise<void>;
    checkTheNumberContainsSymbolOrNOT(number: any): any;
    RecieveConferenceCallBacksAndSave(req: IRequest, res: IResponse): Promise<any>;
    extractAllNumberOfCorrespondingUser: (detailsOfNumbersFromUI: any) => Promise<any>;
    getNumberOfUserFromPreviousUserNumber: (detailsOfMPC: any, source: string, previousPhoneNumber: any) => Promise<any>;
    findNextNumberFromMoreThanOneMultiPartyCallNode: (multiPartyCallDetails: any, To: string, apiCallDetailsFromConference: any) => Promise<any>;
    getNextNumberFromMultipleArrayToCall(arr: any, customer: string, id?: string, apiCallDetailsFromConference?: any): any;
    getNextNumberToCall(arr: any, customer: string, priority?: number): any;
    checkCallerFormat(caller: string): string;
    checkCalledFormat(called: string): string;
    sendDetailsToCloudPhoneWebhook: (details: any, req: any) => Promise<void>;
    getDetailsOfAllParallelCall: (CallSidOfInProgressCall: any) => Promise<any>;
    ivrStudiosApiCallStatusCallbackForParallelCalling(req: IRequest, res: IResponse): Promise<any>;
    removeDuplicates: (arr: any, keyToFilter: any) => any;
    formatMultiPartyNodeDetailsForRoundRobin: (input: any, source: any, lastCalledNumber: any) => Promise<any>;
    ivrStudiosApiCallStatusCallback(req: IRequest, res: IResponse): Promise<any>;
    vibconnectMessage(req: IRequest, res: IResponse): Promise<any>;
    protected MakeConferenceCall(auth_id: string, authSecret_id: string, body: any): Promise<any>;
    getListOfConference(auth_id: string, authSecret_id: string): Promise<any>;
    endConference(auth_id: string, authSecret_id: string, conference_id: string): Promise<any>;
    ivrStudiosStatusCallback(req: IRequest, res: IResponse): Promise<any>;
    afterEndingCallFromParentSideSendFakeRequest: (dataFromConferenceWithSource: any) => Promise<void>;
    endConfernceUsingAuth: (authId: string, parentCallSid: string) => Promise<void>;
    getUserDetailsUsingAuthID: (authID: string) => Promise<(import("mongoose").Document<unknown, {}, import("../types/userPermissionUser").default> & Omit<import("../types/userPermissionUser").default & {
        _id: import("mongoose").Types.ObjectId;
    }, never>) | null>;
    removePlusSymbolFromNumber(number: string): string;
    checkDataIsValid: (data: any) => Promise<unknown>;
    checkIfRecordingExists: (callSid: string) => Promise<{}>;
    voicemailCallBack(req: IRequest, res: IResponse): Promise<any>;
    getConversationIdOfOutboundSms: (data: any) => Promise<{
        status: boolean;
        data: import("mongoose").Document<unknown, {}, import("../types/SMSMessageType").default> & Omit<import("../types/SMSMessageType").default & {
            _id: import("mongoose").Types.ObjectId;
        }, never>;
    } | {
        status: boolean;
        data: null;
    }>;
    getConversationIdOfInboundSms: (data: any) => Promise<{
        status: boolean;
        data: import("mongoose").Document<unknown, {}, import("../types/SMSConversationType").default> & Omit<import("../types/SMSConversationType").default & {
            _id: import("mongoose").Types.ObjectId;
        }, never>;
    } | {
        status: boolean;
        data: null;
    }>;
    getInboxDetailsFromCloudNumber: (data: any) => Promise<{
        status: boolean;
        data: import("mongoose").Document<unknown, {}, import("../types/InboxType").default> & Omit<import("../types/InboxType").default & {
            _id: import("mongoose").Types.ObjectId;
        }, never>;
    } | {
        status: boolean;
        data: null;
    }>;
    createMessage: (data: SMSMessageType) => Promise<false | import("mongoose").ModifyResult<import("mongoose").Document<unknown, {}, import("../types/SMSMessageType").default> & Omit<import("../types/SMSMessageType").default & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    checkAndCreateContact: (data: {
        number: string;
        authId: string;
    }) => Promise<{
        status: boolean;
        contact: any;
    }>;
    checkAndCreateConversation: (data: SMSConversationType) => Promise<false | import("mongoose").ModifyResult<import("mongoose").Document<unknown, {}, import("../types/SMSConversationType").default> & Omit<import("../types/SMSConversationType").default & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    sendSmsOverSocketToFrontend: (data: any, conversationId: any, socket: any) => Promise<void>;
    thiqMessage(req: IRequest, res: IResponse): Promise<any>;
}
export {};
//# sourceMappingURL=WebSocketController.d.ts.map