import { Document, Schema } from 'mongoose';
export default interface TicketInterface extends Document {
    subject: string;
    customer: string;
    project: string;
    assigned_to: string;
    assigned_user: Schema.Types.ObjectId;
    ticket_id: string;
    messages: [Schema.Types.Mixed];
    status: string;
    published_at: string;
    createdAt: Date;
    updatedAt: Date;
    attachments: string;
    fileLocation: string;
}
//# sourceMappingURL=ticketType.d.ts.map