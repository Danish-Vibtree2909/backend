import { Document } from 'mongoose';
export default interface StoreTypes extends Document {
    erpCode: string;
    brand: string;
    storeName: string;
    city: string;
    zone: string;
    storeManager: string;
    cityHead: string;
    created_at: any;
    username: string;
    password: string;
    enterpriceUsername: string;
    enterpricePassword: string;
}
//# sourceMappingURL=StoreType.d.ts.map