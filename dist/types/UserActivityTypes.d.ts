import { Document } from 'mongoose';
export default interface UserActivityTypes extends Document {
    auth_id: string;
    user_id: any;
    type: string;
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=UserActivityTypes.d.ts.map