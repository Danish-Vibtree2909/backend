import { Document } from 'mongoose';
declare enum sexual_prefer {
    Male = "Male",
    Female = "Female",
    Both = "Both"
}
export declare enum i_am {
    SugarDaddy = "Sugar Daddy",
    SugarBaby = "Sugar Baby",
    SugarBabyMale = "Sugar Baby Male",
    SugarMomma = "Sugar Momma",
    GaySugarDaddy = "Gay Sugar Daddy",
    WomenForExtraMarital = "Women For Extra Marital",
    ManForExtraMarital = "Man For Extra Marital"
}
export default interface IProfile extends Document {
    Register: any;
    user_id: string;
    profile_picture: String;
    pictures_collage: any;
    zip_code: String;
    country: String;
    full_address: String;
    sexual_preference: sexual_prefer;
    interested_in: i_am;
    looking_for_age_beetween: {
        start: Number;
        end: Number;
    };
    city: String;
    state: String;
    race: String;
    height: {
        foot: Number;
        inch: Number;
    };
    body_type: Number;
    annual_income: Number;
    profile_heading: String;
    about_your_self: String;
    looking_for_describe: String;
}
export {};
//# sourceMappingURL=profile.d.ts.map