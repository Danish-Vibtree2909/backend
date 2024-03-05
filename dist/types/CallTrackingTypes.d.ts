import { Document } from 'mongoose';
export default interface CallTracking extends Document {
    AccountId: string;
    ParentCallId: string;
    CallType: string;
    Caller: string;
    CampaignId: string;
    CampaignName?: string;
    TrackingNumber: string;
    StartTime: string;
    Route: string;
    RouteName?: string;
    RouteId?: string;
    CallStatus: string;
    CallDuration: string;
    Notes: string;
    Tags: string;
    CallCost: string;
    subscribeDate?: Date;
    PC_initiated: Date | string;
    PC_ringing: Date | string;
    PC_in_progress: Date | string;
    PC_completed: Date | string;
    PC_busy: Date | string;
    PC_failed: Date | string;
    PC_canceled: Date | string;
    CC_initiated: Date | string;
    CC_ringing: Date | string;
    CC_in_progress: Date | string;
    CC_completed: Date | string;
    CC_busy: Date | string;
    CC_failed: Date | string;
    CC_canceled: Date | string;
}
//# sourceMappingURL=CallTrackingTypes.d.ts.map