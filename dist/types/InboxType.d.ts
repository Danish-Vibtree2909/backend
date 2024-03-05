import { Document } from 'mongoose';
export default interface InboxType extends Document {
    AccountSid: string;
    UserId: [any];
    InboxType: string;
    InboxName: string;
    InboxIcon: string;
    data: any;
    companyId: any;
}
//# sourceMappingURL=InboxType.d.ts.map