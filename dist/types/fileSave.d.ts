import { Document } from 'mongoose';
export default interface IFileSave extends Document {
    name: String;
    size: Number;
    saved_as: String;
    type: String;
    completepath?: string;
}
//# sourceMappingURL=fileSave.d.ts.map