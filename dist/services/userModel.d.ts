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
/// <reference types="mongoose/types/inferschematype" />
import { FilterQuery, UpdateQuery } from 'mongoose';
import UserPermissionUserInterface from '../types/userPermissionUser';
export declare function getUser(queryParams: any): Promise<Omit<import("mongoose").Document<unknown, {}, UserPermissionUserInterface> & Omit<UserPermissionUserInterface & {
    _id: import("mongoose").Types.ObjectId;
}, never>, never>[]>;
export declare function getDetailById(id: any, queryParams?: any): Promise<(import("mongoose").Document<unknown, {}, UserPermissionUserInterface> & Omit<UserPermissionUserInterface & {
    _id: import("mongoose").Types.ObjectId;
}, never>) | null>;
export declare function countUserDocuments(queryParams: any, userDetails?: any): Promise<number>;
export declare function getSingleUser(queryParams: {
    phone?: any;
    email?: any;
    populate?: any;
}): Promise<(import("mongoose").Document<unknown, {}, UserPermissionUserInterface> & Omit<UserPermissionUserInterface & {
    _id: import("mongoose").Types.ObjectId;
}, never>) | null>;
export declare function findOneAndUpdateUser(query: FilterQuery<UserPermissionUserInterface>, updates: UpdateQuery<UserPermissionUserInterface>, options: any): Promise<false | import("mongoose").ModifyResult<import("mongoose").Document<unknown, {}, UserPermissionUserInterface> & Omit<UserPermissionUserInterface & {
    _id: import("mongoose").Types.ObjectId;
}, never>>>;
export declare function createUser(data: any): Promise<false | (import("mongoose").Document<unknown, {}, UserPermissionUserInterface> & Omit<UserPermissionUserInterface & {
    _id: import("mongoose").Types.ObjectId;
}, never>)>;
export declare function deleteUser(query: any): Promise<false | import("mongodb").DeleteResult>;
//# sourceMappingURL=userModel.d.ts.map