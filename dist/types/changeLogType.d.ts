import { Document } from 'mongoose';
export default interface ChangelogInterface extends Document {
    version: string;
    type_of_changes: string;
    description: string;
    date_of_changes: string;
    product: string;
    teast: string;
}
//# sourceMappingURL=changeLogType.d.ts.map