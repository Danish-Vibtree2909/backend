import { Document , Schema } from 'mongoose'
export default interface SlidshowInterface extends Document{
    title: string;
    description: string;
    product: string;
    url: [Schema.Types.Mixed];
    slideShowImage : string;
}
