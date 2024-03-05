import { Document , Schema } from 'mongoose'
export default interface ScreenshotInterface extends Document{
    title: string;
    description: string;
    product: string;
    url: [Schema.Types.Mixed]
}
