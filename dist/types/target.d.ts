import { Document } from 'mongoose';
export default interface targets extends Document {
    sip_password: string;
    monthly_cap: number;
    hourly_cap: number;
    is_daily: boolean;
    is_hourly: boolean;
    call_number: string;
    name: string;
    daily_cap: number;
    capon: string;
    max_concurrency: number;
    is_monthly: boolean;
    sip_endpoint: string;
    call_type: string;
    sip_username: string;
    yearly_cap: number;
    is_yearly: boolean;
    auth_id: string;
    authSecret_id: string;
    target_id: string;
    campaign_ids: string[];
}
//# sourceMappingURL=target.d.ts.map