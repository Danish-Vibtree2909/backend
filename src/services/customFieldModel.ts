import ContactsCustomField from "../models/ContactsCustomField";
import logger from "../config/logger";

export async function getAllCustomField(queryParams: any) {
  try {
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
    const data = await ContactsCustomField.find({ ...filterQuery })
      .limit(Number(queryParams.limit))
      .skip(Number(queryParams.offset))
      .sort(queryParams.sort)
      .select(queryParams.fields)
      .populate(queryParams.populate);

    return data;
  } catch (err: any) {
    logger.error(`Error in fetching custom variable : `, err);
    return false;
  }
}

export async function countCustomField(queryParams: any, userDetails?: any) {
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
  const data = await ContactsCustomField.countDocuments({ ...filterQuery });
  return data;
}

export async function createCustomField(data: any) {
    try {
      const CustomField = new ContactsCustomField(data);
      const response = await CustomField.save();
      return response;
    } catch (err: any) {
      logger.error(`Error in creating CustomField : ${err}`);
      return false;
    }
  }

export async function findOneCustomeVariable ( queryParams : any ){
  try{
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
    const data = await ContactsCustomField.findOne({ ...filterQuery })
      .select(queryParams.fields)
      .populate(queryParams.populate);

    return data;
  }catch(err){
    logger.error(`Error in finding one custom variable : `,err )
    return false
  }
}

export async function findByIdAndUpdateCustomField ( id : any , updates : any , options : any){
  try{
    const response = await ContactsCustomField.findByIdAndUpdate(id, updates , { new: true , ...options})
    return response
  }catch(err){
    logger.error(`Error in updating custom fields : ${id} : ${err}`)
    return false
  }
}

export async function findByIdAndDeleteCustomField ( id : any){
  try{
    const response = await ContactsCustomField.findByIdAndDelete(id)
    return response
  }catch(err){
    logger.error(`Error in deleting custom fields : ${id} : ${err}`)
    return false
  }
}

export async function findByIdCustomField ( id : any ){
  try{
    const response = await ContactsCustomField.findById(id)
    return response
  }catch(err){
    logger.error(`Error in fetching by id custom field : ${id} : ${err}`)
    return false
  }
}