"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQueryFromCustomVariable = exports.isValidMongoDbObjectId = exports.firstMondayOfWeek = exports.iso = exports.date = exports.url = exports.randomnumber = exports.jwtverify = exports.jwtsign = exports.validEmailaddress = exports.api_key = exports.calculateAge = exports.replaceAll = exports.validatePassword = exports.removeAllSpace = exports.hashPassword = void 0;
/* eslint-disable camelcase */
const uuid_1 = require("uuid");
const conf = __importStar(require("../config/index"));
const jwt = __importStar(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dateHelper_1 = require("./dateHelper");
Object.defineProperty(exports, "firstMondayOfWeek", { enumerable: true, get: function () { return dateHelper_1.firstMondayOfWeek; } });
const ObjectId = require('mongoose').Types.ObjectId;
const isValidMongoDbObjectId = (id) => {
    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
};
exports.isValidMongoDbObjectId = isValidMongoDbObjectId;
const api_key = () => {
    return (0, uuid_1.v4)();
};
exports.api_key = api_key;
const validEmailaddress = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
exports.validEmailaddress = validEmailaddress;
const jwtsign = (obj) => {
    return jwt.sign(obj, conf.SALT, { expiresIn: conf.TOKEN_EXPIRE });
};
exports.jwtsign = jwtsign;
const jwtverify = (jwt_sig) => {
    return jwt.verify(jwt_sig, conf.SALT);
};
exports.jwtverify = jwtverify;
const randomnumber = () => {
    return Math.floor((Math.random() * 100000) + 1);
};
exports.randomnumber = randomnumber;
/**
 * hashes a password
 * @param {string} password - password to hash
 * @returns {string} hashed password
 */
const hashPassword = async (password) => await bcryptjs_1.default.hash(password, 10);
exports.hashPassword = hashPassword;
/**
 * Validate a password
 * @param {string} password
 * @param {string} hash
 * @returns {boolean} is the password valid
 */
const validatePassword = async (password, hash) => await bcryptjs_1.default.compare(password, hash);
exports.validatePassword = validatePassword;
const url = (link) => {
    return link;
};
exports.url = url;
const date = () => {
    return new Date();
};
exports.date = date;
function getAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    if (today.getFullYear() < birthDate.getFullYear()) {
        throw new Error('You did not yet on earth!. \n Please check your Date of birth');
    }
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
const calculateAge = (dateString) => {
    const date = (0, moment_1.default)(dateString, 'DD-MM-YYYY');
    if (!date.isValid()) {
        throw new Error('Date format is valid it should be DD-MM-YYYY');
    }
    const age = getAge(date);
    if (age > 100) {
        throw new Error('Sorry you are dead or going to die. \n Please correct your date of birth');
    }
    if (age < 18) {
        throw new Error('You are not eligible for this website, < 18 ');
    }
    return getAge(date);
};
exports.calculateAge = calculateAge;
function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}
exports.replaceAll = replaceAll;
const iso = (nonisodate) => {
    return (0, moment_1.default)(nonisodate, 'DD-MM-YYYY').format('YYYY-MM-DD');
};
exports.iso = iso;
const removeAllSpace = (string) => {
    console.log(string);
    return replaceAll(String(string.trim()), ' ', '');
};
exports.removeAllSpace = removeAllSpace;
const buildQueryFromCustomVariable = (query) => {
    let dbQuery = {};
    try {
        const jsonQuery = JSON.parse(query);
        let keys = Object.keys(jsonQuery);
        let values = Object.values(jsonQuery);
        console.log("Keys : ", keys);
        console.log("Values : ", values);
        // { "status.name" : {$in : [...status]} }
        dbQuery = { "CustomVariables.name": { $in: [...keys] }, "CustomVariables.selected_value": { $in: [...values] } };
        console.log("DB-Query : ", dbQuery);
        return dbQuery;
    }
    catch (err) {
        console.log("Error : ", err);
        return dbQuery;
    }
};
exports.buildQueryFromCustomVariable = buildQueryFromCustomVariable;
//# sourceMappingURL=index.js.map