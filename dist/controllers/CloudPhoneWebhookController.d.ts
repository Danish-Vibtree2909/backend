import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
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
    constructor(model?: any);
    checkTheNumberContainsSymbolOrNOT(number: any): any;
    filterDataAccordingToConferenceAndSendToUi: (callback: any, io: any, type: any, conferenceDetails: any) => Promise<void>;
    sendFakeCompletedToUIOnly: (data: any, io: any) => Promise<void>;
    updateTransferredCallWithDisconnectedCall: (data: any, currentCall?: any) => Promise<void>;
    killInitiatedCallIfConferenceEnd: (data: Conference) => Promise<void>;
    sendCompletedDataToUiInTalkFirst: (data: any, io: any) => Promise<void>;
    cloudPhoneConferenceWebhook(req: IRequest, res: IResponse): Promise<any>;
    cloudPhoneConferenceAndCallWebhookForWebRtc(req: IRequest, res: IResponse): Promise<any>;
    handleTransferCallback: (callback: any, io: any) => Promise<void>;
    handleHangupTransferCall: (data: any) => Promise<unknown>;
    deleteTransferredCallLogsFromRealtime: (data: any) => Promise<void>;
    updateTransferredCallInConferenceForInbound: (currentCallDetails: any, transferCallBack: any) => Promise<void>;
    findPreviousCallFromCurrentCallDetails: (data: any) => Promise<void>;
    disconnectTransferrerCall: (data: any) => Promise<void>;
    addTransferTypeInCallBack: (data: CallData) => Promise<void>;
    cloudPhoneTransferWebhook(req: IRequest, res: IResponse): Promise<any>;
}
export {};
//# sourceMappingURL=CloudPhoneWebhookController.d.ts.map