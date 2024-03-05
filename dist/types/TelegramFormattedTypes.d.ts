import { Document } from 'mongoose';
export default interface TelegramRecordFormatted extends Document {
    token?: string;
    update_id?: number;
    Direction?: string;
    From?: string;
    To?: string;
    WaSid?: string;
    message: {
        message_id: any;
        from: {
            id: any;
            is_bot: boolean;
            first_name: string;
            last_name?: string;
            language_code: string;
        };
        chat: {
            id: any;
            first_name: string;
            type: string;
        };
        date: any;
        text: string;
        entities: any;
        messageBody?: string;
    };
}
//# sourceMappingURL=TelegramFormattedTypes.d.ts.map