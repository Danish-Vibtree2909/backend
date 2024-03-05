import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class UserController extends Controller {
    constructor(models?: any);
    deleteUser(req: IRequest, res: IResponse): Promise<any>;
    changePasswordOnly(req: IRequest, res: IResponse): Promise<any>;
    reSendEmail(req: IRequest, res: IResponse): Promise<any>;
    verifyAndCreateUser(req: IRequest, res: IResponse): Promise<any>;
    inviteUser(req: IRequest, res: IResponse): Promise<any>;
    uploadCompanyLogo(req: IRequest | any, res: IResponse): Promise<any>;
    uploadUserLogo(req: IRequest | any, res: IResponse): Promise<any>;
    downloadUserLogo(req: IRequest | any, res: IResponse): Promise<any>;
    downloadCompanylogo(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=UserController.d.ts.map