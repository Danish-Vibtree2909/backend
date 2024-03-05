import UserPermissionRoleModel from "../models/UserPermissionRoleModel";
import logger from "../config/logger";

export async function getRoles(queryParams: any) {
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
  const data = await UserPermissionRoleModel.find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function countRolesDocuments(queryParams: any) {
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
  const data = await UserPermissionRoleModel.countDocuments({ ...filterQuery });
  return data;
}

export async function getRolesById(id: any, queryParams: any) {
  const data = await UserPermissionRoleModel.findById(id)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function createRole(data: any) {
  try {
    const contact = new UserPermissionRoleModel(data);
    const response = await contact.save();
    return response;
  } catch (err: any) {
    logger.error(`Error in creating role : ${err}`);
    return false;
  }
}

export async function updateRoletById(query: any, updates: any, options: any) {
  try {
    const updatedData = await UserPermissionRoleModel.findByIdAndUpdate(
      query,
      updates,
      options
    );
    return updatedData;
  } catch (err: any) {
    logger.error(`Error in updating role : ${err}`);
    return false;
  }
}

export async function deleteRoleById(id: any) {
  try {
    const myQuery = { _id: id };
    const contactDeletedData = await UserPermissionRoleModel.deleteOne(myQuery);
    return contactDeletedData;
  } catch (err: any) {
    logger.error(`Error in deleting one Role : ${err}`);
    return false;
  }
}
