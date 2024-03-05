import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class SubscriptionController extends Controller {
    constructor(model?: any);
    getById(req: IRequest, res: IResponse): Promise<any>;
    deactiveCoupon: (coupons: string[], userId: any) => Promise<void>;
    activateSubscription(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=SubscriptionController.d.ts.map