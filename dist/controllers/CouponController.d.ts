import Controller from './Index';
import { IRequest, IResponse } from '../types/IExpress';
export default class CouponController extends Controller {
    constructor(model?: any);
    findUnique: (arr: string[]) => string[];
    verifyAndPlan(req: IRequest, res: IResponse): Promise<any>;
    checkIfCouponValid(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=CouponController.d.ts.map