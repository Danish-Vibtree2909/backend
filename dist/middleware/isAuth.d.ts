import { IRequest, IResponse } from "../types/IExpress";
/**
 * This function is a miidleware to authenticate the users.
 * @param  {IRequest} req
 * @param  {IResponse} res
 * @param  {any} next
 * @returns Promise
 */
declare const isAuth: (req: IRequest, res: IResponse, next: any) => Promise<any>;
export declare const jwtAuth: (req: IRequest, res: IResponse, next: any) => Promise<any>;
export default isAuth;
//# sourceMappingURL=isAuth.d.ts.map