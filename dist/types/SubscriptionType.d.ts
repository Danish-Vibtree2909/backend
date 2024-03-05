import { Document } from "mongoose";
export default interface SubscriptionTypes extends Document {
    isActive: Boolean;
    package: string;
    name: string;
    price: number;
    userId: any;
    features?: [
        {
            name: string;
            allowed: boolean;
            total_consumed: number;
            total_allowed: number;
        }
    ];
    startDate: any;
    endDate: any;
    company_id: any;
    user_id: any;
    createdAt: any;
    isExpired: boolean;
    paymentId: string;
    isFuturePlan: boolean;
    credits: number;
}
//# sourceMappingURL=SubscriptionType.d.ts.map