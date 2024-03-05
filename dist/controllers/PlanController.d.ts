import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class PlanController extends Controller {
    constructor(model?: any);
    updatePlan(req: IRequest, res: IResponse): Promise<any>;
    getPlanById(req: IRequest, res: IResponse): Promise<any>;
    getAllPlans(req: IRequest, res: IResponse): Promise<any>;
    creatPlan(req: IRequest, res: IResponse): Promise<IResponse>;
}
//# sourceMappingURL=PlanController.d.ts.map