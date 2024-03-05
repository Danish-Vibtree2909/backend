import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
import { getByIdPlan } from "../services/PlanModel";
import PlansType from "../types/PlanTypes";
import moment from "moment";
import { createSubscription , getOneSubscription } from "../services/SubscriptionModel";
import { updateManyCoupons } from "../services/couponModel";
import SubscriptionTypes from '../types/SubscriptionType';
import { isValidMongoDbObjectId } from "../helper";

export default class SubscriptionController extends Controller {
  public constructor(model?: any) {
    super(model);
    this.activateSubscription = this.activateSubscription.bind(this);
    this.getById = this.getById.bind(this)
  }

  public async getById ( req : IRequest , res : IResponse) : Promise<any>{
    const id = req.JWTUser?.companyId

    const queryForSubscription = { companyId : id , createdAt : {'$lt' : new Date()} }
    const data = await getOneSubscription(queryForSubscription)

    this.data = data ? data : []
    this.status = true
    this.code = 200
    this.message = 'Details fetched!'

    return res.status(200).json(this.Response())
  }

  deactiveCoupon = async (coupons : string[] , userId : any ) =>{
    // console.log("UserId : ", userId)
    // console.log("Coupons : ", coupons)
    if(coupons[0] === 'TRIAL'){
      console.log("It is a TRIAL coupon!")
      return
    }
    const uniqueCoupons = coupons.filter((item , index)=> coupons.indexOf(item)===index)
    // console.log("Unique : ", uniqueCoupons)
    
    const queryToDeactiveUser = {value:{$in : uniqueCoupons} , is_used : false}
    const updates = {$set : {is_used : true , used_by : userId , use_time : 1}}
    const options = {upsert : false}
    await updateManyCoupons(queryToDeactiveUser , updates , options)
    return
  }

  public async activateSubscription(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    const companyId = req.JWTUser?.companyId;
    const subscriptionId = req.body.subscriptionId;
    // console.log("Coupons : ", req.body.applied_coupons , typeof req.body.applied_coupons)

    if(!subscriptionId){
      this.data = []
      this.code = 403
      this.status = false
      this.message = 'Provide Subscription ID!'

      return res.status(403).json(this.Response())
    }

    if(!req.body.applied_coupons){
      this.data = []
      this.code = 403
      this.status = false
      this.message = 'Provide Applied Coupons'

      return res.status(403).json(this.Response())
    }

    if(!Array.isArray(req.body.applied_coupons)){
      this.data = []
      this.code = 403
      this.status = false
      this.message = 'Provide Applied Coupons in array!'

      return res.status(403).json(this.Response())
    }

    const isValidId = isValidMongoDbObjectId(subscriptionId)

    if(!isValidId){
        this.data = [];
        this.code = 403;
        this.status = false;
        this.message = "Please check your subscription id";
  
        return res.status(403).json(this.Response());
    }

    if (!companyId) {
      this.data = [];
      this.code = 403;
      this.status = false;
      this.message = "Please check your company";

      return res.status(403).json(this.Response());
    }

    const detailsNeedToCopy = (await getByIdPlan(subscriptionId)) as PlansType;
    if (detailsNeedToCopy) {
    //   console.log("Details Need To Copy : ", detailsNeedToCopy);
      const {  price, features, days } = detailsNeedToCopy;
      
      const queryToGetLastSubscription = {companyId : companyId , sort :"-_id"}
      const lastUpdatedSubscription = await (getOneSubscription(queryToGetLastSubscription)) as unknown as SubscriptionTypes
    
    //   console.log("lastUpdatedSubscription : ",lastUpdatedSubscription)
      const dayNeedToAdd = days ? days : 0;
      let startDate = moment();
      let endDate = moment().add(dayNeedToAdd.toString(), "d").endOf('day');
      const isExpired = false;
      const isActive = true;
      const userId = req.JWTUser?._id;
      const isFuturePlan = false;

      if(lastUpdatedSubscription){
        startDate = moment(lastUpdatedSubscription.endDate);
        endDate = moment(startDate).add(dayNeedToAdd.toString(), "d").endOf('day');
      }



      const payloadToCreateSubscription = {
        package: detailsNeedToCopy.package,
        price: price,
        features: features,
        startDate: startDate,
        endDate: endDate,
        isExpired: isExpired,
        isActive: isActive,
        userId: userId,
        companyId : companyId,
        isFuturePlan : isFuturePlan ,
        name : detailsNeedToCopy.name,
        credits : detailsNeedToCopy.credits
      };
    //   console.log("Paylod : ", payloadToCreateSubscription);
      const response = await createSubscription(payloadToCreateSubscription);

      if (response) {
        //Deactivate Coupon 

        this.deactiveCoupon( req.body.applied_coupons , req.JWTUser?._id )

        this.data = [];
        this.code = 201;
        this.status = true;
        this.message = "Subscription added!";

        return res.status(201).json(this.Response());
      } else {
        this.data = [];
        this.status = false;
        this.code = 404;
        this.message = "Something went wrong!";

        return res.status(404).json(this.Response());
      }
    } else {
      this.data = [];
      this.code = 403;
      this.message = "Please choose a valid subscription package!";
      this.status = false;

      return res.status(403).json(this.Response());
    }
  }
}
