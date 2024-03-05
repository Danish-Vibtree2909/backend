import userStatusModel from "../models/userStatusModel";
import logger from "../config/logger";

export async function getUserStatusById( id : any , queryParams? : any ) {
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await userStatusModel
      .findById(id)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
  }

export async function getUserStatus(queryParams: any ) {
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
  const data = await userStatusModel
    .find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function countDocumentUserStatus(queryParams : any , userDetails?: any ) {
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
  const data = await userStatusModel.countDocuments({ ...filterQuery });
  return data;
}

export async function createUserSatus(data : any  )  {
  try {
    const userStatus = new userStatusModel(data);
    const response = await userStatus.save();
    return response;
  } catch (err) {
    logger.error(`Error in creating conference call back : `);
    logger.error(err);
    return err;
  }
}

export async function findByIdAndUpdateUserStatus(query : any , updates : any , options : any ) {
  try {
    const updatedBlockList = await userStatusModel.findByIdAndUpdate(
      query,
      updates,
      options
    );
    return updatedBlockList;
  } catch (err) {
    logger.error("error in updating user status : ");
    logger.error(err);
    return false;
  }
}

export async function findByIdAndDeleteUserStatus(query : any ) {
  try {
    const updatedBlockList = await userStatusModel.findByIdAndDelete(query);
    return updatedBlockList;
  } catch (err) {
    logger.error("error in deleting user status : ");
    logger.error(err);
    return false;
  }
}

export async function findOneAndUpdateUserStatus(query : any , updates : any , options : any ) {
  try {
    const updatedBlockList = await userStatusModel.findOneAndUpdate(
      query,
      updates,
      options
    );
    // console.log("updated user : ",updatedBlockList)
    return updatedBlockList;
  } catch (err) {
    logger.error("error in updating user status : ");
    logger.error(err);
    return false;
  }
}
