import { Document } from 'mongoose';
export interface IConnected {
    code: number;
    phone: number;
}
export interface ICountryCode {
    code: string;
    label: string;
    phone: number;
}
export interface ICountryCodeString {
    code: string;
    label: string;
    phone: string;
}
export interface ICountryAllowed {
    code: string;
    phone: string;
}
export interface IForewardTo {
    countryCode: ICountryCode;
    lineNumber: number;
}
export interface IGreetings {
    audio: string;
    type: string;
}
export interface SingleNode {
    connected: IConnected;
    forwardTo: IForewardTo;
    TextForwarding: boolean;
    CallRecording: boolean;
    ShowCallerId: boolean;
    greetings: IGreetings;
    joined: string;
    used_for: string;
}
export default interface IvrStudios extends Document {
    xml_logic: Array<SingleNode>;
}
//# sourceMappingURL=ivrStudiosType.d.ts.map