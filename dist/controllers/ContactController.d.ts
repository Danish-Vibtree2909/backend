import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class ContactController extends Controller {
    constructor(models?: any);
    downloadContactImage(req: IRequest | any, res: IResponse): Promise<any>;
    formatTheQueryToCheckDuplicatesBeforeInsert: (data: any) => any;
    insertManyContacts(req: IRequest, res: IResponse): Promise<any>;
    deleteManyContacts(req: IRequest, res: IResponse): Promise<any>;
    deleteContact(req: IRequest, res: IResponse): Promise<any>;
    updateImageOfContact(req: IRequest | any, res: IResponse): Promise<any>;
    updateOnlyBodyOfContact(req: IRequest, res: IResponse): Promise<any>;
    getContactById(req: IRequest, res: IResponse): Promise<any>;
    createContactFunction(req: IRequest | any, res: IResponse): Promise<any>;
}
//# sourceMappingURL=ContactController.d.ts.map