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
    SendDigits?: string;
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
    SendDigits?: string;
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
    toNumbers?: {
        number: string;
    }[];
    AuthId: string;
    AuthSecret: string;
    sendSmsName: string;
}
export declare function generateXmlForPlayNode(id: string, source: string, target: string, data: playNodeDetail): any;
export declare function generateXmlForIvrNode(id: string, source: string, target: string, data: ivrNodeDetail): any;
export declare function generateXmlForMultiPartyCallNode(id: string, source: string, target: string, data: multiPartyCallNodeDataInputs, dataFromVibconnect: dataFromVibconnectForIncoming): Promise<any>;
export declare function generateXmlForMessage(data: messageNodeDataInputs, dataFromVibconnect: dataFromVibconnectForIncoming): Promise<any>;
export declare function getOrCreateContact(data: dataFromVibconnectForIncoming): Promise<void>;
export declare function checkIsAgentIsAssignedToCustomer(customer: string, authId: string): Promise<{
    status: boolean;
    data: any;
}>;
export declare function makeCallToAssignedAgent(id: string, source: string, target: string, data: stickyAgentNodeDataType, dataFromVibconnect: dataFromVibconnectForIncoming, assignedTo: string): Promise<any>;
export declare function generateXMLForStickyAgentNode(id: string, source: string, target: string, data: stickyAgentNodeDataType, dataFromVibconnect: dataFromVibconnectForIncoming, connectors: connectorType[]): Promise<any>;
export {};
//# sourceMappingURL=callXmlGenerator.d.ts.map