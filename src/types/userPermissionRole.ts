import { Document } from 'mongoose'

interface permissionType   {
    create : boolean,
    delete : boolean,
    edit : boolean,
    view : boolean
}
export default interface UserPermissionRoleInterface extends Document{
    name: string;
    description: string;
    type: string;
    AccountSid : string;
    userPermission: {
        Workflow: permissionType,
        ContactsManage: permissionType,
        ContactsNotes: permissionType,
        ContactsGroups: permissionType,
        VoicemailBox: permissionType,
    }
}
