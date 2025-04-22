import Dispatcher from "libs/flux/Dispatcher";
import { Storage } from "libs/flux/Storage";
import { Action } from "libs/flux/Action";

type UserStorageStor = {
    user: AppTypes.User | null,
    history: AppTypes.Track[],
}

class UserStorage extends Storage<UserStorageStor> {
    constructor() {
        super();

        this.stor.user = null;
        this.stor.history = [];
        Dispatcher.register(this.handleAction.bind(this));
    }

    protected handleAction(action: Action<any>) {
        switch (true) {
            case action instanceof ACTIONS.USER_LOGIN:
            case action instanceof ACTIONS.USER_CHANGE:
            case action instanceof ACTIONS.USER_LOGOUT:
                this.stor.user = action.payload;
                this.callSubs(action);
                break;
        }
    }

    getUser() {
        return this.stor.user;
    }
}

export namespace STORAGES {
    export const USER_STORAGE = new UserStorage();
}
