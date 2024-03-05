import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
import { findOnendUpdateLead, deleteManyLead } from "../services/LeadModel";

export default class LeadController extends Controller {
  public constructor(model?: any) {
    super(model);
    this.createLead = this.createLead.bind(this);
    this.deleteLead = this.deleteLead.bind(this);
  }

  public async createLead(req: IRequest, res: IResponse): Promise<any> {
    const email = req.body.email
    if(!email){
        this.data = []
        this.code = 403
        this.status = false
        this.message = "Provide email!"

      return res.status(201).json(this.Response());

    }
    const query = {email : email};
    const body = { ...req.body };
    const options = {upsert : true}
    const response = await findOnendUpdateLead(query ,body, options);
    if (response) {
      this.data = response;
      this.status = true;
      this.code = 201;
      this.message = "Lead Created!";
      return res.status(201).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.code = 404;
      this.message = "Something went wrong!";
      return res.status(404).json(this.Response());
    }
  }

  public async deleteLead(req: IRequest, res: IResponse): Promise<any> {
    const email = req.body.email;
    const query = { email: email };

    const response = await deleteManyLead(query);
    if (response) {
      this.data = [];
      this.status = true;
      this.code = 200;
      this.message = "Lead Deleted!";
      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.code = 404;
      this.message = "Something went wrong!";
      return res.status(404).json(this.Response());
    }
  }
}
