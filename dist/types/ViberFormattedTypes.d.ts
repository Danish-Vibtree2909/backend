import { Document } from 'mongoose';
export default interface ViberRecordFormatted extends Document {
    WaSid?: string;
    From?: string;
    To?: string;
    status?: [
        {
            seen: string;
            delivered: string;
            failed: string;
        }
    ];
    Direction?: string;
    timestamp: any;
    chat_hostname: string;
    message_token: number;
    sender?: {
        id: string;
        language: string;
        country: string;
        api_version: number;
        name: string;
    };
    user?: {
        id: string;
        language: string;
        country: string;
        api_version: number;
        name: string;
    };
    message?: {
        text: string;
        type: string;
    };
    event?: string;
    user_id?: string;
}
//# sourceMappingURL=ViberFormattedTypes.d.ts.map