import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class PowerDialerController extends Controller {
    constructor(models?: any);
    getByIdPowerDialerVersionTwo(req: IRequest, res: IResponse): Promise<any>;
    filterOnlyIdFromDocument: (data: any) => any;
    insertManyPowerDialerVersionTwo(req: IRequest, res: IResponse): Promise<any>;
    deleteManyPowerDialerVersionTwo(req: IRequest, res: IResponse): Promise<any>;
    deletePowerDialerVersionTwo(req: IRequest, res: IResponse): Promise<any>;
    updatePowerDialerVersionTwo(req: IRequest, res: IResponse): Promise<any>;
    createPowerDialerVersionTwo(req: IRequest, res: IResponse): Promise<any>;
    getPowerDialerStatusVersionTwo(req: IRequest, res: IResponse): Promise<any>;
    getPowerDialerVersionTwo(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=PowerDialerController.d.ts.map