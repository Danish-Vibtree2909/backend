import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class VoiceMailBoxController extends Controller {
    constructor(models?: any);
    getVoiceMailRecordByName(req: IRequest, res: IResponse): Promise<any>;
    getAllVoiceMailBoxes(req: IRequest, res: IResponse): Promise<any>;
    getVoiceMailBoxById(req: IRequest, res: IResponse): Promise<any>;
    createVoiceMailBox(req: IRequest, res: IResponse): Promise<any>;
    updateVoiceMailBox(req: IRequest, res: IResponse): Promise<any>;
    deleteVoiceMailBox(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=VoicemailController.d.ts.map