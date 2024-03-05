import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class VoiceController extends Controller {
    constructor(model?: any);
    filterVoiceCdr(req: IRequest, res: IResponse): Promise<any>;
    calculateCallStatusStats(req: IRequest, res: IResponse): Promise<any>;
    updateVoiceCdrById(req: IRequest, res: IResponse): Promise<any>;
    getVoiceCdrById(req: IRequest, res: IResponse): Promise<any>;
    getVoiceCdr(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=VoiceControllers.d.ts.map