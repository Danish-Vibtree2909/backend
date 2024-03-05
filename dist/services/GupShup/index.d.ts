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
    gupshupBaseUrl: string;
    constructor(model?: any);
    sendMessageWithoutTemplate(input: sendMessageInputType): Promise<unknown>;
    sendMessage(input: sendMessageInputType): Promise<unknown>;
    optetUser(input: optInputType): Promise<unknown>;
}
export {};
//# sourceMappingURL=index.d.ts.map