import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
import {
  getAllCustomField,
  countCustomField,
  findOneCustomeVariable,
  createCustomField,
  findByIdAndUpdateCustomField,
  findByIdAndDeleteCustomField,
  findByIdCustomField
} from "../services/customFieldModel";

export default class CustomeField extends Controller {
  public constructor(models?: any) {
    super(models);
    this.getAllCustomField = this.getAllCustomField.bind(this);
    this.createCustomField = this.createCustomField.bind(this);
    this.checkIfKeyIsAlreadyExist = this.checkIfKeyIsAlreadyExist.bind(this);
    this.updateCustomField = this.updateCustomField.bind(this);
    this.deleteCustomField = this.deleteCustomField.bind(this);
    this.getCustomFieldById = this.getCustomFieldById.bind(this);
  }

  public async getCustomFieldById ( req : IRequest , res : IResponse ) : Promise<any>{
    const response = await findByIdCustomField(req.params.id)
    if(response){

        this.data = response
        this.code = 200
        this.message = 'Detail fetched!'
        this.status = true

        return res.status(200).json(this.Response())
    }else{
        this.data = []
        this.code = 404
        this.message = 'Something went wrong!'
        this.status = false

        return res.status(404).json(this.Response())
    }
  }

  public async deleteCustomField(req: IRequest, res: IResponse): Promise<any> {
    const response = await findByIdAndDeleteCustomField(req.params.id);
    if (response) {
      this.data = [];
      this.status = true;
      this.message = "Custom Field deleted!";
      this.code = 200;

      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.message = "Something went wrong!";
      this.code = 404;

      return res.status(404).json(this.Response());
    }
  }

  public async checkIfKeyIsAlreadyExist(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    const keyName = req.query.keyName;
    if (!keyName) {
      this.data = [];
      this.status = false;
      this.message = "Please Provide a keyName in query";
      this.code = 403;
      return res.status(403).json(this.Response());
    }

    const AccountSid = req.JWTUser?.authId;
    const query = { AccountSid: AccountSid, key: keyName };
    const isKeyAlreadyPresentInDb = await findOneCustomeVariable(query);
    if (isKeyAlreadyPresentInDb) {
      this.data = [];
      this.status = true;
      this.message = "Key Is Already Present";
      this.code = 200;
      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.message = "Key Is Not Present";
      this.code = 404;
      return res.status(404).json(this.Response());
    }
  }

  public async getAllCustomField(req: IRequest, res: IResponse): Promise<any> {
    const authId = req.JWTUser?.authId;
    const queryParams = { ...req.query, AccountSid: authId };
    const salesActivityData = await getAllCustomField(queryParams);
    const total = await countCustomField(queryParams);
    const data = {
      totalCount: total,
      data: salesActivityData,
    };
    this.data = data;
    this.status = true;
    this.message = "Successfully fetched all";
    return res.json(this.Response());
  }

  checkIfKeyIsThereInPayloadOrNot = (data: any) => {
    let result = true;
    if (data.key === undefined) {
      result = false;
    } else if (data.key === null) {
      result = false;
    } else if (data.key === "") {
      result = false;
    } else {
      result = true;
    }
    return result;
  };

  public async createCustomField(req: IRequest, res: IResponse): Promise<any> {
    const AccountSid = req.JWTUser?.authId;
    const userId = req.JWTUser?._id;
    const isKeyPresent = this.checkIfKeyIsThereInPayloadOrNot(req.body);
    console.log("Is Key Present :", isKeyPresent);
    if (isKeyPresent) {
      const keyName = req.body.key;
      const query = { AccountSid: AccountSid, key: keyName };
      const isKeyAlreadyPresentInDb = await findOneCustomeVariable(query);
      console.log("isKeyAlreadyPresentInDb : ", isKeyAlreadyPresentInDb);
      if (isKeyAlreadyPresentInDb) {
        this.data = [];
        this.status = false;
        this.message = "Key Is Already Present";
        this.code = 404;
        return res.status(404).json(this.Response());
      }
    }
    const salesActivityData = await createCustomField({
      ...req.body,
      AccountSid: AccountSid,
      user_id: userId,
    });
    this.data = salesActivityData;
    this.status = true;
    this.message = "Successfully created";
    this.code = 201;
    return res.status(201).json(this.Response());
  }

  public async updateCustomField(req: IRequest, res: IResponse): Promise<any> {
    const response = await findByIdAndUpdateCustomField(
      req.params.id,
      req.body,
      { upsert: false }
    );
    if (response) {
      this.data = [];
      this.status = true;
      this.message = "Custom Field updated!";
      this.code = 204;

      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.message = "Something went wrong!";
      this.code = 404;

      return res.status(404).json(this.Response());
    }
  }
}
