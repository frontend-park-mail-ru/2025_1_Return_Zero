import { Action } from "libs/flux/Action";

export namespace ACTIONS {
    export class USER_LOGIN extends Action<AppTypes.User> {}
    export class USER_CHANGE extends Action<AppTypes.User> {}
    export class USER_LOGOUT extends Action<null> {}
}
