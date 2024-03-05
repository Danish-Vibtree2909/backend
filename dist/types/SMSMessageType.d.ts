import { Document } from 'mongoose';
export default interface SMSMessageType extends Document {
    conversationId: any;
    messageId: any;
    contactNumber: string;
    cloudNumber: string;
    createdAt: any;
    direction: string;
    status: string;
    messageType: string;
    conversationType: string;
    messageBody: string;
    isTemplate: boolean;
    peId?: string;
    senderId?: string;
    templateId?: string;
    tempId?: string;
    provider: string;
}
//# sourceMappingURL=SMSMessageType.d.ts.map