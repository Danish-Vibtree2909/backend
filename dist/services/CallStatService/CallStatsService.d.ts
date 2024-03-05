import { CallStatSummary } from "./CallStat.types";
import { Socket } from "socket.io";
export type CallSource = 'All' | 'CallTracking' | 'CloudPhone' | 'LineForward' | 'IvrFlow';
type TimeFrame = 'This_Week' | 'Last_Week' | 'This_Month' | 'Last_Month' | 'Custom';
interface CallStateRequest {
    auth_id: string;
    callSource: CallSource;
    timeFrame: TimeFrame;
    startDate?: Date;
    endDate?: Date;
}
export declare function getStatForAccount(request: CallStateRequest): Promise<CallStatSummary[]>;
export declare function sendInitialSummary(socket: Socket, authId: string): void;
export declare function sendCustomSummary(socket: Socket, authId: string, startDate: string, endDate: string): void;
export {};
//# sourceMappingURL=CallStatsService.d.ts.map