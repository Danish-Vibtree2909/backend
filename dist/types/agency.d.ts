import { Document } from 'mongoose';
export default interface AgencyInterface extends Document {
    email: string;
    phone: string;
    firstname: string;
    lastname: string;
    agencyname: string;
    state: string;
    city: string;
    zipcode: string;
    country: string;
}
//# sourceMappingURL=agency.d.ts.map