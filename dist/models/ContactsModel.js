"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// import {  isEmail, isMobilePhone } from 'validator';
// const validator = require('validator');
const mongoose = require("mongoose");
// let slug = require("mongoose-slug-generator");
// const validator = require("validator");
// mongoose.plugin(slug);
const ContactsModel = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    // slug: {
    //     type: String,
    //     slug:   ["firstName", "lastName"]
    // },
    phoneNumber: {
        type: String,
        // required: [true,"User should provide his/her number"],
        // trim: true,
        // validate: [isMobilePhone, "Provided value is not a contact number."],
        // unique: [true]
        required: true,
    },
    email: {
        type: String,
        // required: [true, "A Contact should contain a email"],
        // validate: [isEmail, "Provide a correct email address"]
        required: false,
        unique: false
    },
    photo: {
        type: String,
        required: false,
    },
    allies: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'allies',
        required: false
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    // designation: {
    //     type: String,
    //     required: false,
    //     max: [100, 'A Designation should be less than 100 characters'],
    //     validate(value) {
    //         if (!validator.isLength(value, {max:100})){
    //             throw Error("Designation should me smaller than 100 characters")
    //         }
    //     }
    // },
    // department: {
    //     type: String,
    //     required: false,
    //     max: [50, 'A Department should be less than 50 characters'],
    //     validate(value) {
    //         if (!validator.isLength(value, {max:50})){
    //             throw Error("Department should me smaller than 50 characters")
    //         }
    //     }
    // },
    // address: {
    //     type: String,
    //     required: false
    // },
    // city: {
    //     type: String,
    //     required: false,
    //     max: [200, 'A city Name should be smaller than 200 characters'],
    //     validate(value) {
    //         if (!validator.isLength(value, {max:200})){
    //             throw Error("City name should me smaller than 200 characters")
    //         }
    //     }
    // },
    // state: {
    //     type: String,
    //     required: false,
    //     max: [150, 'A state name should be smaller than 150 characters'],
    //     validate(value) {
    //         if (!validator.isLength(value, {max:150})){
    //             throw Error("State name should me smaller than 200 characters")
    //         }
    //     }
    // },
    country: {
        type: String,
        required: false,
        // max: [100, 'A country Name should be less than 100 characters '],   
        // validate(value) {
        //     if (!validator.isLength(value, {max:100})){
        //         throw Error("Country name should me smaller than 200 characters")
        //     }
        // }
    },
    // pinCode: {
    //     type: String, 
    //     required: false,
    //     validate(value) {
    //         if (!validator.isLength(value, {max:16})){
    //             throw Error("Postal code should be less than 16 digits")
    //         }
    //     }
    // },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    // phoneSecondary: {
    //     type: String,
    //     trim: true,
    //     required: false,
    // },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    Tags: [
        {
            type: mongoose_1.Schema.Types.Mixed,
            required: false
        }
    ],
    ContactType: {
        type: String,
        required: false,
    },
    AssignUser: {
        type: String,
        required: false,
    },
    // We are using this AssignTo here to make sticky-agent fast because in assign-user it is string and taking time to execute but here we can populate
    AssignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },
    AssignGroup: {
        type: String,
        required: false,
    },
    TimeZone: {
        type: String,
        required: false,
    },
    Tasks: [{
            description: {
                type: String,
                required: false,
            },
            dueDate: {
                type: Date,
                required: false,
            },
            createdDate: {
                type: Date,
                default: Date.now(),
                required: true,
            },
            assignTo: {
                type: mongoose_1.Schema.Types.Mixed,
                required: false,
            },
            status: {
                type: String,
                required: false,
            }
        }],
    CustomVariables: [
        {
            name: {
                type: String,
                required: false,
            },
            value: {
                type: mongoose_1.Schema.Types.Mixed,
                required: false,
            },
            type: {
                type: String,
                required: false,
            },
            selected_value: {
                type: String,
                required: false,
            }
        }
    ],
    Notes: [{
            value: {
                type: String,
                required: false,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
                required: true
            }
        }],
    groups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
        },
    ],
    AccountSid: {
        type: String,
        required: false,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    }
});
const GroupModel = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    AccountId: {
        type: String,
        required: false,
    },
    descrition: {
        type: String,
        requried: false,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    contacts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "contact",
        },
    ],
});
// ContactsModel.path('email').validate(
//     async (email) => {
//         const emailCount = await mongoose.models.contact.countDocuments({email})
//         return !emailCount;
//     }, 
//     'Email Already exists')
// ContactsModel.path('phoneNumber').validate(
//     async(phoneNumber) => {
//         // console.log("I am running", phoneNumber);
//         const numCount = await mongoose.models.contact.countDocuments({phoneNumber})
//         // console.log("I am the number count",numCount);
//         return !numCount;
//     }, 
// 'Phone number must be Unique')
// ContactsModel.path('phoneSecondary').validate(
//     async(phoneSecondary) => {
//         const secCount = await mongoose.models.contact.countDocuments({phoneSecondary})
//         return !secCount;
//     },
// 'Secondary Phone number already exist in the DataBase.')
GroupModel.path('name').validate(async (name) => {
    const groupCount = await mongoose.models.Group.countDocuments({ name });
    return !groupCount;
}, 'This group name already exist in the Database');
let contactModel = (0, mongoose_1.model)('contact', ContactsModel);
let groupModel = (0, mongoose_1.model)('Group', GroupModel);
module.exports = {
    contactModel,
    groupModel
};
//# sourceMappingURL=ContactsModel.js.map