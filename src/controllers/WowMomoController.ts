import Controller from './Index';
import {IRequest, IResponse} from "../types/IExpress";
import { SendFeedback , sendFeedbackFormData} from '../helper/wowMomo';

export default class WowMomoController extends Controller {
    public constructor(model ?: any){
        super(model);
        
        this.SendFeedBackToWowoMomo = this.SendFeedBackToWowoMomo.bind(this)
    }

    public async SendFeedBackToWowoMomo( req : IRequest , res :IResponse){
        const body : SendFeedback = req.body
        try{
            const response : any = await sendFeedbackFormData(body)
            this.data = JSON.parse(response)
            this.code = 200
            this.message = 'Request complete'
            this.status = true

            return res.status(200).json(this.Response())
            
        }catch(error : any){
            this.data = []
            this.code = 404
            this.message = 'Something went wrong!'
            this.status = false

            return res.status(404).json(this.Response())
        }
    }
}