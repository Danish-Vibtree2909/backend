import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class AvailableCloudNumberController extends Controller {
    constructor(models?: any);
    checkStateNameAndReturnStateCode: (stateName: any) => string;
    fetchAllNumbersFromInventory(req: IRequest, res: IResponse): Promise<any>;
    purchaseNumberBasedOnSubscription(req: IRequest, res: IResponse): Promise<any>;
    fetchAllInternationalNumbers(req: IRequest, res: IResponse): Promise<any>;
    orderNumberFromThinqAndConfirm(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=AvailableNumberController.d.ts.map