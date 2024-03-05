import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
import BlockListTypes from "../types/blocklistTypes";
import {
  getAllBlockList,
  countDocumentBlockList,
  createBlockList,
  findByIdAndUpdateBlockList,
  findByIdAndDeleteBlocklist,
  getByIdBlocklist,
} from "../services/BlockListModel";
import { isValidMongoDbObjectId } from "../helper/index";

export default class BlocklistController extends Controller {
  public constructor(model?: any) {
    super(model);
    this.getBlockList = this.getBlockList.bind(this);
    this.createBlockList = this.createBlockList.bind(this);
    this.updateBlockList = this.updateBlockList.bind(this);
    this.deleteBlocklist = this.deleteBlocklist.bind(this);
    this.getBlockListById = this.getBlockListById.bind(this);
  }

  public async getBlockList(req: IRequest, res: IResponse): Promise<any> {
    const authId = req.JWTUser?.authId;
    const queryParams = { ...req.query, authId: authId };

    const blocklists = await getAllBlockList(queryParams);

    const total = await countDocumentBlockList(queryParams);
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

  public async createBlockList(req: IRequest, res: IResponse): Promise<any> {
    const authId = req.JWTUser?.authId;
    const body: BlockListTypes = { ...req.body, authId: authId };
    const createdBlocklist = await createBlockList(body);

    this.data = createdBlocklist;
    this.status = true;
    this.message = "Added to Blocklist";
    this.code = 201;

    return res.status(201).json(this.Response());
  }

  public async updateBlockList(req: IRequest, res: IResponse): Promise<any> {
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
    const updatedBlockList = await findByIdAndUpdateBlockList(
      query,
      updates,
      options
    );

    if (updatedBlockList) {
      this.data = [];
      this.status = true;
      this.message = "Updated  Blocklist";
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

  public async deleteBlocklist(req: IRequest, res: IResponse): Promise<any> {
    const id = req.params.id;
    const isValidId = isValidMongoDbObjectId(id);

    if (!isValidId) {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }
    const deletedBlockList = await findByIdAndDeleteBlocklist(id);
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

  public async getBlockListById(req: IRequest, res: IResponse): Promise<any> {
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
    const foundDetailsOfBlockList = await getByIdBlocklist(id, query);
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
