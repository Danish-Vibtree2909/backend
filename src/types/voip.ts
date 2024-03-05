import VoiceResponse from 'twilio/lib/twiml/VoiceResponse'
import { Document, Schema } from 'mongoose'
export interface Say{
    options:VoiceResponse.SayAttributes | Schema.Types.ObjectId,
    value?: string
}

export interface Dial{
    options?:VoiceResponse.DialAttributes | Schema.Types.ObjectId,
    value?: string
}
export default interface IVoip extends Document {
    // eslint-disable-next-line camelcase
    user_id: string,
    say?: Say,
    play?: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessPlaygreater
        options?:VoiceResponse.PlayAttributes | Schema.Types.ObjectId,
        value?: string,
    },
    dial?: Dial,
    record?: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessRecordgreater
        value?:string,
        options?:VoiceResponse.RecordAttributes | Schema.Types.ObjectId
    },
    gather?: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessGathergreater
        value?:string,
        options?: VoiceResponse.GatherAttributes | Schema.Types.ObjectId
    },
    hangup?: boolean, // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessHangupgreater
    pause?: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessPausegreater
        options?:VoiceResponse.PauseAttributes | Schema.Types.ObjectId,
        value?:string
    },
    redirect?: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessRedirectgreater
        options?:VoiceResponse.RedirectAttributes | Schema.Types.ObjectId,
        value?: string
    },
    reject?: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessRejectgreater
        value?: string,
        options?: VoiceResponse.RejectAttributes | Schema.Types.ObjectId
    },
    number?: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessNumbergreater
        options?: VoiceResponse.NumberAttributes | Schema.Types.ObjectId
        value?: string
    },
    sip?: { // https://app.vibconnect.io/docs/#section/lessXMLgreater/lessSipgreater
        options?:VoiceResponse.SipAttributes | Schema.Types.ObjectId
    }
}
