import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class WorkFlowController extends Controller {
    constructor(model?: any);
    ConvertSsmlToSpeech(req: IRequest, res: IResponse): Promise<any>;
    uploadAudio(req: IRequest | any, res: IResponse): Promise<any>;
    ConvertTextToSpeech(req: IRequest, res: IResponse): Promise<any>;
    getWorkFlows(req: IRequest, res: IResponse): Promise<IResponse>;
    updateWorkFlowById(req: IRequest, res: IResponse): Promise<IResponse>;
    deleteWorkFlowById(req: IRequest, res: IResponse): Promise<IResponse>;
    getWorkFlowById(req: IRequest, res: IResponse): Promise<IResponse>;
    createWorkFlow(req: IRequest, res: IResponse): Promise<IResponse>;
}
//# sourceMappingURL=WorkFlowController.d.ts.map