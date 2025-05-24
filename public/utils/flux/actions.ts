import { Action } from "libs/flux/Action";
import { NotificationProps } from "components/notifications/Notification";

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

    export class CREATE_NOTIFICATION extends Action<NotificationProps> {}
    export class REMOVE_NOTIFICATION extends Action<string> {}

    export class AUDIO_TOGGLE_PLAY extends Action<null> {};
    export class AUDIO_SET_TRACK extends Action<null> {};
    export class AUDIO_SET_DURATION extends Action<null> {};
    export class AUDIO_SET_VOLUME extends Action<number> {};
    export class AUDIO_SET_CURRENT_TIME extends Action<number> {};
    export class AUDIO_TOGGLE_MUTE extends Action<null> {};
    
    export class QUEUE_REPEAT extends Action<null> {};
    export class QUEUE_UNREPEAT extends Action<null> {};
    export class QUEUE_SHUFFLE extends Action<null> {};
    export class QUEUE_UNSHUFFLE extends Action<null> {};
    export class QUEUE_NEXT extends Action<null> {};
    export class QUEUE_PREV extends Action<null> {};
    export class QUEUE_ADD_SECTION extends Action<AppTypes.Track> {};
    export class QUEUE_ADD_MANUAL extends Action<AppTypes.Track> {};
    export class QUEUE_LIKE_CURRENT_TRACK extends Action<null> {};
}

