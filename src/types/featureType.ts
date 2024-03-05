import { Document , Schema} from 'mongoose'
export default interface FeatureInterface extends Document{
    name: string;
    description: string;
    product: string;
    url: [Schema.Types.Mixed];
}
