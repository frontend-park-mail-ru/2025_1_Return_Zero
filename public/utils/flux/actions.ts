import { Action } from "libs/flux/Action";

export namespace ACTIONS {
    export class USER_LOGIN extends Action<AppTypes.User> {}
    export class USER_CHANGE extends Action<AppTypes.User> {}
    export class USER_LOGOUT extends Action<null> {}

    export class TRACK_PLAY extends Action<AppTypes.Track> {}  // Переключает играющий трек
    export class TRACK_STATE_CHANGE extends Action<{playing: boolean}> {}  // Приостанавливает или воспроизводит играющий трек
}
