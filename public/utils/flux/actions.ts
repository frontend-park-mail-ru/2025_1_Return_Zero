import { Action } from "libs/flux/Action";

export namespace ACTIONS {
    export class USER_LOGIN extends Action<AppTypes.User> {}
    export class USER_CHANGE extends Action<AppTypes.User> {}
    export class USER_LOGOUT extends Action<null> {}

    export class TRACK_PLAY extends Action<AppTypes.Track> {}  // Переключает играющий трек
    export class TRACK_STATE_CHANGE extends Action<{playing: boolean}> {}  // Приостанавливает или воспроизводит играющий трек
    export class TRACK_LIKE extends Action<AppTypes.Track> {} // Устанавливает лайк или убирает лайк у трека

    export class CONTENT_PLAYLISTS_CHANGED extends Action<null> {}
    export class LOAD_PLAYLISTS extends Action<null> {}
    export class CREATE_PLAYLIST extends Action<AppTypes.Playlist> {}
    export class EDIT_PLAYLIST extends Action<AppTypes.Playlist> {}
    export class DELETE_PLAYLIST extends Action<AppTypes.Playlist> {}
}
