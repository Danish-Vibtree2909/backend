import type { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

const catchAysncError= (fn: (arg0: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, arg1: Response<any, Record<string, any>>, arg2: NextFunction) => any)=>(req:Request,res:Response,next:NextFunction)=>{
        Promise.resolve(fn(req,res,next)).catch(next);
    };

export default catchAysncError;
    
