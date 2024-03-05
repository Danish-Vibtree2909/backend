import Controller from './Index';
import { IRequest, IResponse } from '../types/IExpress';
import { getRoles , countRolesDocuments , deleteRoleById, getRolesById , updateRoletById ,createRole} from '../services/userRolesModel';
import UserPermissionRoleInterface from '../types/userPermissionRole';

export default class UserRoleController extends Controller{
    public constructor(models?:any){
        super(models)
        this.getUserRoles = this.getUserRoles.bind(this)
        this.getUserRolesById = this.getUserRolesById.bind(this)
        this.createUserRole = this.createUserRole.bind(this)
        this.updateUserRole = this.updateUserRole.bind(this)
        this.deleteUserRoleById = this.deleteUserRoleById.bind(this)
    }

    public async deleteUserRoleById ( req : IRequest , res : IResponse ) : Promise<any>{
        const id = req.params.id

        const response = await deleteRoleById(id)

        if(response){

            this.data = []
            this.status = true
            this.code = 200
            this.message = 'Roles deleted!'

            return res.status(200).json(this.Response())
        }else{

            this.data = []
            this.code = 404
            this.status = false
            this.message = 'Something went wrong!'

            return res.status(404).json(this.Response())
        }
    }

    public async updateUserRole ( req : IRequest , res : IResponse ) : Promise<any>{
        const id = req.params.id

        const updates = {...req.body}
        const excludeFields = ['AccountSid']
        excludeFields.forEach((e)=> delete updates[e]) 

        const options = { upsert : false }

        const response = await updateRoletById( id , updates , options)

        if(response){

            this.data = []
            this.code = 204
            this.status = true
            this.message = 'Updated Roles!'

            return res.status(200).json(this.Response())
        }else{
            this.data = []
            this.code = 404
            this.status = false
            this.message = 'Something went wrong!'

            return res.status(404).json(this.Response())
        }
    }

    public async createUserRole ( req : IRequest , res : IResponse ) : Promise<any>{
        const authId = req.JWTUser?.authId
        const data : UserPermissionRoleInterface = {...req.body, AccountSid : authId}
        if(!data.name || !data.type){

            this.data = []
            this.code = 403
            this.message = 'Missing name or type of role!'
            this.status = false

            return res.status(403).json(this.Response())
        }

        const response = await createRole(data)

        this.data = response
        this.code = 201
        this.message = 'Created Role'
        this.status = true

        return res.status(201).json(this.Response())
    }


    public async getUserRolesById ( req : IRequest , res : IResponse ) : Promise<any>{
        const id = req.params.id
        const query = {...req.query}

        const data = await getRolesById(id , query)
        
        this.data = data
        this.code = 200
        this.message = "Details fetched!"
        this.status = true

        return res.status(200).json(this.Response())
    }

    public async getUserRoles (req : IRequest , res : IResponse ) : Promise<any>{
        const authId = req.JWTUser?.authId
        const queryParams = {...req.query , AccountSid : authId}
        console.log(queryParams)
        const response = await getRoles(queryParams)
        const count = await countRolesDocuments(queryParams)

        const data = {
            data : response,
            totalCount : count
        }

        this.data = data
        this.code = 200
        this.message = "Details fetched!"
        this.status = true
        
        return res.status(200).json(this.Response())
    }
}