import ConferenceModel from '../models/ConferenceModel';
import logger from '../config/logger';

export async function findOneAndUpdateConference ( query : any , update : any , option : any ){
    try{
        const response = await ConferenceModel.findOneAndUpdate( query , update , option )
        return response
    }catch(err:any){
        logger.error('Error in updating conference model : '+ err)
        return false
    }
}