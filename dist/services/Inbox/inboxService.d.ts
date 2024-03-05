import { CallSource } from "../CallStatService/CallStatsService";
type CallStatus = 'completed' | 'failed' | 'missed' | 'cancelled';
export interface InboxRequest {
    numbers?: string;
    caller?: string;
    forwardTo?: string;
    callStatus?: CallStatus[];
    tags?: string[];
    source: CallSource[];
    callTypes?: string[];
    page: number;
    pageSize: number;
}
export declare function getInbox(request: InboxRequest, accountId: string): Promise<never[] | {
    data: any[];
    count: any;
}>;
export {};
//# sourceMappingURL=inboxService.d.ts.map