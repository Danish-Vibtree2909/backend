import Controller from './Index';
import { IRequest, IResponse } from '../types/IExpress';
export default class AppConfigController extends Controller {
    constructor(model?: any);
    getMyConfigAppConfig(req: IRequest, res: IResponse): Promise<any>;
    getAppConfig(req: IRequest, res: IResponse): Promise<any>;
    createAppConfig(req: IRequest, res: IResponse): Promise<any>;
    updateAppConfig(req: IRequest, res: IResponse): Promise<any>;
    deleteAppConfig(req: IRequest, res: IResponse): Promise<any>;
    getAppConfigById(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=AppConfigControllers.d.ts.map