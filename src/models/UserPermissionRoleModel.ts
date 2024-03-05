import { model, Schema } from "mongoose";
import UserPermissionRoleInterface from "../types/userPermissionRole";

const UserPermissionRoleModel: Schema = new Schema({
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
  AccountSid : {
    type: String,
    required: false
  },
  userPermission : {
    Workflow:{
 
       create : {
        type:Boolean,
        default: true,
        required : false
      },
      delete : {
        type:Boolean,
        default: true,
        required : false
      },
      edit : {
        type:Boolean,
        default: true,
        required : false
      },
      view : {
        type:Boolean,
        default: true,
        required : false
      }
    },
    ContactsManage:{
 
       create : {
        type:Boolean,
        default: true,
        required : false
      },
      delete : {
        type:Boolean,
        default: true,
        required : false
      },
      edit : {
        type:Boolean,
        default: true,
        required : false
      },
      view : {
        type:Boolean,
        default: true,
        required : false
      }
    },
    ContactsNotes:{
 
      create : {
       type:Boolean,
       default: true,
       required : false
     },
     delete : {
       type:Boolean,
       default: true,
       required : false
     },
     edit : {
       type:Boolean,
       default: true,
       required : false
     },
     view : {
       type:Boolean,
       default: true,
       required : false
     }
    },
    ContactsGroups:{
 
      create : {
       type:Boolean,
       default: true,
       required : false
     },
     delete : {
       type:Boolean,
       default: true,
       required : false
     },
     edit : {
       type:Boolean,
       default: true,
       required : false
     },
     view : {
       type:Boolean,
       default: true,
       required : false
     }
    },
    VoicemailBox:{
 
       create : {
        type:Boolean,
        default: true,
        required : false
      },
      delete : {
        type:Boolean,
        default: true,
        required : false
      },
      edit : {
        type:Boolean,
        default: true,
        required : false
      },
      view : {
        type:Boolean,
        default: true,
        required : false
      }
    },
    Inbox:{
 
      create : {
       type:Boolean,
       default: true,
       required : false
     },
     delete : {
       type:Boolean,
       default: true,
       required : false
     },
     edit : {
       type:Boolean,
       default: true,
       required : false
     },
     view : {
       type:Boolean,
       default: true,
       required : false
     }
   }
  }
});

export default model<UserPermissionRoleInterface>('role',UserPermissionRoleModel);
