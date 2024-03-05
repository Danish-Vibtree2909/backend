import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import { Document, Schema } from 'mongoose';
export interface Say {
    options: VoiceResponse.SayAttributes | Schema.Types.ObjectId;
    value?: string;
}
export interface Dial {
    options?: VoiceResponse.DialAttributes | Schema.Types.ObjectId;
    value?: string;
}
export default interface IVoip extends Document {
    user_id: string;
    say?: Say;
    play?: {
        options?: VoiceResponse.PlayAttributes | Schema.Types.ObjectId;
        value?: string;
    };
    dial?: Dial;
    record?: {
        value?: string;
        options?: VoiceResponse.RecordAttributes | Schema.Types.ObjectId;
    };
    gather?: {
        value?: string;
        options?: VoiceResponse.GatherAttributes | Schema.Types.ObjectId;
    };
    hangup?: boolean;
    pause?: {
        options?: VoiceResponse.PauseAttributes | Schema.Types.ObjectId;
        value?: string;
    };
    redirect?: {
        options?: VoiceResponse.RedirectAttributes | Schema.Types.ObjectId;
        value?: string;
    };
    reject?: {
        value?: string;
        options?: VoiceResponse.RejectAttributes | Schema.Types.ObjectId;
    };
    number?: {
        options?: VoiceResponse.NumberAttributes | Schema.Types.ObjectId;
        value?: string;
    };
    sip?: {
        options?: VoiceResponse.SipAttributes | Schema.Types.ObjectId;
    };
}
//# sourceMappingURL=voip.d.ts.map