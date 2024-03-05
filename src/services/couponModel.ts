import CouponModel from '../models/CouponModel';
import logger from '../config/logger'

export async function getOneCoupon (queryParams : any ){
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
    const data = await CouponModel.findOne({ ...filterQuery })
      .limit(Number(queryParams.limit))
      .skip(Number(queryParams.offset))
      .sort(queryParams.sort)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
}

export async function getallCoupons (queryParams : any ){
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
  const data = await CouponModel.find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function updateManyCoupons ( query : any , updates : any , options : any ){
  try{  
    const response = await CouponModel.updateMany( query , updates , options)
    return response
  }catch(err:any){
    logger.error(`Error in updating many : ${err}`)
    return false
  }
}