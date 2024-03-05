import Controller from "./Index";
import { IResponse, IRequest } from "../types/IExpress";
import { getSingleUser , findOneAndUpdateUser , countUserDocuments , createUser} from "../services/userModel";
import { validatePassword , hashPassword } from "../helper/index";
import * as config from "../config/index";
const jwt = require("jsonwebtoken");
import { createUserActivity } from "../services/UserActivityModel";
import { findOneAndUpdateUserStatus } from "../services/UserStatusModel";
import { sendMailUsingSendInBlue , sendConfirmationMailUsingSendInBlue } from '../services/SendInBlue/index';
import { sendMessage , CreateTenantFromTiniyo , AddPayment} from "../services/Vibconnect/index";
import {createCompany} from '../services/companyModel';
import {createVibconnect} from '../services/vibconnectModel';
import ivrFlowUIModel from '../models/ivrFlowUIModel';
import logger from '../config/logger'

interface ILogin {
  email_address: string;
  password: string;
}

let emailList = new Map()

export default class SecurityController extends Controller {
  public constructor(model?: any) {
    super(model);
    this.LoginVersionTwo = this.LoginVersionTwo.bind(this);
    this.LogoutVersionTwo = this.LogoutVersionTwo.bind(this);
    this.sendOtpToMail = this.sendOtpToMail.bind(this)
    this.verifyOTP = this.verifyOTP.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.sendOtpToPhoneNumber = this.sendOtpToPhoneNumber.bind(this)
    this.checkIfValueExistInUserDB = this.checkIfValueExistInUserDB.bind(this)
    this.RegisterVersionTwo = this.RegisterVersionTwo.bind(this)
    this.editUser = this.editUser.bind(this)
  }

  editNumberInWorkFlow = async (authId : string , number : string , userId : string ) =>{
    try{
      const response = await ivrFlowUIModel.bulkWrite([
        {
          updateMany: {
            filter: { "auth_id": authId },
            update: { $set: { "input.$[elem].data.mpcCallUsingNumbers.$[userElem].number": number } },
            arrayFilters: [
              { "elem.type": "MultiPartyCallNode" },
              { "userElem.userId": userId }
            ]
          }
        }
      ])
      
      console.log("Response : ", response)
    }catch(err:any){
      logger.error('Error in updating number of user in work flow : '+ JSON.stringify(err))
    }
  }

  public async editUser ( req : IRequest , res : IResponse ) : Promise<any>{

    if( req.body.password){
      this.data = []
      this.code = 403
      this.message = 'You cannot update password!'
      this.status = false

      return res.status(403).json(this.Response())
    }

    const userId = req.JWTUser?._id;
    const query = {_id : userId}
    const updates = {...req.body}
    const options = {upsert : false}

    if(req.body.phone){
      await this.editNumberInWorkFlow( req.JWTUser?.authId! , req.body.phone , userId!)
    }

    const responseAfterUpdates = await findOneAndUpdateUser(query , updates , options)
    // console.log("Response : ", responseAfterUpdates)
    if(responseAfterUpdates){

      this.data = []
      this.code = 204
      this.status = true
      this.message = 'User updated!'

      return res.status(200).json(this.Response())
    }else{

      this.data = []
      this.code = 404
      this.message = 'Something went wrong!'
      this.status = false

      return res.status(404).json(this.Response())
    }
  }

  public async RegisterVersionTwo ( req : IRequest , res : IResponse ) : Promise<any>{
    const firstName = req.body.firstName ? req.body.firstName : '';
    const lastName = req.body.lastName ? req.body.lastName : '';
    const email = req.body.email
    const phone = req.body.phone ? req.body.phone : ''
    const token = req.body.token 
    const password = req.body.password ? req.body.password  : "Vibtree@123"

    if(!token){
      this.data = []
      this.code = 401
      this.status = false
      this.message = 'Unauthorized to create account try again!'

      return res.status(401).json(this.Response())
    }

    if(!email){

      this.data = []
      this.code = 403
      this.status = false
      this.message = 'Provide email!'

      return res.status(403).json(this.Response())
    }

    let companyName = `${firstName}'s Team`

    jwt.verify(token , config.jwtSecret , async (err : any , verifiedJwt : any )=>{

      if (err) {
        return res.status(401).json({
          "code":401,
          "message":"User is unauthorized",
          "err":err,
          "status":false
        })
      }

      const companyDetails =   {
        name : companyName , 
        email : email , 
        phone : phone 
      }
      const random = Math.random().toString(36).substr(2, 25);
      const emailForVibconnect = `${random}@vibtree.com`
  
  
      const adminAuthId = config.VIBCONNECT_ADMIN!
      const adminAuthSecret = config.VIBCONNECT_SECRET!
      
      const dataFromVibconnect = await CreateTenantFromTiniyo(adminAuthId , adminAuthSecret , emailForVibconnect)
  
      let tenantAuthId 
      let tenantAuthSecret
  
      if(dataFromVibconnect){
        const jsonDataFromVibconnect = JSON.parse(dataFromVibconnect)
        if(jsonDataFromVibconnect.status){
         
          if(jsonDataFromVibconnect.status === 'success'){
            tenantAuthId = jsonDataFromVibconnect.tenant.auth_id
            tenantAuthSecret = jsonDataFromVibconnect.tenant.auth_secret
  
            console.log("Tenant credentials : ", tenantAuthId , tenantAuthSecret )
  
            const balance = 10 
            await AddPayment(tenantAuthId , balance )
  
            //Create Company
  
            const companyDetail : any = await createCompany(companyDetails)
            if(companyDetail){
                
                const companyId = companyDetail._id ? companyDetail._id : '';
                const hashedPassword = await hashPassword(password)
  
                const formatted_data = {
                  fullName : firstName + " " + lastName, 
                  username : email, 
                  auth_id : tenantAuthId,
                  auth_secret : tenantAuthSecret,
                  email : email,
                  is_verified : true,
                  company_name :  companyDetail.name ? companyDetail.name  : '',
                  user_type : "company",
                  phone: phone,
                  password : hashedPassword,
                  company_id : companyId,
                  is_admin : true,
                  FirstName : firstName,
                  LastName : lastName,
                  EmailInVibconnect : emailForVibconnect,
                  country_allowed : req.body.country_allowed ? req.body.country_allowed : [{code:"IND",phone:"91"}],
                  subscription_type : req.body.subscription_type ? req.body.subscription_type : ""
                }
  
                const responseOfCreateUser : any = await createUser(formatted_data) 
                if(responseOfCreateUser){
                  const mailWhomToSend = 'cx@vibtree.com'
                  const Subject = 'New Account Sign-Up'
                  const CustomerEmail = email 
                  const LastName = lastName
                  const FirstName = firstName ? firstName : "FirstName"
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
                  this.data = responseOfCreateUser;
                  this.status = true 
                  this.code = 201
                  this.message = 'User created!'
    
                  return res.status(201).json(this.Response())
                }
  
            }
          }
          
        }
        console.log("Data From Vibconnect : ", dataFromVibconnect , lastName)
      }

      return res.status(404).json({message : "Something went wrong!" , status : false , data : [], code : 404})

    })
  }

  public async checkIfValueExistInUserDB ( req : IRequest , res : IResponse ): Promise<any>{

    let queryToFindUser : any 
    if(req.query.email){
       queryToFindUser = { email : req.query.email }
    }else if(req.query.phone){
       queryToFindUser = { phone : req.query.phone }
    }

    const isPresent = await countUserDocuments(queryToFindUser)
    if(!isPresent){

      this.message = 'Data not found!'
      this.status = false
      this.code = 404
      this.data = []

      return res.status(404).json(this.Response())
    }else{

      this.message = 'Data found!'
      this.status = true
      this.code = 200
      this.data = []

      return res.status(200).json(this.Response())
    }
  }


  public async sendOtpToPhoneNumber ( req : IRequest , res : IResponse ) : Promise<any>{
    const number = req.body.phone
    if(!number){

      this.data = []
      this.status = false
      this.code = 403
      this.message = 'Provide phone!'

      return res.status(403).json(this.Response())
    }
    const queryForUser = {phone : number}
    const isUserPresent = await getSingleUser(queryForUser)
    if(isUserPresent){

      const otp : number = Math.floor(100000 + Math.random() * 900000)

      
      const AccountSid = config.AUTH_ID_FOR_OTP!
      const AuthSecret  = config.AUTH_SECRET_FOR_OTP!
      const dataOfAccountToSendOtp = {
        "From" : "VIB033",
        "To" : `+${number}`,
        "Body": `Your OTP is ${otp} \n\nTeam Vibtree`
      }
    
      
      const messageResponse : any = await sendMessage(AccountSid , AuthSecret , dataOfAccountToSendOtp )
    
      emailList.set(number , otp)

      setTimeout(()=>{
          emailList.delete(number)
      }, 300000)

      this.data = messageResponse
      this.code = 200
      this.status = true
      this.message = 'OTP SEND SUCCESSFULLY'
  
      return res.status(200).json(this.Response())

    }else{

      this.data = []
      this.status = false
      this.code = 401
      this.message = "No user with this phone number is present!"

      return res.status(401).json(this.Response())
    }
  }

  public async changePassword ( req : IRequest , res : IResponse ) : Promise<any>{

    const email = req.body.email
    const password = req.body.password
    const phone = req.body.Phone
    const jwtToken = req.body.token

    if(!password){
      this.data = []
      this.code = 403
      this.status = false
      this.message = 'Provide password!'

      return res.status(403).json(this.Response())
    }

    if (!jwtToken) {
      // next(new UnauthorizedRequestException());
      return res.status(401).json({
        "code":401,
        "message":"User is unauthorized",
        "status":false
      })
    }else{
      jwt.verify( jwtToken , config.jwtSecret , async (err : any , verifiedJwt : any)=>{
        console.log("verify 108 : ",verifiedJwt)
        if (err) {
          return res.status(401).json({
            "code":401,
            "message":"User is unauthorized",
            "err":err,
            "status":false
          })
        }

        if(email){
          let queryForUser = { email: email };
          const findUser = await getSingleUser(queryForUser);
      
          if (!findUser) {
            this.status = false;
            this.code = 401;
            this.message = "No User exist with this email address";
      
            return res.status(401).json(this.Response());
          }
      
          const newHashedPassword = await hashPassword(password)
          const updates = { password : newHashedPassword}
          const options = {upsert : false}
      
          const responseAfterUpdate = await findOneAndUpdateUser(queryForUser , updates , options )
      
          if(responseAfterUpdate){
      
            this.data = []
            this.code = 204
            this.status = true
            this.message = "Password updated!"
      
            return res.status(200).json(this.Response())
          }else{
            this.data = []
            this.code = 404
            this.status = false
            this.message = 'Something went wrong!'
      
            return res.status(403).json(this.Response())
          }
        }else if(phone){
          let queryForUser = { phone : phone };
          const findUser = await getSingleUser(queryForUser);
      
          if (!findUser) {
            this.status = false;
            this.code = 401;
            this.message = "No User exist with this email address";
      
            return res.status(401).json(this.Response());
          }
      
          const passwordmatch = await validatePassword(
            password,
            findUser.password
          );
      
          if (passwordmatch) {
            this.status = false;
            this.data = [];
            this.message = "New password cannot be same as previous";
            return res.status(403).send(this.Response());
          }
          const newHashedPassword = await hashPassword(password)
          const updates = { password : newHashedPassword}
          const options = {upsert : false}
      
          const responseAfterUpdate = await findOneAndUpdateUser(queryForUser , updates , options )
      
          if(responseAfterUpdate){
      
            this.data = []
            this.code = 204
            this.status = true
            this.message = "Password updated!"
      
            return res.status(200).json(this.Response())
          }else{
            this.data = []
            this.code = 404
            this.status = false
            this.message = 'Something went wrong!'
      
            return res.status(403).json(this.Response())
          }
        }else{
          this.data = []
          this.code = 404
          this.status = false
          this.message = 'Something went wrong!'
    
          return res.status(403).json(this.Response())
        }

      })
    }
  }

  public async verifyOTP ( req : IRequest , res : IResponse ) : Promise<any>{
    const otp = req.body.otp
    const email = req.body.email
    const phone = req.body.phone

    if(email){
      const isVerified = emailList.get(email)
      
      if(isVerified){

        if(isVerified === otp){
          const jwtData = {email : email}
          const jwtToken = jwt.sign(jwtData , config.jwtSecret, {expiresIn : '300s'})
          emailList.delete(email)
          this.data = {token : jwtToken}
          this.status = true
          this.code = 200
          this.message = "Otp Verified!"
          
          return res.status(200).json(this.Response())
  
        }else{
          this.data = []
          this.status = false
          this.code = 401
          this.message = "OTP not verified!"
      
          return res.status(401).json(this.Response())
        }
      }else{
        this.data = []
        this.status = false
        this.code = 401
        this.message = "Check e-mail!"
    
        return res.status(401).json(this.Response())
      }
    }else if(phone){
      const isVerified = emailList.get(phone)
    
      if(isVerified){

        if(isVerified === otp){

          //Login process
          const queryForUser = { phone: phone };
          const findUser = await getSingleUser(queryForUser);
      
          if (!findUser) {
            this.status = false;
            this.code = 401;
            this.message = "No User exist with this email address";
      
            return res.status(401).json(this.Response());
          }
    
      
          const now = Date.now();
          const data = {
            _id: findUser?._id, // important
            iat: now,
            authId: findUser?.auth_id,
            companyId: findUser?.company_id,
          };
      
          const jwtToken = jwt.sign(data, config.jwtSecret, { expiresIn: "14d" });
          const refreshToken = jwt.sign(data, config.jwtSecret, { expiresIn: "30d" });
      
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
      
          this.data = {
            jwt_token: jwtToken,
            refresh_token: refreshToken,
            authId: findUser.auth_id,
            phone: findUser.phone ? findUser.phone : "",
            name: findUser.FirstName ? findUser.FirstName : "",
            _id: findUser?._id ? findUser?._id : "" 
          };
          this.message = "User successfully found.";
          this.code = 200;
          this.status = true;
      
          return res.status(200).json(this.Response()); 
          //-------------
          // const jwtData = {phone : phone}
          // const jwtToken = jwt.sign(jwtData , config.jwtSecret, {expiresIn : '300s'})
          // emailList.delete(phone)
          // this.data = {token : jwtToken}
          // this.status = true
          // this.code = 200
          // this.message = "Otp Verified!"
      
          // return res.status(200).json(this.Response())
  
        }else{
          this.data = []
          this.status = false
          this.code = 401
          this.message = "OTP not verified!"
      
          return res.status(401).json(this.Response())
        }
      }else{
        this.data = []
        this.status = false
        this.code = 401
        this.message = "Check phone number!"
    
        return res.status(401).json(this.Response())
      }
    }else{
      this.data = []
      this.status = false
      this.code = 401
      this.message = "Something went wrong!"
  
      return res.status(401).json(this.Response())
    }
  }

  public async sendOtpToMail ( req : IRequest , res : IResponse) : Promise<any>{
    const email = req.body.email
    const otp : number = Math.floor(100000 + Math.random() * 900000)

    const emailData = {"email": email, "otp": otp}
    console.log("email send data in send otp ", emailData)
    const content = otp.toString();
    const name = "VIB-OTP"

    try{
        const mail_data = await sendMailUsingSendInBlue(email , "Vib-CRM verification", content , name)
        console.log("mail data ", mail_data)
    
        emailList.set(email , otp)

        setTimeout(()=>{
            emailList.delete(email)
        }, 300000)
    
        this.data = mail_data
        this.code = 200
        this.status = true
        this.message = 'OTP SEND SUCCESSFULLY'
    
        return res.status(200).json(this.Response())
    }catch(err){
        this.data = []
        this.code = 404
        this.status = false
        this.message = 'Something went wrong!'
    
        return res.status(404).json(this.Response())
    }

  }

  public async LogoutVersionTwo(req: IRequest, res: IResponse): Promise<any> {
    const auth_id = req.body.authId;
    const _id = req.body.userId;

    if(!auth_id){
        this.status = false;
        this.code = 403;
        this.message = "Please provide auth_id!";
        this.data = [];
  
        return res.status(403).json(this.Response());
    }

    if(!_id){
        this.status = false;
        this.code = 403;
        this.message = "Please provide user id!";
        this.data = [];
  
        return res.status(403).json(this.Response());
    }

    const dataForUserStatus = {
      authId: auth_id,
      status: "away",
      userId: _id,
    };

    const dataToCreateAuditLogs = {
      auth_id: auth_id,
      user_id: _id,
      type: "logout",
    };

    const queryForUpdatingUserStats = { authId: auth_id };
    const options = { upsert: true };

    findOneAndUpdateUserStatus(
      queryForUpdatingUserStats,
      dataForUserStatus,
      options
    );
    createUserActivity(dataToCreateAuditLogs);

    this.status = true;
    this.data = [];
    this.message = "User successfully Logout!";
    this.code = 200;

    return res.status(200).json(this.Response());
  }

  public async LoginVersionTwo(req: IRequest, res: IResponse): Promise<any> {
    const body: ILogin = req.body;

    if (!body.email_address) {
      this.status = false;
      this.code = 403;
      this.message = "Please provide email!";
      this.data = [];

      return res.status(403).json(this.Response());
    }

    if (!body.password) {
      this.status = false;
      this.code = 403;
      this.message = "Please provide password!";
      this.data = [];

      return res.status(403).json(this.Response());
    }

    const queryForUser = { email: body.email_address , blocked: false};
    const findUser = await getSingleUser(queryForUser);

    if (!findUser) {
      this.status = false;
      this.code = 401;
      this.message = "No User exist with this email address";
      this.data = []
      return res.status(401).json(this.Response());
    }

    const passwordmatch = await validatePassword(
      body.password,
      findUser.password
    );
    if (!passwordmatch) {
      this.status = false;
      this.data = [];
      this.message = "Password is incorrect";
      return res.send(this.Response());
    }

    const now = Date.now();
    const data = {
      _id: findUser?._id, // important
      iat: now,
      authId: findUser?.auth_id,
      companyId: findUser?.company_id,
    };

    const jwtToken = jwt.sign(data, config.jwtSecret, { expiresIn: "14d" });
    const refreshToken = jwt.sign(data, config.jwtSecret, { expiresIn: "30d" });

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

    this.data = {
      jwt_token: jwtToken,
      refresh_token: refreshToken,
      authId: findUser.auth_id,
      phone: findUser.phone ? findUser.phone : "",
      name: findUser.FirstName ? findUser.FirstName : "",
      _id: findUser?._id ? findUser?._id : "" 
    };
    this.message = "User successfully found.";
    this.code = 200;
    this.status = true;

    return res.status(200).json(this.Response());
  }
}
