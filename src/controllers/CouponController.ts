import Controller from './Index';
import {IRequest , IResponse} from '../types/IExpress';
import { getOneCoupon , getallCoupons } from '../services/couponModel';
import { getOnePlan } from '../services/PlanModel';

export default class CouponController extends Controller {
    public constructor(model?:any){
        super(model)
        this.checkIfCouponValid = this.checkIfCouponValid.bind(this)
        this.verifyAndPlan = this.verifyAndPlan.bind(this)
    }

    findUnique =( arr : string[]) => {
        const unique : any = {}; // create an empty object to keep track of unique values
        const result = []; // create an empty array to store the unique values
        for (let i = 0; i < arr.length; i++) {
          if (!unique[arr[i]]) { // if the value is not already in the object
            result.push(arr[i]); // add the value to the result array
            unique[arr[i]] = true; // add the value to the object as a key with value true
          }
        }
        return result;
    }

      
    public async verifyAndPlan ( req : IRequest , res : IResponse ) : Promise<any>{
        const coupons = req.body.coupon as string[]
        if(!coupons){
            return res.status(403).json({
                "data":[],
                "code":403,
                "status":false,
                "message":"Provide coupon!"
            })
        }
        const uniqueCoupons = this.findUnique(coupons)
        if(uniqueCoupons.length > 0){
            console.log("Client give us more than one coupons : ", uniqueCoupons)
            const query = {"value" : {$in : uniqueCoupons}}
            const response : any = await getallCoupons(query)
            if(response.length>0){
                const validCouponsLength = response.length
                const query = {coupons_required : validCouponsLength}
                const qualifiedPlan : any = await getOnePlan(query)

                const subscriptionId = qualifiedPlan._id
                const appliedCoupon  = response.map((plan : any )=> {return plan.value})
                const jsonResponse = {
                    "subscription_id": subscriptionId,
                    "applied_coupons" : appliedCoupon
                }

                const responseBody = {
                    "data": jsonResponse,
                    "status": true,
                    "code": 200,
                    "message" : "Details fetched!"
                }

                return res.status(200).json(responseBody)
            }else{
                return res.status(403).json({
                    "data":[],
                    "status": false,
                    "code":401,
                    "message" : "Please check coupons"
                })
            }

        }else{
            console.log("Client did not enter any coupons start with free trial.")
            const query = {coupons_required : 0}
            const qualifiedPlan : any = await getOnePlan(query)
            // console.log("Plan accordin to coupon : ",qualifiedPlan)
            const subscriptionId = qualifiedPlan._id
            
            const jsonResponse = {
                "subscription_id": subscriptionId,
                "applied_coupons" : ["TRIAL"]
            }

            const responseBody = {
                "data": jsonResponse,
                "status": true,
                "code": 200,
                "message" : "Details fetched!"
            }

            return res.status(200).json(responseBody)
            
        }

    }

    public async checkIfCouponValid (req : IRequest , res : IResponse) : Promise<any>{
        const coupon = req.body.coupon
        if(!coupon){
            return res.status(403).json({
                data : [],
                status : false,
                message : "Provide Coupon!",
                code : 403
        })
        }
        // console.log("Coupon : ", coupon)
        const query = {value : coupon , is_used : false}
        const response = await getOneCoupon(query)
        // console.log("Response : ", response)
        if(response){
            return res.status(200).json({
                data : [],
                status : true,
                message : "Coupon is valid",
                code : 200
            })
        }else{
            return res.status(200).json({
                data : [],
                status : false,
                message : "Coupon is not valid",
                code : 404
        })
    }
    }
}