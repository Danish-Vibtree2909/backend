/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
export declare function getOneSubscription(queryParams: any): Promise<(import("mongoose").Document<unknown, {}, import("../types/SubscriptionType").default> & Omit<import("../types/SubscriptionType").default & {
    _id: import("mongoose").Types.ObjectId;
}, never>) | null>;
export declare function createSubscription(data: any): Promise<false | (import("mongoose").Document<unknown, {}, import("../types/SubscriptionType").default> & Omit<import("../types/SubscriptionType").default & {
    _id: import("mongoose").Types.ObjectId;
}, never>)>;
export declare function updateOneSubscription(query: any, update: any, options: any): Promise<false | import("mongoose").UpdateWriteOpResult>;
//# sourceMappingURL=SubscriptionModel.d.ts.map