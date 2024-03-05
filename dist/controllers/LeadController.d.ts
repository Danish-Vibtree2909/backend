import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class LeadController extends Controller {
    constructor(model?: any);
    createLead(req: IRequest, res: IResponse): Promise<any>;
    deleteLead(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=LeadController.d.ts.map