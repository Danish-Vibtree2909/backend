import { getOneSubscription } from "../services/SubscriptionModel";
import moment from "moment";
import { addDays } from '../helper/dateHelper';

async function validateSubscription(req: any, res: any, next: any) {
  const companyId = req.JWTUser.companyId;

  const subscriptionDetails = await getOneSubscription({
    companyId: companyId,
    sort: "-_id",
  });

//   console.log("Subscription Details : ", subscriptionDetails);
  if (subscriptionDetails) {
    if (
      subscriptionDetails.isExpired ||
      moment(addDays(subscriptionDetails.endDate , 1)).diff(new Date(), "days") <= 0
    ) {
      return res.status(402).json({
        data: [],
        status: false,
        code: 402,
        message: "Sorry your subsription is expired!",
      });
    }
    // console.log("subscriptionDetails.credits : ", subscriptionDetails.credits , typeof subscriptionDetails.credits)

    if (subscriptionDetails.credits < 1) {
      console.log("No credits : ", companyId);
      return res.status(402).json({
        data: [],
        status: false,
        code: 402,
        message: "Sorry you don't have enough credits!",
      });
    }
  }
  return next();
}

export default validateSubscription;
