import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
import {
  getDetails,
  countDocuments,
  getIvrFlowCdrWithId,
  updateIvrFlowCdrWithId,
} from "../services/IvrFlowModel";
import {isValidMongoDbObjectId} from '../helper/index';

export default class VoiceController extends Controller {
  public constructor(model?: any) {
    super(model);
    this.getVoiceCdr = this.getVoiceCdr.bind(this);
    this.getVoiceCdrById = this.getVoiceCdrById.bind(this);
    this.updateVoiceCdrById = this.updateVoiceCdrById.bind(this);
    this.calculateCallStatusStats = this.calculateCallStatusStats.bind(this);
    this.filterVoiceCdr = this.filterVoiceCdr.bind(this);
  }

  public async filterVoiceCdr(req: IRequest, res: IResponse): Promise<any> {
    const authId = req.JWTUser?.authId;

    let cloudNumber : any ;
    let caller;
    let reciever;
    let startDate;
    let endDate: any = new Date();
    let callStatus;
    let flowName;
    let tags;
    let ParentCallSid;
    let CallType;
    let documentStatus;
    let ivrName;
    let digit;
    let limit;
    let offset;
    let populate;
    let fields;
    let sort;

    if(req.body.limit){
      limit = req.body.limit
    }
    if(req.body.offset){
      offset = req.body.offset
    }
    if(req.body.populate){
      populate = req.body.populate
    }
    if(req.body.fields){
      fields = req.body.fields
    }
    if(req.body.sort){
      sort = req.body.sort
    }
    if (req.body.documentStatus) {
      documentStatus = req.body.documentStatus;
    }
    if (req.body.callType) {
      CallType = req.body.callType;
    }
    if (req.body.parentCallSid) {
      ParentCallSid = req.body.parentCallSid;
    }
    if (req.body.cloudNumber) {
      cloudNumber = req.body.cloudNumber;
    }
    if (req.body.caller) {
      caller = req.body.caller;
    }
    if (req.body.reciever) {
      reciever = req.body.reciever;
    }
    if (req.body.startDate) {
      startDate = req.body.startDate;
    }
    if (req.body.endDate) {
      endDate = req.body.endDate;
    }
    if (req.body.callStatus) {
      callStatus = req.body.callStatus;
    }
    if (req.body.flowName) {
      flowName = req.body.flowName;
    }
    if (req.body.tags) {
      if (Array.isArray(req.body.tags) && req.body.tags.length === 0) {
        console.log(`req.body.value is an empty array`)
        tags = undefined
      } else {
        console.log(`req.body.value is not an empty array`)
        if (Array.isArray(req.body.tags) && req.body.tags.length === 1 && req.body.tags[0] === "") {
          console.log(`req.body.value is an array containing only one empty string [""].`)
          tags = undefined
        } else {
          console.log(`req.body.value is not an array containing only one empty string [""].`)
          tags = req.body.tags
        }
      }
    }
    if (req.body.ivrName) {
      ivrName = req.body.ivrName;
    }
    if (req.body.digit) {
      digit = req.body.digit;
    }


    if (cloudNumber) {
      console.log(
        "CloudNumber from frontend : ",
        typeof cloudNumber,
        cloudNumber
      );
      cloudNumber = cloudNumber.map((item : any) => {
        if (!item.includes("+")) {
          item = `+${item}`;
        }
        return item;
      });
    }
    const documentStatusFilter = documentStatus
      ? { "Status.name": { $regex: documentStatus } }
      : {};
    const parentCallSidFilter = ParentCallSid
      ? { "ParentCall.ParentCallSid": ParentCallSid }
      : {};
    const callerFilter = caller
      ? { ContactNumber: { $regex: caller, $options: "i" } }
      : {};
    const recieverFilter = reciever
      ? {
          "ParentCall.ChildCall": {
            $elemMatch: { To: { $regex: reciever, $options: "i" } },
          },
        }
      : {};
    const statusFilter = callStatus ? { CallStatus: { $in: callStatus } } : {};
    const cloudNumberFilter = cloudNumber
      ? { CloudNumber: { $in: cloudNumber } }
      : {};
    const dateFilter = startDate
      ? { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } }
      : {};
    const flowNameFilter = flowName
      ? { FlowName: { $regex: flowName, $options: "i" } }
      : {};
    const tagsFilter = tags ? { "Tags.name": { $in: tags } } : {};
    const callTypeFilter = CallType ? { "ParentCall.Direction": CallType } : {};
    const ivrNameFilter = ivrName
      ? {
          ivrDetails: {
            $elemMatch: { ivrName: { $regex: ivrName, $options: "i" } },
          },
        }
      : {};
    const pressedDigitsFilter = digit
      ? {
          ivrDetails: {
            $elemMatch: { Digit: { $regex: digit, $options: "i" } },
          },
        }
      : {};

    const combinationOfQueryForIvrDetails = {
      $and: [ivrNameFilter, pressedDigitsFilter],
    };

    const queryParams = {
      ...documentStatusFilter,
      ...callTypeFilter,
      ...parentCallSidFilter,
      ...statusFilter,
      ...callerFilter,
      ...recieverFilter,
      ...cloudNumberFilter,
      ...dateFilter,
      ...flowNameFilter,
      ...tagsFilter,
      ...combinationOfQueryForIvrDetails,
      AccountSid: authId,
      limit : limit,
      offset : offset,
      populate : populate,
      fields : fields,
      sort : sort
    };

    console.log("Query params : ", queryParams)

    const data = await getDetails(queryParams);
    const count = await countDocuments(queryParams);

    this.data = {data : data , totalCount : count};
    this.code = 200;
    this.status = true;
    this.message = "Details Fetched!";

    return res.status(200).json(this.Response());
  }

  public async calculateCallStatusStats(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    const authId = req.JWTUser?.authId;

    let cloudNumber : any ;
    let caller;
    let reciever;
    let startDate;
    let endDate: any = new Date();
    let flowName;
    let tags;
    let ParentCallSid;
    let CallType;
    let documentStatus;
    let ivrName;
    let digit;

    if (req.body.documentStatus) {
      documentStatus = req.body.documentStatus;
    }
    if (req.body.callType) {
      CallType = req.body.callType;
    }
    if (req.body.parentCallSid) {
      ParentCallSid = req.body.parentCallSid;
    }
    if (req.body.cloudNumber) {
      cloudNumber = req.body.cloudNumber;
    }
    if (req.body.CloudNumber) {
      cloudNumber = req.body.CloudNumber;
    }
    if (req.body.caller) {
      caller = req.body.caller;
    }
    if (req.body.reciever) {
      reciever = req.body.reciever;
    }
    if (req.body.startDate) {
      startDate = req.body.startDate;
    }
    if (req.body.endDate) {
      endDate = req.body.endDate;
    }
    if (req.body.flowName) {
      flowName = req.body.flowName;
    }
    if (req.body.tags) {
      tags = req.body.tags;
    }
    if (req.body.ivrName) {
      ivrName = req.body.ivrName;
    }
    if (req.body.digit) {
      digit = req.body.digit;
    }

    if (cloudNumber) {
      console.log(
        "CloudNumber from frontend : ",
        typeof cloudNumber,
        cloudNumber
      );
      cloudNumber = cloudNumber.map((item : any) => {
        if (!item.includes("+")) {
          item = `+${item}`;
        }
        return item;
      });
    }
    const documentStatusFilter = documentStatus
      ? { "Status.name": { $regex: documentStatus } }
      : {};
    const parentCallSidFilter = ParentCallSid
      ? { "ParentCall.ParentCallSid": ParentCallSid }
      : {};
    const callerFilter = caller
      ? { ContactNumber: { $regex: caller, $options: "i" } }
      : {};
    const recieverFilter = reciever
      ? {
          "ParentCall.ChildCall": {
            $elemMatch: { To: { $regex: reciever, $options: "i" } },
          },
        }
      : {};
    // const statusFilter = callStatus ? { CallStatus: { $in: callStatus } } : {};
    const cloudNumberFilter = cloudNumber
      ? { CloudNumber: { $in: cloudNumber } }
      : {};
    const dateFilter = startDate
      ? { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } }
      : {};
    const flowNameFilter = flowName
      ? { FlowName: { $regex: flowName, $options: "i" } }
      : {};
    const tagsFilter = tags ? { "Tags.name": { $in: tags } } : {};
    const callTypeFilter = CallType ? { "ParentCall.Direction": CallType } : {};
    const ivrNameFilter = ivrName
      ? {
          ivrDetails: {
            $elemMatch: { ivrName: { $regex: ivrName, $options: "i" } },
          },
        }
      : {};
    const pressedDigitsFilter = digit
      ? {
          ivrDetails: {
            $elemMatch: { Digit: { $regex: digit, $options: "i" } },
          },
        }
      : {};

    const combinationOfQueryForIvrDetails = {
      $and: [ivrNameFilter, pressedDigitsFilter],
    };


    const queryForCount = {
      ...documentStatusFilter,
      ...callTypeFilter ,
      ...parentCallSidFilter , 
      ...callerFilter, 
      ...recieverFilter, 
      ...cloudNumberFilter , 
      ...dateFilter , 
      ...flowNameFilter ,
      ...combinationOfQueryForIvrDetails ,
      ...tagsFilter 
  }
    // const queryParams = { ...req.query, AccountSid: authId };
    // const count = await countDocuments(queryParams);
    const totalCompletedCall = await countDocuments({AccountSid : authId , CallStatus :"completed" , ...queryForCount})
    const totalMissedCall = await countDocuments({AccountSid : authId , CallStatus :"no-answer", ...queryForCount})
    const totalFailedCall = await countDocuments({AccountSid : authId , CallStatus :"failed" , ...queryForCount})
    const totalBusyCall = await countDocuments({AccountSid : authId , CallStatus :"busy" , ...queryForCount})


    const response = {
      connectedCall : totalCompletedCall,
      missedCall : totalMissedCall + totalBusyCall,
      failedCall : totalFailedCall,
      totalCall : totalCompletedCall + totalMissedCall + totalFailedCall + totalBusyCall,
      status: true,
      code: 200,
      message: "Details Fetched!",
    };

    return res.status(200).json(response);
  }

  public async updateVoiceCdrById(req: IRequest, res: IResponse): Promise<any> {
    const id = req.params.id;
    const isValidId = isValidMongoDbObjectId(id)

    if(!isValidId){
        this.data = []
        this.status = false
        this.message = 'Please check the id!'
        this.code = 403

        return res.status(403).json(this.Response())
    }
    
    const notes = req.body.Notes;
    const tags = req.body.Tags;
    const status = req.body.Status
    if (notes) {
      const id = req.params.id;
      const updates = { $set: { Notes: notes } };
      const options = { upsert: false };
      await updateIvrFlowCdrWithId(id, updates, options);

      this.data = [];
      this.code = 204;
      this.status = true;
      this.message = "Details Updated!";

      return res.status(200).json(this.Response());
    } else if(tags){

      const id = req.params.id;
      const updates = { $set: { Tags: tags } };
      const options = { upsert: false };
      await updateIvrFlowCdrWithId(id, updates, options);

      this.data = [];
      this.code = 204;
      this.status = true;
      this.message = "Details Updated!";

      return res.status(200).json(this.Response());
    }else if(status){

      const id = req.params.id;
      const updates = { $set: { Status : status } };
      const options = { upsert: false };
      await updateIvrFlowCdrWithId(id, updates, options);

      this.data = [];
      this.code = 204;
      this.status = true;
      this.message = "Details Updated!";

      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.code = 403;
      this.status = false;
      this.message = "You can only update Tags , CallStatus and Notes!";

      return res.status(403).json(this.Response());
    }
  }

  public async getVoiceCdrById(req: IRequest, res: IResponse): Promise<any> {
    const id = req.params.id;
    const isValidId = isValidMongoDbObjectId(id)

    if(!isValidId){
        this.data = []
        this.status = false
        this.message = 'Please check the id!'
        this.code = 403

        return res.status(403).json(this.Response())
    }

    const queryParams = { ...req.query };
    const data = await getIvrFlowCdrWithId(id, queryParams);
    this.data = data;
    this.code = 200;
    this.message = "Details fetched!";

    return res.status(200).json(this.Response());
  }

  public async getVoiceCdr(req: IRequest, res: IResponse): Promise<any> {
    const authId = req.JWTUser?.authId;
    const queryParams = { ...req.query, AccountSid: authId };
    // console.log("Query controller : ", queryParams);
    const data = await getDetails(queryParams);
    const count = await countDocuments(queryParams);
    //console.log("Data is ", data);

    this.data = { data: data, totalCount: count };
    this.status = true;
    this.code = 200;
    this.message = "Details fetched!";

    return res.status(200).json(this.Response());
  }
}
