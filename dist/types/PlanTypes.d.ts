import { Document } from 'mongoose';
export default interface PlansType extends Document {
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
    price_unit: string;
    credits: number;
    is_active: boolean;
    days: number;
    coupons_required: number;
    is_number_allowed: boolean;
    total_number: number;
    users_allowed: number;
}
//# sourceMappingURL=PlanTypes.d.ts.map