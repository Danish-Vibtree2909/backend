import ConferenceModel from '../models/ConferenceModel';
import logger from "../config/logger";

export async function createConference(data : any){
    try{
      const conferenceCallBacksModel = new ConferenceModel(data)
      const response = await conferenceCallBacksModel.save()
      return response
    }catch(err){
      logger.error(`Error in creating conference`)
      logger.error(err)
      return err
    }
}

export async function getOneConference ( queryParams : any ){
  const filterQuery = { ...queryParams };
  const excludeApiFields = [
    "page",
    "sort",
    "limit",
    "fields",
    "offset",
    "populate",
  ];

  excludeApiFields.forEach((e) => delete filterQuery[e]);
  //console.log("Query service : ", filterQuery, queryParams);
  const data = await ConferenceModel
    .findOne({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}