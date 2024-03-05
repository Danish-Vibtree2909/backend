import { Document } from 'mongoose';
export default interface ContactInterface extends Document {
    firstname: string;
    lastname: string;
    email: string;
    phone: number;
    designation: string;
    department: string;
    country: string;
    state: string;
    city: string;
    zipcode: number;
}
//# sourceMappingURL=contactsType.d.ts.map