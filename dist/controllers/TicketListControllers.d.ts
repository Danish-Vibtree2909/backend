import Controller from "./Index";
import { IRequest, IResponse } from '../types/IExpress';
import TicketTypes from '../types/TicketTypes';
import { SendFeedback } from '../helper/wowMomo';
interface authenticationForGupshupAndCustomerDetails {
    user_id: string;
    password: string;
    message: string;
    phone_number: string;
    buttonUrlParam?: string;
}
interface payloadForOptent {
    user_id: string;
    password: string;
    phone_number: string;
    message?: string;
}
export default class TicketListControllers extends Controller {
    constructor(model?: any);
    fetchTicketsForGupShup(req: IRequest | any, res: IResponse): Promise<any>;
    addVoiceToConversation(req: IRequest, res: IResponse): Promise<any>;
    getTicketsById(req: IRequest, res: IResponse): Promise<any>;
    buildQueryFromCustomVariable: (query: string) => {};
    getAllTickets(req: IRequest | any, res: IResponse): Promise<any>;
    updateNextTicketIdInConfig: (query: any, body: any) => Promise<void>;
    checkIfConfigIsPresentForParticularAccount: (data: TicketTypes) => Promise<{
        status: boolean;
        data: {};
        ticket_id?: undefined;
    } | {
        status: boolean;
        data: any;
        ticket_id: string;
    }>;
    verifiedNumberFromGupshup: (data: payloadForOptent) => Promise<any>;
    sendDataToWhatspp: (userDetails: authenticationForGupshupAndCustomerDetails) => Promise<any>;
    sendDataToWhatsppWithoutTemplate: (userDetails: authenticationForGupshupAndCustomerDetails) => Promise<any>;
    verifyThenSend: (tempObj: authenticationForGupshupAndCustomerDetails) => Promise<any>;
    verifyThenSendWithoutTemplate: (tempObj: authenticationForGupshupAndCustomerDetails) => Promise<any>;
    getValueFromCustomFields: (key: string, customVariables: any[]) => any;
    createFeedBack: (body: SendFeedback) => Promise<{
        status: boolean;
        data: any;
    }>;
    postTickets(req: IRequest, res: IResponse): Promise<any>;
    patchTickets(req: IRequest, res: IResponse): Promise<any>;
}
export {};
//# sourceMappingURL=TicketListControllers.d.ts.map