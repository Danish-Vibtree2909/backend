import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class CustomeField extends Controller {
    constructor(models?: any);
    getCustomFieldById(req: IRequest, res: IResponse): Promise<any>;
    deleteCustomField(req: IRequest, res: IResponse): Promise<any>;
    checkIfKeyIsAlreadyExist(req: IRequest, res: IResponse): Promise<any>;
    getAllCustomField(req: IRequest, res: IResponse): Promise<any>;
    checkIfKeyIsThereInPayloadOrNot: (data: any) => boolean;
    createCustomField(req: IRequest, res: IResponse): Promise<any>;
    updateCustomField(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=CustomFieldController.d.ts.map