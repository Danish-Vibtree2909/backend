import PlanModel from '../models/PlansModel';
import logger from '../config/logger'

export async function getAllPlans ( queryParams : any) {
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
    const data = await PlanModel.find({ ...filterQuery })
      .limit(Number(queryParams.limit))
      .skip(Number(queryParams.offset))
      .sort(queryParams.sort)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
}

export async function countDocumentOfPlan ( queryParams: any ){
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
      const data = await PlanModel.countDocuments({ ...filterQuery });
      return data;

}

export async function createPlan ( data : any ){
    try {
        const mongoObj = new PlanModel(data);
        const response = await mongoObj.save();
        return response;
      } catch (err) {
        logger.error(`Error in creating Plans : ${err}`);
        return err;
      }
}

export async function findByIdAndUpdatePlan(query: any, updates: any , options?:any ) {
    try {
      const updatedBlockList = await PlanModel.findByIdAndUpdate(
        query,
        updates,
        options
      );
      return updatedBlockList;
    } catch (err) {
      logger.error("error in updating PlanModel : " + err);
      return false;
    }
}

export async function findByIdAndDeletePlans(query: any) {
    try {
      const updatedBlockList = await PlanModel.findByIdAndDelete(query);
      return updatedBlockList;
    } catch (err) {
      logger.error("error in deleting : " + err);
      return false;
    }
}

export async function getByIdPlan( id: any , queryParams?: any ) {
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await PlanModel
      .findById(id)
    return data;
  }

  export async function getOnePlan (queryParams : any){
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
    const data = await PlanModel.findOne({ ...filterQuery })
      .limit(Number(queryParams.limit))
      .skip(Number(queryParams.offset))
      .sort(queryParams.sort)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
}
