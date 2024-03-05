import Controller from "./Index";
import {IRequest, IResponse} from "../types/IExpress";
import { getAllPowerDialer , 
    countDocumentPowerDialer , 
    createPowerDialer , 
    findByIdAndUpdatePowerDialer , 
    findByIdAndDeletePowerDialer , 
    deleteManyPowerDialer , 
    insertManyPowerDialer ,
    getPowerDialerDetailsById
} from '../services/powerDialerModel';

import { getVibconnect } from "../services/vibconnectModel";
import {isValidMongoDbObjectId} from '../helper/index';
interface IPowerDialer {
    contactNumber : string;
    contactId : any;
}

export default class PowerDialerController extends Controller{
    public constructor(models?:any){
        super(models)
        this.getPowerDialerVersionTwo = this.getPowerDialerVersionTwo.bind(this)
        this.getPowerDialerStatusVersionTwo = this.getPowerDialerStatusVersionTwo.bind(this)
        this.createPowerDialerVersionTwo = this.createPowerDialerVersionTwo.bind(this)
        this.updatePowerDialerVersionTwo = this.updatePowerDialerVersionTwo.bind(this)
        this.deletePowerDialerVersionTwo = this.deletePowerDialerVersionTwo.bind(this)
        this.deleteManyPowerDialerVersionTwo = this.deleteManyPowerDialerVersionTwo.bind(this)
        this.insertManyPowerDialerVersionTwo = this.insertManyPowerDialerVersionTwo.bind(this)
        this.getByIdPowerDialerVersionTwo = this.getByIdPowerDialerVersionTwo.bind(this)
    }

    public async getByIdPowerDialerVersionTwo ( req : IRequest , res : IResponse ) : Promise<any>{
        const query = req.params.id
        const isValidId = isValidMongoDbObjectId(query)
        if(!isValidId){
            this.data = []
            this.status = false
            this.message = 'Please check the id!'
            this.code = 403
    
            return res.status(403).json(this.Response())
        }
        const foundDetailsOfBlockList = await getPowerDialerDetailsById(query)
        if(!foundDetailsOfBlockList){

            this.data = []
            this.code = 403
            this.message = 'Please check the id!'
            this.status = false

            return res.status(403).json(this.Response())
        }
        this.data = foundDetailsOfBlockList
        this.status = true
        this.message = 'Found Details'
        this.code = 200

        return res.status(200).json(this.Response())
    }


    filterOnlyIdFromDocument = (data : any )=>{
        let output = []
        output = data.map((item : any )=>{
          return item._id
        })
        // console.log("output : ", output)
        return output
      }


    public async insertManyPowerDialerVersionTwo ( req : IRequest , res : IResponse ) : Promise<any>{
        const arrayOfChildCalls : any  = req.body
        const data : any  = await insertManyPowerDialer(arrayOfChildCalls)
        
        // console.log("Data : ", onlyIdsOdDocuments)
        if(data){
            const onlyIdsOdDocuments = this.filterOnlyIdFromDocument(data)
            this.data = {"count":data.length,"data":onlyIdsOdDocuments}
            this.status = true
            this.message = 'Successfully added the Power Dialer'
            this.code = 201

            return res.status(201).json(this.Response())
        }
        this.data = []
        this.status = false
        this.message = 'Something went wrong!'
        this.code = 403
        return res.status(403).json(this.Response())
    }

    public async deleteManyPowerDialerVersionTwo ( req : IRequest , res : IResponse ) : Promise<any>{
        const body : any = req.body
        //console.log("Body : ", body)
        const responseAfterDeleting : any = await deleteManyPowerDialer({...body})
        if(!responseAfterDeleting){
            this.data = []
            this.code = 403
            this.status = false
            this.message = "Please check the query which you give in body!"

            return res.status(403).json(this.Response())
        }
        //console.log("Response : ", responseAfterDeleting)
        
        const response = {
            "data": responseAfterDeleting.deletedCount,
            "message": "Power Dialer Deleted!",
            "status" : true,
            "code": 200
        }
    
        return res.status(200).json(response)
    }

    public async deletePowerDialerVersionTwo (req : IRequest , res : IResponse ): Promise<any>{
        const query = req.params.id
        const isValidId = isValidMongoDbObjectId(query)
        if(!isValidId){
            this.data = []
            this.status = false
            this.message = 'Please check the id'
            this.code = 403
    
            return res.status(403).json(this.Response())
        }
        const updatedBlockList = await findByIdAndDeletePowerDialer(query)
        if(updatedBlockList){
            this.data = []
            this.status = true
            this.message = 'Deleted Power Dialer'
            this.code = 204
    
            return res.status(200).json(this.Response())
        }else{
            this.data = []
            this.status = false
            this.message = 'Please check the id!'
            this.code = 403
    
            return res.status(403).json(this.Response())
        }

    }

    public async updatePowerDialerVersionTwo (req : IRequest , res : IResponse ): Promise<any>{
        const query = req.params.id
        const isValidId = isValidMongoDbObjectId(query)
        if(!isValidId){
            this.data = []
            this.status = false
            this.message = 'Please check the id!'
            this.code = 403
    
            return res.status(403).json(this.Response())
        }
        const updates = req.body
        const options = {upsert : false}
        const updatedBlockList = await findByIdAndUpdatePowerDialer(query , updates, options)
        if(updatedBlockList){
            this.data = []
            this.status = true
            this.message = 'Updated Power Dialer'
            this.code = 204
    
            return res.status(200).json(this.Response())
        }else{
            this.data = []
            this.status = false
            this.message = 'Please check the id!'
            this.code = 403
    
            return res.status(403).json(this.Response())
        }

    }

    public async createPowerDialerVersionTwo ( req : IRequest , res : IResponse) : Promise<any>{
        const companyId = req.JWTUser?.companyId ? req.JWTUser?.companyId : false;
        const userId = req.JWTUser?._id ? req.JWTUser?._id : false;
        const body : IPowerDialer = {...req.body}
        if (!companyId) {
          this.status = false;
          this.code = 403;
          this.message = "User is not assigned to any company!";
          this.data = [];
    
          return res.status(403).json(this.Response());
        }

        if(!body.contactNumber){
            this.status = false;
            this.code = 403;
            this.message = "Provide contactNumber!";
            this.data = [];
      
            return res.status(403).json(this.Response());
        }

        if(!body.contactId){
            this.status = false;
            this.code = 403;
            this.message = "Provide contactId!";
            this.data = [];
      
            return res.status(403).json(this.Response());
        }

        const query = {
            companyId: companyId,
          };
        const vibDetails = await getVibconnect(query);
        const authId = vibDetails.length > 0 ? vibDetails[0].authId : false;
        const authSecret = vibDetails.length > 0 ? vibDetails[0].authSecret : false;

        
        const powerDialerObj = {...body , authId : authId , authSecret : authSecret, userId: userId }
        const createdBlocklist = await createPowerDialer(powerDialerObj)

        this.data = createdBlocklist;
        this.status = true;
        this.message = "Added to PowerDialer";
        this.code = 201
        return res.status(201).json(this.Response())
    }

    public async getPowerDialerStatusVersionTwo ( req : IRequest , res : IResponse ) : Promise<any>{
        const authId = req.JWTUser?.authId
        const queryParams = {...req.query}
        const finalQuery = {...queryParams , authId : authId} 

        const total = await countDocumentPowerDialer(finalQuery)


        const response = {
            data : total,
            status : true,
            code : 200,
            message : 'Count fetched!'
        }

        return res.status(200).json(response)

    }

    public async getPowerDialerVersionTwo ( req : IRequest , res : IResponse ) : Promise<any>{
        const authId = req.JWTUser?.authId
        const queryParams = {...req.query}
        const finalQuery = {...queryParams , authId : authId} 

        const pwData = await getAllPowerDialer(finalQuery)
        const total = await countDocumentPowerDialer(finalQuery)

        const data = {
            "totalCount" : total,
            "data" : pwData
        }

        this.data = data;
        this.status = true;
        this.message = 'Details Fetched';
        return res.json(this.Response())

    }
}