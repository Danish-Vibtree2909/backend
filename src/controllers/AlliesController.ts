import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
import AlliesTypes from "../types/alliesType";
import {
  getAllAllies,
  countDocumentAllies,
  createAllies,
  findByIdAndUpdateAllies,
  findByIdAndDeleteAllies,
  getByIdAllies,
} from "../services/AlliesModel";
import { isValidMongoDbObjectId } from "../helper/index";

export default class BlocklistController extends Controller {
  public constructor(model?: any) {
    super(model);
    this.getAllies = this.getAllies.bind(this);
    this.createAllies = this.createAllies.bind(this);
    this.updateAllies = this.updateAllies.bind(this);
    this.deleteAllies = this.deleteAllies.bind(this);
    this.getAlliesById = this.getAlliesById.bind(this);
  }

  public async getAllies(req: IRequest, res: IResponse): Promise<any> {
    const authId = req.JWTUser?.authId;
    const queryParams = { ...req.query, authId: authId };

    const blocklists = await getAllAllies(queryParams);

    const total = await countDocumentAllies(queryParams);
    const data = {
      totalCount: total,
      data: blocklists,
    };

    this.data = data;
    this.status = true;
    this.message = "Fetched Blocklists";
    this.code = 200;

    return res.status(200).json(this.Response());
  }

  public async createAllies(req: IRequest, res: IResponse): Promise<any> {
    const body: AlliesTypes = { ...req.body};

    if(!body.partner){
        this.data = [];
        this.status = false;
        this.message = "Missing parameter partner";
        this.code = 403;
    
        return res.status(201).json(this.Response());
    }
    const createdBlocklist = await createAllies(body);

    this.data = createdBlocklist;
    this.status = true;
    this.message = "Added to Allies";
    this.code = 201;

    return res.status(201).json(this.Response());
  }

  public async updateAllies(req: IRequest, res: IResponse): Promise<any> {
    const query = req.params.id;
    const isValidId = isValidMongoDbObjectId(query);

    if (!isValidId) {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }
    const updates = req.body;
    const options = { upsert: false };
    const updatedBlockList = await findByIdAndUpdateAllies(
      query,
      updates,
      options
    );

    if (updatedBlockList) {
      this.data = [];
      this.status = true;
      this.message = "Updated  Allies";
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

  public async deleteAllies(req: IRequest, res: IResponse): Promise<any> {
    const id = req.params.id;
    const isValidId = isValidMongoDbObjectId(id);

    if (!isValidId) {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }
    const deletedBlockList = await findByIdAndDeleteAllies(id);
    if (deletedBlockList) {
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

  public async getAlliesById(req: IRequest, res: IResponse): Promise<any> {
    const id = req.params.id;
    const query = { ...req.query };
    const isValidId = isValidMongoDbObjectId(id);

    if (!isValidId) {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }
    const foundDetailsOfBlockList = await getByIdAllies(id, query);
    if (foundDetailsOfBlockList) {
      this.data = foundDetailsOfBlockList;
      this.status = true;
      this.code = 200;
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
}
