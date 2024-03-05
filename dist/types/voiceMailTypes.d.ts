import { Document } from 'mongoose';
export default interface voiceMailType extends Document {
    usedFor: string;
    audioUrlBeforeRecording: string;
    audioUrlAfterRecording: string;
    voicemailMaxLength: string;
    voicemailBox: string;
    voicemailFinishOnKey: string;
    application_id: string;
    audioSourceFrom: string;
    connected: {
        code: number;
        phone: number;
    };
    isSendSms: boolean;
    smmDetails: {
        toType: string;
        senderID: string;
        message: string;
        carrier: string;
        toNumber?: [
            {
                number: string;
            }
        ];
    };
}
//# sourceMappingURL=voiceMailTypes.d.ts.map