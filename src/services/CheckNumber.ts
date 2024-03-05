import NumbersModel from "../models/availableNumbers";
import request from "request";
const httpClient = request;

const searchNumbers = async (
  country: string,
  type: string,
  id: string,
  secret: string,
  page: string
) => {
  return new Promise((resolve: any, reject: any) => {
    let Link = "https://api.vibconnect.io/v1";
    const link: string =
      Link +
      "/Accounts/" +
      id +
      "/AvailablePhoneNumbers/" +
      country +
      "/" +
      type +
      "?page=" +
      page;
    console.log(link);
    const tok = id + ":" + secret;
    const hash = Buffer.from(tok).toString("base64");

    const options = {
      headers: {
        Authorization: "Basic " + hash,
      },
    };
    httpClient.get(link, options, (err: Error, res: any, body: any) => {
      if (err) {
        reject(err);
      }
      if (body) {
        resolve(JSON.parse(body));
      }
    });
  });
};

const fetchNumberFromVibconnectAndSave = async (
  country: string,
  type: string,
  authID: string,
  authSecret: string,
  page: number,
  lastPage?: number
) => {
  let numbers: any;
  let listOfAvailableNumbers = [];
  let lastPageNumber = 0;
  // if(!req.query.country || !req.query.type){
  //   return res.status(400).send({
  //     message: 'country and type are required'
  //   })
  // }

  const numberInDataBase = await NumbersModel.find().sort({ created_at: -1 });
  numbers = await searchNumbers(
    country,
    type,
    authID,
    authSecret,
    page.toString()
  );
  console.log("page", page);
  console.log("lastPage", lastPage);

  if (numbers) {
    listOfAvailableNumbers = numbers.available_phone_numbers;
    lastPageNumber = numbers.last_page;
  }
  const b = numberInDataBase;
  const a = listOfAvailableNumbers;

  const isSameUser = (a: any, b: any) =>
    a.phone_number == b.phone_number &&
    a.country_code == b.country_code &&
    a.country_iso == b.country_iso &&
    a.type == b.type &&
    a.capability == b.capability &&
    a.mrc == b.mrc &&
    a.nrc == b.nrc &&
    a.rps == b.rps &&
    a.initial_pulse == b.initial_pulse &&
    a.sub_pulse == b.sub_pulse &&
    a.acc_id == b.acc_id &&
    a.parent_act_id == b.parent_act_id &&
    a.application_id == b.application_id &&
    a.application_name == b.application_name &&
    a.status == b.status &&
    a.purchased_time == b.purchased_time &&
    a.released_time == b.released_time;
  const onlyInLeft = (left: any, right: any, compareFunction: any) =>
    left.filter(
      (leftValue: any) =>
        !right.some((rightValue: any) => compareFunction(leftValue, rightValue))
    );

  const onlyInA = onlyInLeft(a, b, isSameUser);
  const onlyInB = onlyInLeft(b, a, isSameUser);

  const newNumbersAfterComparing = [...onlyInA, ...onlyInB];
  // console.log( "new User : ",newNumbersAfterComparing)
  Promise.all(
    newNumbersAfterComparing.map(async (item) => {
      const user = await NumbersModel.findOne({
        phone_number: item.phone_number,
      });
      if (!user) {
        const newUser = new NumbersModel({ ...item });
        // console.log("New Numbers : ", newUser);
        await newUser.save();
      }
    })
  );

  setTimeout(async () => {
    if (page >= lastPage!) {
      console.log("Done");
      return;
    } else {
      page++;
      await fetchNumberFromVibconnectAndSave(
        country,
        type,
        authID,
        authSecret,
        page,
        lastPageNumber
      );
    }
  }, 30000);
};

export const checkNUmbersFromVibconnectAndSave = async (pages: number) => {
  try {
    let numbers : any ;
    let country = "IND";
    let type = "Local";
    let authID = "9EE1ABQDGDIC92CPOVFM";
    let authSecretId = "eFeYqmOikIUbT7cFGErHYTsV2eXjT7i4dP4RSNGE";
    let page = pages;
    let lastPage;

    await NumbersModel.deleteMany({});
    numbers = await searchNumbers(
      country,
      type,
      authID,
      authSecretId,
      page.toString()
    );

    if (numbers) {
      lastPage = numbers.last_page;
    }
    console.log("Last page : ", lastPage);

    fetchNumberFromVibconnectAndSave(
      country,
      type,
      authID,
      authSecretId,
      pages,
      lastPage
    );
    setTimeout(() => {
      checkNUmbersFromVibconnectAndSave(1);
    }, 86400000);
  } catch (error) {
    console.log("error", error);
  }
};
