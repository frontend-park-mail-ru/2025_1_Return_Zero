import { Action } from "libs/flux/Action";

declare global {
   namespace ACTIONS {
        class USER_LOGIN extends Action<AppTypes.User> {}
        class USER_CHANGE extends Action<AppTypes.User> {}
        class USER_LOGOUT extends Action<null> {}
    }
}
