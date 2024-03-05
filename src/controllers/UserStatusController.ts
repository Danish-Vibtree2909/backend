import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
import userStatusInterface from "../types/userStatusTypes";
import {
  getUserStatus,
  countDocumentUserStatus,
  createUserSatus,
  findByIdAndUpdateUserStatus,
  findByIdAndDeleteUserStatus,
  getUserStatusById,
} from "../services/UserStatusModel";
import { isValidMongoDbObjectId } from "../helper/index";

export default class UserStatusController extends Controller {
  public constructor(model?: any) {
    super(model);
    this.getUserById = this.getUserById.bind(this);
    this.getAllUserStatus = this.getAllUserStatus.bind(this);
    this.postUserStatus = this.postUserStatus.bind(this);
    this.udateUserStatus = this.udateUserStatus.bind(this);
    this.deleteUserStatus = this.deleteUserStatus.bind(this);
    this.getStatuOfOwn = this.getStatuOfOwn.bind(this)
  }

  public async getStatuOfOwn ( req : IRequest , res : IResponse ){
    const userId = req.JWTUser?._id
    const query = { userId : userId}

    const userDetails = await getUserStatus(query)
    
    this.data = userDetails
    this.code = 200
    this.status = true
    this.message = 'Details Fetched'

    return res.status(200).json(this.Response())
  }

  public async getUserById(req: IRequest, res: IResponse) {
    const query = req.params.id;
    const isValidId = isValidMongoDbObjectId(query);

    if (!isValidId) {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }

    const queryParams = { ...req.query };
    const data = await getUserStatusById(query, queryParams);
    if (data) {
      this.data = data;
      this.status = true;
      this.code = 204;
      this.message = "Detail Fetched!";

      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.message = "Something went wrong";
      this.code = 403;

      return res.status(403).json(this.Response());
    }
  }

  public async getAllUserStatus(req: IRequest, res: IResponse): Promise<any> {
    const authId = req.JWTUser?.authId;
    const query = { ...req.query, authId: authId };
    const userStatusDetails = await getUserStatus(query);
    const total = await countDocumentUserStatus(query);

    const data = {
      totalCount: total,
      data: userStatusDetails,
    };

    this.code = 200;
    this.data = data;
    this.status = true;
    this.message = "Status Fetched";
    return res.status(200).json(this.Response());
  }

  public async postUserStatus(req: IRequest, res: IResponse): Promise<any> {
    const authId = req.JWTUser?.authId;
    const userId = req.JWTUser?._id;

    const query = {userId : userId}
    const isUserStatusExist = await getUserStatus(query)
    if(isUserStatusExist.length > 0){

        this.data = []
        this.status = false
        this.code = 403
        this.message = 'User already exist';

        return res.status(403).json(this.Response())
    }

    const body: userStatusInterface = {
      ...req.body,
      authId: authId,
      userId: userId,
    };
    const userStatus = await createUserSatus(body);

    this.data = userStatus;
    this.status = true;
    this.message = "Created Status";
    this.code = 201;

    return res.status(201).json(this.Response());
  }

  public async udateUserStatus(req: IRequest, res: IResponse): Promise<any> {
    const query = req.params.id;
    const isValidId = isValidMongoDbObjectId(query);

    if (!isValidId) {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }

    const body = req.body;
    const options = { upsert: false };

    const userStatusUpdated = await findByIdAndUpdateUserStatus(
      query,
      body,
      options
    );
    if (userStatusUpdated) {
      this.data = [];
      this.status = true;
      this.message = "Updated User Status";
      this.code = 204;

      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }
  }

  public async deleteUserStatus(req: IRequest, res: IResponse): Promise<any> {
    const id = req.params.id;
    const isValidId = isValidMongoDbObjectId(id);

    if (!isValidId) {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }

    const userDeleted = await findByIdAndDeleteUserStatus(req.params.id);

    if (userDeleted) {
      this.data = [];
      this.status = true;
      this.code = 204;
      this.message = "Detail Deleted!";

      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.message = "Something went wrong";
      this.code = 403;

      return res.status(403).json(this.Response());
    }
  }
}
