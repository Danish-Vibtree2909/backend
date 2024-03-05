import IvrStudiosStatusModel from '../models/ivrStudiosModelCallBacks';
import logger from '../config/logger';

export async function createIvrStudiosCdrCallBack(data: any){
    try{
      const ivrStudiosStatusModel = new IvrStudiosStatusModel(data)
      const response = await ivrStudiosStatusModel.save()
      return response
    }catch(err){
      logger.error(`Error in creating createIvrStudiosCdrCallBack call back : `)
      logger.error(err)
      return err
    }
}

export async function findOneAndUpdateIvrStudiosCallBack(query : any , update : any , option : any){
  try{
    const response = await IvrStudiosStatusModel.findOneAndUpdate( query , update , option )
    return response
  }catch(err){
    logger.error(`Error in updating createIvrStudiosCdrCallBack call back : `)
    logger.error(err)
    return err
  }
}