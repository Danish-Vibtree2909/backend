import { Document } from 'mongoose';
import ViberRecordFormatted from './ViberFormattedTypes';
export default interface ViberConversation extends Document {
    conversation_id: any;
    assignedToBot: boolean;
    user_id: any;
    chat_hostname: any;
    participants: [
        {
            user_id: string;
            user_name: string;
            user_image: string;
            number: string;
        }
    ];
    type: string;
    messages: [
        ViberRecordFormatted
    ];
    unreadCount: number;
}
//# sourceMappingURL=ViberConversationTypes.d.ts.map