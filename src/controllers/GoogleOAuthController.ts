import { Request, Response } from "express";
import {
  // getGoogleOAuthTokens,
  getGoogleUser,
} from "../services/GoogleOAuthService";
import { getSingleUser } from "../services/userModel";
import { findOneAndUpdateUserStatus } from "../services/UserStatusModel";
import { createUserActivity } from "../services/UserActivityModel";
import jwt from "jsonwebtoken";
import * as config from "../config/index";
import { CreateTenantFromTiniyo , AddPayment} from "../services/Vibconnect/index";
import {createCompany} from '../services/companyModel';
import {createUser} from "../services/userModel";
import {createVibconnect} from '../services/vibconnectModel';
import { sendConfirmationMailUsingSendInBlue } from '../services/SendInBlue/index';

export async function googleOauthHandler(req: Request, res: Response) {
  const id_token = req.body.id_token as string;
  const access_token = req.body.access_token as string;

  try {
    // get the id and access token with the code provided by google
    // get the code from qs
    //   const code = req.query.code as string;
    // const { id_token, access_token } = await getGoogleOAuthTokens({ code });


    // get user with tokens
    const googleUser = await getGoogleUser({ id_token, access_token });

    if (!googleUser.verified_email) {
      const response = {
        data: [],
        status: true,
        code: 403,
        message: "Google account is not verified!",
      };

      return res.status(403).json(response);
    }

    // Check if the user exist.
    const query = { email: googleUser.email };
    const findUser: any = await getSingleUser(query);
    if (findUser) {
      //return findUser details with token

      const now = Date.now();
      const jwtData = {
        _id: findUser?._id, // important
        iat: now,
        authId: findUser?.auth_id,
        companyId: findUser?.company_id,
      };

      const jwtToken = jwt.sign(jwtData, config.jwtSecret, {
        expiresIn: "14d",
      });
      const refreshToken = jwt.sign(jwtData, config.jwtSecret, {
        expiresIn: "30d",
      });

      const dataForUserStatus = {
        authId: findUser.auth_id,
        status: "available",
        userId: findUser._id,
      };

      const dataToCreateAuditLogs = {
        auth_id: findUser.auth_id,
        user_id: findUser._id,
        type: "login",
      };

      const queryForUpdatingUserStats = { authId: findUser.auth_id };
      const options = { upsert: true };

      findOneAndUpdateUserStatus(
        queryForUpdatingUserStats,
        dataForUserStatus,
        options
      );
      createUserActivity(dataToCreateAuditLogs);

      const response = {
        data: {
          jwt_token: jwtToken,
          refresh_token: refreshToken,
          authId: findUser.auth_id,
          phone: findUser.phone ? findUser.phone : "",
          name: findUser.FirstName ? findUser.FirstName : "",
          _id: findUser?._id ? findUser?._id : "",
        },
        status: true,
        code: 200,
        message: "User found!",
      };
      return res.status(200).json(response);
    } else {
      //JWT data

      const response = {
        data: {},
        status: false,
        code: 403,
        message: "User not found!",
      };
      return res.status(402).json(response);
    }
  } catch (error) {
    const response = {
      data: [],
      status: true,
      code: 404,
      message: "Something went wrong!",
    };
    return res.status(200).json(response);
  }
}

export async function googleOauthRegisterHandler ( req : Request , res : Response){
  const id_token = req.body.id_token as string;
  const access_token = req.body.access_token as string;

  try {
    // get the id and access token with the code provided by google
    // get the code from qs
    //   const code = req.query.code as string;
    // const { id_token, access_token } = await getGoogleOAuthTokens({ code });


    // get user with tokens
    const googleUser = await getGoogleUser({ id_token, access_token });

    if (!googleUser.verified_email) {
      const response = {
        data: [],
        status: true,
        code: 403,
        message: "Google account is not verified!",
      };

      return res.status(403).json(response);
    }

    // Check if the user exist.
    const query = { email: googleUser.email };
    const findUser: any = await getSingleUser(query);
    if (findUser) {
      //return User already exist.
      const response = {
        data: [],
        status: false,
        code: 404,
        message: "User already exist!",
      };
      return res.status(404).json(response);
    } else {
      //Create a new User 

      const email = googleUser.email
      if(!email){

        return res.status(403).json({
          "data":[],
          "status":false,
          "code":403,
          "message":"Something wrong with email!"
        })
      }
      const name = googleUser.name ? googleUser.name : ""
      const photo = googleUser.picture ? googleUser.picture : ""

      // create account in vibconnect 
      const adminAuthId = config.VIBCONNECT_ADMIN!
      const adminAuthSecret = config.VIBCONNECT_SECRET!

      const random = Math.random().toString(36).substr(2, 25);
      const emailForVibconnect = `${random}@vibtree.com`
      const dataFromVibconnect = await CreateTenantFromTiniyo(adminAuthId , adminAuthSecret , emailForVibconnect)

      let tenantAuthId 
      let tenantAuthSecret

      if(dataFromVibconnect){

      const jsonDataFromVibconnect = JSON.parse(dataFromVibconnect)

      if(jsonDataFromVibconnect.status){
        if(jsonDataFromVibconnect.status === 'success'){
          tenantAuthId = jsonDataFromVibconnect.tenant.auth_id
          tenantAuthSecret = jsonDataFromVibconnect.tenant.auth_secret
          // add balance 
          const balance = 10 
          await AddPayment(tenantAuthId , balance )
          // Create a company and user in DB
          let companyName = `${name}'s Team`
          const companyDetails = {
            name : companyName , 
            email : email , 
            phone : "" 
          }

          const companyDetail : any = await createCompany(companyDetails)

          if(companyDetail){
                
            const companyId = companyDetail._id ? companyDetail._id : '';

            const formatted_data = {
              fullName : name, 
              username : email, 
              auth_id : tenantAuthId,
              auth_secret : tenantAuthSecret,
              email : email,
              is_verified : true,
              company_name :  companyDetail.name ? companyDetail.name  : '',
              user_type : "company",
              company_id : companyId,
              is_admin : true,
              FirstName : name,
              LastName : "",
              user_logo : photo,
              EmailInVibconnect : emailForVibconnect,
              country_allowed : req.body.country_allowed ? req.body.country_allowed : [{code:"IND",phone:"91"}],
              subscription_type : req.body.subscription_type ? req.body.subscription_type : ""
            }

            const responseOfCreateUser : any = await createUser(formatted_data) 
            if(responseOfCreateUser){
              const mailWhomToSend = 'cx@vibtree.com'
              const Subject = 'New Account Sign-Up'
              const CustomerEmail = email 
              const LastName = ""
              const FirstName = name
              const Type = 'business'
              const Country = 'India'
              const Company =   companyName 
              const Address = req.body.address ? req.body.address : "not provided"
              const phoneNumber = req.body.phone_number ? req.body.phone_number : "not provided"
              const dataForVibInfo = {
                authId : tenantAuthId,
                authSecret: tenantAuthSecret,
                createdBy : responseOfCreateUser._id,
                userId : responseOfCreateUser._id,
                companyId : companyId
              }
              await createVibconnect(dataForVibInfo)
              sendConfirmationMailUsingSendInBlue(mailWhomToSend , Subject , CustomerEmail , LastName ,FirstName , Type , Country , Company , Address , phoneNumber)

              const response = {
                "data" : responseOfCreateUser,
                "status" : true, 
                "code" : 201,
                "message" : 'User created!'
              }

              return res.status(201).json(response)
            }

        }
        }
      }
      
      
        const response = {
          data: {},
          status: false,
          code: 201,
          message: "User created!",
        };
        return res.status(201).json(response);
      }


      const response = {
        data: [],
        status: true,
        code: 404,
        message: "Something went wrong!",
      };
      return res.status(404).json(response);

    }
  } catch (error) {
    const response = {
      data: [],
      status: true,
      code: 404,
      message: "Something went wrong!",
    };
    return res.status(404).json(response);
  }
}
