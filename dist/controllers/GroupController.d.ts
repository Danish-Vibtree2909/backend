import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class GroupController extends Controller {
    constructor(model?: any);
    getGroupById(req: IRequest, res: IResponse): Promise<any>;
    getGroup(req: IRequest, res: IResponse): Promise<any>;
    createGroup(req: IRequest, res: IResponse): Promise<any>;
    updateGroup(req: IRequest, res: IResponse): Promise<any>;
    deleteGroup(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=GroupController.d.ts.map