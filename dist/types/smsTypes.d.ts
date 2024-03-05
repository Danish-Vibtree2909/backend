import { Document } from 'mongoose';
export default interface sms extends Document {
    sid: string;
    date_created: string;
    date_updated: string;
    date_sent: string;
    account_sid: string;
    to: string;
    from: string;
    messaging_service_sid: string;
    body: string;
    status: string;
    num_segments: string;
    num_media: string;
    direction: string;
    api_version: string;
    price: string;
    price_unit: string;
    error_code: string;
    error_message: string;
    uri: string;
    subresource_uris: {
        media: string;
    };
}
//# sourceMappingURL=smsTypes.d.ts.map