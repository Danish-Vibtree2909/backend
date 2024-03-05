import { Document, } from 'mongoose'
export default interface CallTracking extends Document {
    AccountId: string;
    ParentCallId : string;
    CallType: string;
    //from of parent call
    Caller: string;
    CampaignId: string;
    CampaignName? : string;
    //to of initiated parent call
    TrackingNumber: string;
    //time stamp of initiated of parent call
    StartTime  : string;
    //to of last call back of child belongs to that parent call
    Route: string;
    RouteName?: string;
    RouteId?: string;
    //CallStatus of last callback of child call related to parent call
    CallStatus: string;
    CallDuration: string;
    Notes : string;
    Tags : string;
    CallCost : string;
    subscribeDate? : Date;
    //parent call timestamp
    PC_initiated : Date | string;
    PC_ringing : Date | string;
    PC_in_progress : Date | string;
    PC_completed : Date | string;
    PC_busy : Date | string;
    PC_failed : Date | string;
    PC_canceled : Date | string;
    //child call timestamp
    CC_initiated : Date | string;
    CC_ringing : Date | string;
    CC_in_progress : Date | string;
    CC_completed : Date | string;
    CC_busy : Date | string;
    CC_failed : Date | string;
    CC_canceled : Date | string;
}
