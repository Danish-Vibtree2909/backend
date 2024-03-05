import { IRequest, IResponse } from "../types/IExpress";
import auth from "../models/auth";
import * as config from "../config/index";
const jwt = require("jsonwebtoken");

// model
// import Register from '../models/register'
import UnauthorizedRequestException from "../exceptions/UnauthorizedRequestException";

/**
 * This function is a miidleware to authenticate the users.
 * @param  {IRequest} req
 * @param  {IResponse} res
 * @param  {any} next
 * @returns Promise
 */
const isAuth = async (
  req: IRequest,
  res: IResponse,
  next: any
): Promise<any> => {
  const token = req.headers.authorization;
  const jwtToken = req.headers['jwt-authorization']
  // console.log("Token : ", token)
  // console.log("JWT Token : ", jwtToken)


  if (!token) {
    // next(new UnauthorizedRequestException());
    return res.status(401).json({
      "code":401,
      "message":"User is unauthorized",
      "status":false
    })
  }

  const check = await auth.findOne({ api_token: token });

  if (!check) {
    const verify : any = await auth.findOne({ api_token_list:  [token] });
    if (!verify) {
      jwt.verify(token, config.jwtSecret, (err : any , verifiedJwt : any ): any  => {
        console.log("verified token : ", verifiedJwt)
        if (err) {
          return res.status(401).json({
            "code":401,
            "message":"User is unauthorized",
            "status":false
          })
        }
        return verifiedJwt;
      });
      // next(new UnauthorizedRequestException());
    }else{
      req.User = verify;
      return next();
    }
  }

  if(jwtToken){
    console.log("JWT token found")
    jwt.verify(jwtToken, config.jwtSecret, (err : any , verifiedJwt : any) => {
      console.log("Verified User : ", verifiedJwt)
      if (err) {
        next(new UnauthorizedRequestException());
      }
      return verifiedJwt;
    });
  }

  req.User = check!;
  return next();
};

export const jwtAuth = async (
  req: IRequest,
  res: IResponse,
  next: any
): Promise<any> => {
  const jwtToken = req.headers['jwt-authorization']
  //  console.log("JWT Token : ", jwtToken)


  if (!jwtToken) {
    // next(new UnauthorizedRequestException());
    return res.status(401).json({
      "code":401,
      "message":"User is unauthorized",
      "status":false
    })
  }else{
    jwt.verify(jwtToken, config.jwtSecret, (err : any , verifiedJwt: any) => {
      // console.log("Verified User : ", verifiedJwt)
      if (err) {
        return res.status(401).json({
          "code":401,
          "message":"User is unauthorized",
          "err":err,
          "status":false
        })
      }
      req.JWTUser = verifiedJwt;
      return next();
    });
  }
};

export default isAuth;
