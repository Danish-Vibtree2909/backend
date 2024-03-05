import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class BlocklistController extends Controller {
    constructor(model?: any);
    getBlockList(req: IRequest, res: IResponse): Promise<any>;
    createBlockList(req: IRequest, res: IResponse): Promise<any>;
    updateBlockList(req: IRequest, res: IResponse): Promise<any>;
    deleteBlocklist(req: IRequest, res: IResponse): Promise<any>;
    getBlockListById(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=BlocklistController.d.ts.map