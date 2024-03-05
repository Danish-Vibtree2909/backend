export interface SendFeedback {
    business_uuid: string;
    branch: number;
    reviewer_name: string;
    contact_number: string;
    email: string;
    review_time: string;
    rating: number;
    review_text: string;
    review_tags: string;
    remarks: string;
}
export declare function sendFeedbackFormData(data: SendFeedback): Promise<unknown>;
export declare function sendFeedbackJson(data: SendFeedback): Promise<unknown>;
//# sourceMappingURL=wowMomo.d.ts.map