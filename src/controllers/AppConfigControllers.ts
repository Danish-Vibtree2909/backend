import Controller from './Index';
import {IRequest , IResponse} from '../types/IExpress';
import appConfigTypes from '../types/appConfigTypes';
import {isValidMongoDbObjectId} from '../helper/index';
import { getAllApplicationConfiguration , getByIdAppConfig ,countDocumentAppConfig , findByIdAndDeleteAppConfig ,findOneAndUpdateAppConfig } from '../services/AppConfigModel';

export default class AppConfigController extends Controller {
    public constructor (model ?: any){
        super(model);
        this.getAppConfig = this.getAppConfig.bind(this)
        this.createAppConfig = this.createAppConfig.bind(this)
        this.updateAppConfig = this.updateAppConfig.bind(this)
        this.deleteAppConfig = this.deleteAppConfig.bind(this)
        this.getAppConfigById = this.getAppConfigById.bind(this)
        this.getMyConfigAppConfig = this.getMyConfigAppConfig.bind(this)
    }

    public async getMyConfigAppConfig ( req : IRequest , res : IResponse ) : Promise<any>{

        const authId = req.JWTUser?.authId;
        const userId = req.JWTUser?._id;
        const queryParams : any = {...req.query , auth_id : authId , user_id : userId }
        const excludeApiFields = ['page', 'sort', 'limit', 'fields', 'offset', 'populate'];
        excludeApiFields.forEach(e => delete queryParams[e]);

        const appConfig = await getAllApplicationConfiguration(queryParams)

        const countDocuments = await countDocumentAppConfig(queryParams)

        const data = {

            totalCount: countDocuments,
            data: appConfig

        }

        this.data = data;
        this.status = true;
        this.message = 'Details Fetched';
        this.code = 200
        return res.status(200).json(this.Response())

    }

    public async getAppConfig (req : IRequest , res : IResponse) : Promise<any>{
        const authId = req.JWTUser?.authId!
        const queryParams : any = {...req.query , auth_id : authId}
        const excludeApiFields = ['page', 'sort', 'limit', 'fields', 'offset', 'populate'];
        excludeApiFields.forEach(e => delete queryParams[e]);

        const appConfig = await getAllApplicationConfiguration(queryParams)

        const countDocuments = await countDocumentAppConfig(queryParams)

        const data = {

            totalCount: countDocuments,
            data: appConfig

        }

        this.data = data;
        this.status = true;
        this.message = 'Details Fetched';
        this.code = 200
        return res.status(200).json(this.Response())


    }

    public async createAppConfig ( req : IRequest , res : IResponse ) : Promise<any>{

        const data : appConfigTypes = req.body
        const userId = req.JWTUser?._id;
        data.active_by = userId;
        if(data.app_name.toLowerCase() !== 'cloudphone'){
            this.code = 403
            this.data = []
            this.message = 'Only CloudPhone config allowed!'
            this.status = false

            return res.status(403).json(this.Response())
        }
        if(!data.user_id){
            this.code = 403
            this.data = []
            this.status = false
            this.message = 'No user_id provided!'
            
            return res.status(403).json(this.Response())
        }
        data.app_name = data.app_name ? data.app_name.toLowerCase() : 'cloudphone';
        data.is_active = data.is_active ? data.is_active : true;
        data.extension_active = data.extension_active ? data.extension_active : true;
        data.phoneApp_active = data.phoneApp_active ? data.phoneApp_active : true;
        data.country_allow = data.country_allow ? data.country_allow! : [{ code : "IND" , phone : "91"}];
        data.default_country = data.default_country ? data.default_country : { code : "IND" , phone : "91"}
        data.cloudNumber_allow = data.cloudNumber_allow ? data.cloudNumber_allow : [];
        data.call_allow = data.call_allow ? data.call_allow : 'both';
        data.type_allow = data.type_allow ? data.type_allow : 'both';
        data.phone_mode = data.phone_mode ? data.phone_mode : 'default';
        data.sip_mode = data.sip_mode ? data.sip_mode : 'default';
        data.sip_active = data.sip_active ? data.sip_active : false;
        

        const query = { user_id : userId}
        const update = { $set : { ...data}}
        const option = { upsert : true , new : true}

        const newDocument = await findOneAndUpdateAppConfig(query , update , option)

        if(newDocument){
            this.code = 201
            this.data = newDocument ;
            this.status = true ;
            this.message = 'Added to AppConfig';

            return res.status(201).json(this.Response())
        }else{
            this.code = 404
            this.data = []
            this.status = false
            this.message = 'Something went wrong!'
            return res.status(404).json(this.Response())
        }
    }

    public async updateAppConfig ( req : IRequest , res : IResponse ) :Promise<any>{

        const query = req.params.id
        const isValid = isValidMongoDbObjectId(query)
        if(isValid){
            const updates = req.body
            const options = {upsert : false , new : true}
            const updatedAppConfig = await findOneAndUpdateAppConfig(query , updates, options)
            if(!updatedAppConfig){
                this.code = 404
                this.data = []
                this.status = false
                this.message = 'Details not found!'
                return res.status(404).json(this.Response())
            }else{
                this.code = 202
                this.data = updatedAppConfig
                this.status = true
                this.message = 'Updated AppConfig'
                return res.status(200).json(this.Response())
            }
        }else{
            this.code = 404
            this.data = []
            this.status = false
            this.message = 'Details not found!'
            return res.status(404).json(this.Response())
        }


    }

    public async deleteAppConfig ( req : IRequest , res : IResponse ) : Promise<any>{
        const id = req.params.id
        const isValid = isValidMongoDbObjectId(id)
        if(isValid){
            const deletedAppConfig = await findByIdAndDeleteAppConfig(id)
            if(!deletedAppConfig){
                this.code = 404
                this.status = false
                this.data = []
                this.message = 'Details not found!'
                return res.status(404).json(this.Response())
            }
            this.code = 204
            this.data = [];
            this.status = true;
            this.message = 'Deleted From AppConfig'
            return res.status(200).json(this.Response())
        }else{
            this.code = 404
            this.data = []
            this.status = false
            this.message = 'Details not found!'
            return res.status(404).json(this.Response())
        }
    }

    public async getAppConfigById ( req : IRequest , res : IResponse ) : Promise<any>{

        const id = req.params.id
        const isValid = isValidMongoDbObjectId(id)
        if(isValid){
            const foundDetailsOfAppConfig = await getByIdAppConfig(id)
            if(!foundDetailsOfAppConfig){
                this.code = 404
                this.status = false
                this.message = 'Details not found!'
                return res.status(404).json(this.Response())
            }
            this.code = 200
            this.data = foundDetailsOfAppConfig
            this.status = true
            this.message = 'Found Details'
            return res.status(200).json(this.Response())
        }else{
            this.code = 404
            this.data = []
            this.status = false
            this.message = 'Details not found!'
            return res.status(404).json(this.Response())
        } 

    }
}