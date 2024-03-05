import { isValidMongoDbObjectId } from "../helper/index";
import { IRequest, IResponse } from "../types/IExpress";





const checkFormatOfId = async (req : IRequest , res : IResponse , next : any) : Promise<any> =>{
    const query = req.params.id;
    const isValidId = isValidMongoDbObjectId(query);

    if(!isValidId) {
        const response = {
            "data":[],
            "status":false,
            "message":"please check the id",
            "code":403
        }
      
        return res.status(403).json(response);
    }else{
        return next()
    }
}

export default checkFormatOfId