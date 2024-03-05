import Controller from './Index';
import { IRequest, IResponse } from '../types/IExpress';
export default class UserRoleController extends Controller {
    constructor(models?: any);
    deleteUserRoleById(req: IRequest, res: IResponse): Promise<any>;
    updateUserRole(req: IRequest, res: IResponse): Promise<any>;
    createUserRole(req: IRequest, res: IResponse): Promise<any>;
    getUserRolesById(req: IRequest, res: IResponse): Promise<any>;
    getUserRoles(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=UserRoleController.d.ts.map