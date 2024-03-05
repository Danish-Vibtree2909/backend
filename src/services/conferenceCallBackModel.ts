import ConferenceCallBacksModel from "../models/ConferenceCallBacksModel";
import logger from '../config/logger'

export async function getConferenceCallBacks(queryParams : any ) {
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
  const data = await ConferenceCallBacksModel.find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function createConferenceCallBack(data : any ){
    try{
      const conferenceCallBacksModel = new ConferenceCallBacksModel(data)
      const response = await conferenceCallBacksModel.save()
      return response
    }catch(err){
      logger.error(`Error in creating conference call back : `)
      logger.error(err)
      return err
    }
}
