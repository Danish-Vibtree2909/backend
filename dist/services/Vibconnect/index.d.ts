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
    SendDigits?: string;
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
    vibconnectBaseUrl: string;
    version: string;
    constructor(model?: any);
    sendMessage(authId: string, authSecretId: string, data: sendMessageBody): Promise<unknown>;
    makeCall(authId: string, authSecretId: string, data: makeCallInput): Promise<unknown>;
}
export declare function sendMessage(authId: string, authSecretId: string, data: sendMessageBody): Promise<unknown>;
export declare function makeCall(authId: string, authSecretId: string, data: makeCallInput): Promise<unknown>;
export declare function killParticularCall(callId: string, authId: string, authSecretId: string): Promise<unknown>;
export declare function endConference(auth_id: string, authSecret_id: string, conference_id: string): Promise<any>;
export declare function CreateTenantFromTiniyo(auth_id: string, authSecret_id: string, email: string): Promise<any>;
export declare function AddPayment(auth_id: string, body: number): Promise<any>;
export declare function BuyNumber(id: string, secret: string, number: string): Promise<any>;
export declare function handleHold(auth_id: string, authSecret_id: string, data: IHold): Promise<any>;
export {};
//# sourceMappingURL=index.d.ts.map