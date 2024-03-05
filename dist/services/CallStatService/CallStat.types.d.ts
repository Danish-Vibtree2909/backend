import { CallSource } from "./CallStatsService";
export interface CallStatForDate {
    callDate: string;
    callStatus: string;
    total: number;
    total_inbound: number;
    total_outbound: number;
    CallerType: string;
}
export interface CallStatSummary {
    callDate: string;
    allCalls: number;
    connectedCalls: number;
    outboundCalls: number;
    inboundCalls: number;
    missedCalls: number;
    failedCalls: number;
    repeatCalls: number;
    firstTimeCalls: number;
}
export interface CallSummaryWithLastPeriod {
    source: CallSource;
    current: CallStatSummary[];
    previous: CallStatSummary[];
}
//# sourceMappingURL=CallStat.types.d.ts.map