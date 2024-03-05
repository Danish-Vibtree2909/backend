import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
import {
  getGroups,
  countGroupsDocuments,
  createGroups,
  updateGroupsById,
  deleteOneGroupsById,
  getGroupsById,
} from "../services/groupModel";
import {isValidMongoDbObjectId} from '../helper/index';

export default class GroupController extends Controller {
  public constructor(model?: any) {
    super(model);
    this.getGroup = this.getGroup.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.getGroupById = this.getGroupById.bind(this);
  }

  public async getGroupById ( req : IRequest , res : IResponse ) : Promise<any>{
    const id = req.params.id
    const query = req.query
    const isValidId = isValidMongoDbObjectId(id)

    if(!isValidId){
        this.data = []
        this.status = false
        this.message = 'Please check the id!'
        this.code = 403

        return res.status(403).json(this.Response())
    }
    
    const response = await getGroupsById(id , query)

    this.data = response ? response : []
    this.code = 200
    this.status = true 
    this.message = 'Details fetched!'

    return res.status(200).json(this.Response())

  }

  public async getGroup(req: IRequest, res: IResponse): Promise<any> {
    const auth_id = req.JWTUser?.authId;
    const queryParams = { ...req.query, AccountId: auth_id };

    try {
      const groups = await getGroups(queryParams);
      const total = await countGroupsDocuments(queryParams);

      const data = {
        totalCount: total,
        data: groups,
      };
      this.data = data;
      this.status = true;
      this.message = "SuccessFully found the available groups.";

      return res.json(this.Response());
    } catch (err) {
      res.status(401).json({
        status: "Failed",
        message: "Didnt successed",
        err,
      });
    }
  }

  public async createGroup(req: IRequest, res: IResponse): Promise<any> {
    const auth_id = req.JWTUser?.authId;

    let data = { ...req.body, AccountId: auth_id };
    console.log(data);
    const response = await createGroups(data);

    if (response) {
      this.data = response;
      this.status = true;
      this.code = 201;
      this.message = "Group created!";

      return res.status(201).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.code = 404;
      this.message = "Something went wrong!";

      return res.status(404).json(this.Response());
    }
  }

  public async updateGroup(req: IRequest, res: IResponse): Promise<any> {
    const id = req.params.id
    const isValidId = isValidMongoDbObjectId(id)

    if(!isValidId){
        this.data = []
        this.status = false
        this.message = 'Please check the id!'
        this.code = 403

        return res.status(403).json(this.Response())
    }

    const myQuery = { _id: id };
    const options = { upsert: false };
    var newValues = { $set: { ...req.body } };

    const groupUpdatedData = await updateGroupsById(
      myQuery,
      newValues,
      options
    );
    if (groupUpdatedData) {
      this.data = [];
      this.status = true;
      this.code = 204;
      this.message = "Group updated!";

      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.code = 404;
      this.message = "Something went wrong!";

      return res.status(404).json(this.Response());
    }
  }

  public async deleteGroup(req: IRequest, res: IResponse): Promise<any> {

    const id = req.params.id
    const isValidId = isValidMongoDbObjectId(id)

    if(!isValidId){
        this.data = []
        this.status = false
        this.message = 'Please check the id!'
        this.code = 403

        return res.status(403).json(this.Response())
    }

    const myQuery = { _id: id };
    const contactDeletedData = await deleteOneGroupsById(myQuery);
    if (contactDeletedData) {
      this.data = [];
      this.status = true;
      this.code = 200;
      this.message = "Group deleted successfully.";

      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.code = 404;
      this.message = "Group deleted successfully.";

      return res.status(404).json(this.Response());
    }
  }
}
