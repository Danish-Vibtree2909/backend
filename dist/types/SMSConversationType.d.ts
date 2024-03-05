import { Document } from 'mongoose';
export default interface SMSConversationType extends Document {
    conversationId: string;
    lastMessageId: any;
    contactId: any;
    senderId: any;
    contactNumber: string;
    cloudNumber: string;
    companyId: any;
    createdAt: any;
    lastMessageAt: any;
    conversationType: string;
}
//# sourceMappingURL=SMSConversationType.d.ts.map