import Controller from "./Index";
import { IRequest, IResponse } from '../types/IExpress';
import InboxType from "../types/InboxType";
interface ICalculateLoginTimeOfUserInput {
    status: boolean;
    data: {
        userId: string;
        status: string;
        name: string;
        avatar: string;
        number: string;
        login_time?: any;
        inbound_calls?: number;
        outbound_calls?: number;
        inbox_id?: string;
    }[];
}
export default class InboxController extends Controller {
    constructor(model?: any);
    filterOnlyVoiceInbox: (inboxes: any) => any;
    checkCapabilityOfNumber: (numbers: any) => any[];
    checkIfGivenNumberHasSmsInbox: (numbers: any, allInbox: any) => any;
    checkNumberCapabilityBeforeCreatinginbox(req: IRequest, res: IResponse): Promise<any>;
    getInboxById(req: IRequest, res: IResponse): Promise<any>;
    getAllInbox(req: IRequest, res: IResponse): Promise<any>;
    postInbox(req: IRequest, res: IResponse): Promise<any>;
    udateInbox(req: IRequest, res: IResponse): Promise<any>;
    deleteInbox(req: IRequest, res: IResponse): Promise<any>;
    calculateTheLoginTimeOfUser: (data: ICalculateLoginTimeOfUserInput) => Promise<{
        status: boolean;
        data: {
            userId: string;
            status: string;
            name: string;
            avatar: string;
            number: string;
            login_time: any;
            inbound_calls?: number | undefined;
            outbound_calls?: number | undefined;
            inbox_id?: string | undefined;
        }[];
    }>;
    checkIfSingleInboxContainMultipleUser: (data: any) => {
        id: any;
        name: any;
        avatar: any;
        number: any;
        inbox_id: any;
    }[];
    calculateTheStatusOfUser: (data: InboxType[]) => Promise<{
        status: boolean;
        data: {
            userId: any;
            status: any;
            name: any;
            avatar: any;
            number: any;
            inbox_id: any;
        }[];
    }>;
    calculateTheInboundCallCount: (data: ICalculateLoginTimeOfUserInput, startDate?: any, endDate?: any) => Promise<{
        status: boolean;
        data: {
            userId: string;
            status: string;
            name: string;
            avatar: string;
            number: string;
            login_time?: any;
            inbound_calls: number;
            outbound_calls?: number | undefined;
            inbox_id?: string | undefined;
        }[];
    }>;
    calculateTheOutboundCallCount: (data: ICalculateLoginTimeOfUserInput, startDate?: any, endDate?: any) => Promise<{
        status: boolean;
        data: {
            userId: string;
            status: string;
            name: string;
            avatar: string;
            number: string;
            login_time?: any;
            inbound_calls?: number | undefined;
            outbound_calls: number;
            inbox_id?: string | undefined;
        }[];
    }>;
    calculateDetailsAccordingToInbox(req: IRequest, res: IResponse): Promise<any>;
}
export {};
//# sourceMappingURL=InboxController.d.ts.map