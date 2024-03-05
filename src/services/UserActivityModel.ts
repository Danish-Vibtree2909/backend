import UserActivityModel from '../models/UserActivityModel';
import logger from '../config/logger'

export async function createUserActivity (data: { auth_id: any; user_id: any; type: string; }){
    try{
        const response = await UserActivityModel.create(data)
        return response
    }catch(err){
        logger.error('Error in creating User Activity '+ err)
        return false
    }
    
}