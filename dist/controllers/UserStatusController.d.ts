import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class UserStatusController extends Controller {
    constructor(model?: any);
    getStatuOfOwn(req: IRequest, res: IResponse): Promise<IResponse>;
    getUserById(req: IRequest, res: IResponse): Promise<IResponse>;
    getAllUserStatus(req: IRequest, res: IResponse): Promise<any>;
    postUserStatus(req: IRequest, res: IResponse): Promise<any>;
    udateUserStatus(req: IRequest, res: IResponse): Promise<any>;
    deleteUserStatus(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=UserStatusController.d.ts.map