"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const IvrStudios = new mongoose_1.Schema({
    xml_name: {
        type: String,
        required: true,
        default: null
    },
    joined: {
        type: String,
        required: true,
        default: null
    },
    xml_logic: [{
            is_gather: {
                type: Boolean,
                required: false,
                default: false
            },
            actionOnEmptyResult: {
                type: Boolean,
                required: false,
                default: false
            },
            action: {
                type: String,
                required: false,
                default: null
            },
            number: {
                type: String,
                required: false,
                default: null
            },
            // is_action_active: {
            //   type: Boolean,
            //   required: false,
            //   default: false
            // },
            numDigits: {
                type: String,
                required: false,
                default: null
            },
            sourceNumDigits: {
                type: String,
                required: false,
            },
            //FIRST IT IS SERIAL NOW WE USE PRIORITY
            // serialNo:{
            //   type: String,
            //   required: true,
            //   default: null
            // },
            priority: {
                type: String,
                required: false,
                default: null
            },
            audio: {
                type: String,
                required: false,
                default: null
            },
            level: {
                type: String,
                required: false,
            },
            timeout: {
                type: String,
                required: false,
                default: "20"
            },
            hangup: {
                type: Boolean,
                required: false,
            },
            make_request: {
                type: Boolean,
                required: false,
            },
            api_details: {
                type: mongoose_1.Schema.Types.Mixed,
                required: false,
            },
            conference: {
                type: Boolean,
                required: false,
            },
            conference_number: {
                type: String,
                required: false,
            },
            conference_details: {
                auth_id: {
                    type: String,
                    required: false,
                },
                auth_secret: {
                    type: String,
                    required: false,
                },
                purchased_number: {
                    type: String,
                    required: false,
                }
            }
        }]
});
exports.default = (0, mongoose_1.model)('ivr_studio', IvrStudios);
//# sourceMappingURL=IvrStudiosModel.js.map