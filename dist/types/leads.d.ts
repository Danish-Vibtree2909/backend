import { Document } from 'mongoose';
export default interface LeadInterface extends Document {
    name: string;
    email: string;
    phone: string;
    category: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    channel: string;
    type: string;
    status: string;
    notes: string;
}
//# sourceMappingURL=leads.d.ts.map