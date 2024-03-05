import { Document } from 'mongoose';
export default interface IRealTimeUserTypes extends Document {
    AccountSid: string;
    AccountSecretId: string;
    To: string;
    From: string;
    ConferenceSid: string;
    FriendlyName: string;
    userID: any;
    UserStartTime: any;
    ParticipantCount: any;
    ContactStartTime: any;
    ContactId: any;
    ContactNumber: string;
    ContactName: string;
    ContactStatus: string;
    CloudNumber: string;
    ContactParticipantId: string;
    Tags: any;
    Notes: any;
}
//# sourceMappingURL=realTimeUserTypes.d.ts.map