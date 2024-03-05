import { firstMondayOfWeek } from './dateHelper';
declare const isValidMongoDbObjectId: (id: any) => boolean;
declare const api_key: () => string;
declare const validEmailaddress: (email: string) => boolean;
declare const jwtsign: (obj: object) => string;
declare const jwtverify: (jwt_sig: string) => any;
declare const randomnumber: () => number;
/**
 * hashes a password
 * @param {string} password - password to hash
 * @returns {string} hashed password
 */
declare const hashPassword: (password: string) => Promise<string>;
/**
 * Validate a password
 * @param {string} password
 * @param {string} hash
 * @returns {boolean} is the password valid
 */
declare const validatePassword: (password: string, hash: string) => Promise<boolean>;
declare const url: (link: string) => string;
declare const date: () => Date;
declare const calculateAge: (dateString: string) => any;
declare function replaceAll(string: String, search: string, replace: string): string;
declare const iso: (nonisodate: any) => any;
declare const removeAllSpace: (string: string) => string;
declare const buildQueryFromCustomVariable: (query: string) => {};
export { hashPassword, removeAllSpace, validatePassword, replaceAll, calculateAge, api_key, validEmailaddress, jwtsign, jwtverify, randomnumber, url, date, iso, firstMondayOfWeek, isValidMongoDbObjectId, buildQueryFromCustomVariable };
//# sourceMappingURL=index.d.ts.map