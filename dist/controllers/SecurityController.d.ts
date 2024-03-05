import Controller from "./Index";
import { IResponse, IRequest } from "../types/IExpress";
export default class SecurityController extends Controller {
    constructor(model?: any);
    editNumberInWorkFlow: (authId: string, number: string, userId: string) => Promise<void>;
    editUser(req: IRequest, res: IResponse): Promise<any>;
    RegisterVersionTwo(req: IRequest, res: IResponse): Promise<any>;
    checkIfValueExistInUserDB(req: IRequest, res: IResponse): Promise<any>;
    sendOtpToPhoneNumber(req: IRequest, res: IResponse): Promise<any>;
    changePassword(req: IRequest, res: IResponse): Promise<any>;
    verifyOTP(req: IRequest, res: IResponse): Promise<any>;
    sendOtpToMail(req: IRequest, res: IResponse): Promise<any>;
    LogoutVersionTwo(req: IRequest, res: IResponse): Promise<any>;
    LoginVersionTwo(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=SecurityController.d.ts.map