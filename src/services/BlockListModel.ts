import BlocklistModel from "../models/blocklistModel";
import logger from '../config/logger'

export async function getAllBlockList(queryParams: any) {
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
  const data = await BlocklistModel.find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function countDocumentBlockList(queryParams: any, userDetails?: any) {
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
  const data = await BlocklistModel.countDocuments({ ...filterQuery });
  return data;
}

export async function createBlockList(data: any) {
  try {
    const mongoObj = new BlocklistModel(data);
    const response = await mongoObj.save();
    return response;
  } catch (err) {
    logger.error(`Error in creating BlocklistModel : `);
    logger.error(err);
    return err;
  }
}

export async function findByIdAndUpdateBlockList(query: any, updates: any , options?:any ) {
  try {
    const updatedBlockList = await BlocklistModel.findByIdAndUpdate(
      query,
      updates,
      options
    );
    return updatedBlockList;
  } catch (err) {
    logger.error("error in updating BlocklistModel : ");
    logger.error(err);
    return false;
  }
}

export async function findByIdAndDeleteBlocklist(query: any) {
  try {
    const updatedBlockList = await BlocklistModel.findByIdAndDelete(query);
    return updatedBlockList;
  } catch (err) {
    logger.error("error in deleting BlocklistModel : ");
    logger.error(err);
    return false;
  }
}
export async function getByIdBlocklist( id: any , queryParams?: any ) {
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await BlocklistModel
      .findById(id)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
  }
