import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
import {
  countDocumentOfPlan,
  createPlan,
  getAllPlans,
  findByIdAndUpdatePlan,
  getByIdPlan,
} from "../services/PlanModel";
import PlansType from "../types/PlanTypes";

export default class PlanController extends Controller {
  public constructor(model?: any) {
    super(model);
    this.getAllPlans = this.getAllPlans.bind(this);
    this.creatPlan = this.creatPlan.bind(this);
    this.getPlanById = this.getPlanById.bind(this);
    this.updatePlan = this.updatePlan.bind(this);
  }

  public async updatePlan(req: IRequest, res: IResponse): Promise<any> {
    const id = req.params.id;
    const updates = { ...req.body };
    const option = { upsert: false };

    const response = await findByIdAndUpdatePlan(id, updates, option);

    if (response) {
      this.data = [];
      this.code = 204;
      this.status = true;
      this.message = "Details updated!";

      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.code = 404;
      this.status = false;
      this.message = "Something went wrong!";

      return res.status(404).json(this.Response());
    }
  }

  public async getPlanById(req: IRequest, res: IResponse): Promise<any> {
    const id = req.params.id;
    const response = await getByIdPlan(id);

    this.data = response;
    this.code = 200;
    this.message = "Details fetched ID";
    this.status = true;

    return res.status(200).json(this.Response());
  }

  public async getAllPlans(req: IRequest, res: IResponse): Promise<any> {
    const query = { ...req.query };
    const data = await getAllPlans(query);
    const count = await countDocumentOfPlan(query);

    this.data = {
      data: data,
      count: count,
    };
    this.status = true;
    this.message = "Plans Fetched!";
    this.code = 200;

    return res.status(200).json(this.Response());
  }

  public async creatPlan(req: IRequest, res: IResponse) {
    const data: PlansType = { ...req.body };
    const createdPlan = await createPlan(data);
    if (createdPlan) {
      this.data = [];
      this.code = 201;
      this.message = "Plan created!";
      this.status = true;

      return res.status(201).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.code = 404;
      this.message = "Something went wrong!";

      return res.status(404).json(this.Response());
    }
  }
}
