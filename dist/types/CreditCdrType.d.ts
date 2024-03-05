import { Document } from 'mongoose';
export default interface CreditCdrInterface extends Document {
    createdAt: Date;
    companyId: any;
    amount: number;
    source: string;
    callId?: any;
    smsId?: any;
    numberId?: any;
}
//# sourceMappingURL=CreditCdrType.d.ts.map