import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class BlocklistController extends Controller {
    constructor(model?: any);
    getAllies(req: IRequest, res: IResponse): Promise<any>;
    createAllies(req: IRequest, res: IResponse): Promise<any>;
    updateAllies(req: IRequest, res: IResponse): Promise<any>;
    deleteAllies(req: IRequest, res: IResponse): Promise<any>;
    getAlliesById(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=AlliesController.d.ts.map