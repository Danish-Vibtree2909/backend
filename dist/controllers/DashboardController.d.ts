import Controller from './Index';
import { IRequest, IResponse } from '../types/IExpress';
export default class DashboardController extends Controller {
    constructor(model?: any);
    dashBoardCallStats(req: IRequest, res: IResponse): Promise<any>;
    calculateDurationStats: (data: any) => {
        totalConnectedChildCallDuration: number;
        totalParentCallDuration: number;
        totalQueueCallDuration: number;
        totalNoOfCalls: any;
        totalChildCalls: any;
    };
    hourlyCallStats(req: IRequest, res: IResponse): Promise<any>;
    calculateHourlyStats: (data: any, timeZone: any) => {
        label: string;
        value: number;
    }[];
}
//# sourceMappingURL=DashboardController.d.ts.map