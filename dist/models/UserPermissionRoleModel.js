"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserPermissionRoleModel = new mongoose_1.Schema({
    name: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: true,
        default: 'superadmin',
    },
    AccountSid: {
        type: String,
        required: false
    },
    userPermission: {
        Workflow: {
            create: {
                type: Boolean,
                default: true,
                required: false
            },
            delete: {
                type: Boolean,
                default: true,
                required: false
            },
            edit: {
                type: Boolean,
                default: true,
                required: false
            },
            view: {
                type: Boolean,
                default: true,
                required: false
            }
        },
        ContactsManage: {
            create: {
                type: Boolean,
                default: true,
                required: false
            },
            delete: {
                type: Boolean,
                default: true,
                required: false
            },
            edit: {
                type: Boolean,
                default: true,
                required: false
            },
            view: {
                type: Boolean,
                default: true,
                required: false
            }
        },
        ContactsNotes: {
            create: {
                type: Boolean,
                default: true,
                required: false
            },
            delete: {
                type: Boolean,
                default: true,
                required: false
            },
            edit: {
                type: Boolean,
                default: true,
                required: false
            },
            view: {
                type: Boolean,
                default: true,
                required: false
            }
        },
        ContactsGroups: {
            create: {
                type: Boolean,
                default: true,
                required: false
            },
            delete: {
                type: Boolean,
                default: true,
                required: false
            },
            edit: {
                type: Boolean,
                default: true,
                required: false
            },
            view: {
                type: Boolean,
                default: true,
                required: false
            }
        },
        VoicemailBox: {
            create: {
                type: Boolean,
                default: true,
                required: false
            },
            delete: {
                type: Boolean,
                default: true,
                required: false
            },
            edit: {
                type: Boolean,
                default: true,
                required: false
            },
            view: {
                type: Boolean,
                default: true,
                required: false
            }
        },
        Inbox: {
            create: {
                type: Boolean,
                default: true,
                required: false
            },
            delete: {
                type: Boolean,
                default: true,
                required: false
            },
            edit: {
                type: Boolean,
                default: true,
                required: false
            },
            view: {
                type: Boolean,
                default: true,
                required: false
            }
        }
    }
});
exports.default = (0, mongoose_1.model)('role', UserPermissionRoleModel);
//# sourceMappingURL=UserPermissionRoleModel.js.map