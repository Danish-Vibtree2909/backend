import { Document, Schema } from 'mongoose';
export default interface ProductInterface extends Document {
    product_name: string;
    description: string;
    product_image: any;
    product_users: Schema.Types.ObjectId;
    grid_color: boolean;
    product_number: number;
}
//# sourceMappingURL=productType.d.ts.map