import AlliesModel from "../models/AlliesModel";
import logger from '../config/logger'

export async function getAllAllies(queryParams: any) {
  const filterQuery = { ...queryParams };
  const excludeApiFields = [
    "page",
    "sort",
    "limit",
    "fields",
    "offset",
    "populate",
  ];
  //@ts-ignore
  excludeApiFields.forEach((e) => delete filterQuery[e]);
  //console.log("Query service : ", filterQuery, queryParams);
  const data = await AlliesModel.find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function countDocumentAllies(queryParams: any, userDetails?: any) {
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
  //console.log("Query service : ", filterQuery);
  const data = await AlliesModel.countDocuments({ ...filterQuery });
  return data;
}

export async function createAllies(data: any) {
  try {
    const mongoObj = new AlliesModel(data);
    const response = await mongoObj.save();
    return response;
  } catch (err) {
    logger.error(`Error in creating AlliesModel : `);
    logger.error(err);
    return err;
  }
}

export async function findByIdAndUpdateAllies(query: any, updates: any , options?:any ) {
  try {
    const updatedBlockList = await AlliesModel.findByIdAndUpdate(
      query,
      updates,
      options
    );
    return updatedBlockList;
  } catch (err) {
    logger.error("error in updating AlliesModel : ");
    logger.error(err);
    return false;
  }
}

export async function findByIdAndDeleteAllies(query: any) {
  try {
    const updatedBlockList = await AlliesModel.findByIdAndDelete(query);
    return updatedBlockList;
  } catch (err) {
    logger.error("error in deleting AlliesModel : ");
    logger.error(err);
    return false;
  }
}
export async function getByIdAllies( id: any , queryParams?: any ) {
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await AlliesModel
      .findById(id)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
  }
