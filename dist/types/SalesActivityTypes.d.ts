import { Document } from 'mongoose';
export interface SalesActivityTypes extends Document {
    type: string;
    contact_id: string;
    created_at: Date;
    notes: string;
}
//# sourceMappingURL=SalesActivityTypes.d.ts.map