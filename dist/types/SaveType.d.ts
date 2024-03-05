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
    user_id: string;
}
export interface IGreetings {
    audio: string;
    type: string;
}
export default interface ISave extends Document {
    connected: IConnected;
    forwardTo: IForewardTo;
    TextForwarding: boolean;
    CallRecording: boolean;
    ShowCallerId: boolean;
    greetings: IGreetings;
    joined: string;
    used_for: string;
    url: string;
    waitUrl?: string;
    waitUrlText?: string;
    waitUrlSource?: string;
    pollyType?: string;
}
//# sourceMappingURL=SaveType.d.ts.map