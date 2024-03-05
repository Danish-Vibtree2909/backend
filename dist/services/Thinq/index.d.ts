interface Did {
    carrierName: string;
    didSummary: string;
    id: number;
    npanxx: string;
    ratecenter: string;
    state: string;
    thinqTier: number;
    match: string;
}
export interface SearchResult {
    message: string;
    resultSet: string;
    exactDidsAmount: number;
    dids: Did[];
    statusCode?: number;
    error?: string;
}
export interface TN {
    account_location_id: string | null;
    caller_id: string | null;
    sms_routing_profile_id: string | null;
    route_id: number;
    features: {
        cnam: boolean;
        sms: boolean;
        e911: boolean;
    };
    did: number;
}
export interface TextMessage {
    from_did: string;
    to_did: string;
    message: string;
}
export interface MessageResponse {
    guid: string;
}
export interface ErrorInMessageResponse {
    "code": number;
    "message": string;
    "description": string;
}
export interface OriginationOrder {
    cooldown: number;
    message: string | null;
    account_id: string;
    user_id: string;
    status: string;
    tns: TN[];
    blocks: string[] | null;
    created: number;
    completed: number | null;
    invoice_id: number | null;
    invoice_url: string | null;
    sub_type: string;
    taxExemption: string | null;
    completion_started: number | null;
    account_name: string | null;
    billing_address: string | null;
    payment_type: string | null;
    payment_method: string | null;
    user_created: number | null;
    user_completed: number | null;
    total: number | null;
    subtotal: number | null;
    taxes: number | null;
    discount: number | null;
    credited_amount: number | null;
    summary: string | null;
    group_id: string | null;
    group_name: string | null;
    id: number;
    type: string;
    statusCode?: number;
    error?: string;
}
export declare function getAllNumberFromInventory(data: any): Promise<unknown>;
export declare function createOrderBeforePurchase(data: any): Promise<unknown>;
export declare function confirmOrderAfterPurchase(data: any): Promise<unknown>;
export declare function sendMessage(data: TextMessage): Promise<unknown>;
export {};
//# sourceMappingURL=index.d.ts.map