import { Action } from "libs/flux/Action";
import { NotificationProps } from "components/notifications/Notification";

export namespace ACTIONS {
    export class USER_LOGIN extends Action<AppTypes.User> {}
    export class USER_CHANGE extends Action<AppTypes.User> {}
    export class USER_LOGOUT extends Action<null> {}

    export class TRACK_LIKE extends Action<AppTypes.Track> {}
    export class TRACK_ADD extends Action<AppTypes.Track> {}
    export class TRACK_LIKE_STATE extends Action<{ trackId: number, is_liked: boolean }> {}

    export class CONTENT_PLAYLISTS_CHANGED extends Action<null> {}
    export class LOAD_PLAYLISTS extends Action<null> {}
    export class CREATE_PLAYLIST extends Action<AppTypes.Playlist> {}
    export class EDIT_PLAYLIST extends Action<AppTypes.Playlist> {}
    export class DELETE_PLAYLIST extends Action<AppTypes.Playlist> {}

    export class CREATE_NOTIFICATION extends Action<NotificationProps> {}
    export class REMOVE_NOTIFICATION extends Action<string> {}

    export class AUDIO_TOGGLE_PLAY extends Action<null> {};
    export class AUDIO_SET_TRACK extends Action<string | null> {};
    export class AUDIO_SET_DURATION extends Action<null> {};
    export class AUDIO_SET_VOLUME extends Action<number> {};
    export class AUDIO_SET_CURRENT_TIME extends Action<number> {};
    export class AUDIO_TOGGLE_MUTE extends Action<null> {};
    export class AUDIO_RETURN_METADATA extends Action<null> {};
    export class AUDIO_PLAY extends Action<null> {};
    export class AUDIO_PAUSE extends Action<null> {};
    
    export class QUEUE_REPEAT extends Action<null> {};
    export class QUEUE_UNREPEAT extends Action<null> {};
    export class QUEUE_SHUFFLE extends Action<null> {};
    export class QUEUE_UNSHUFFLE extends Action<null> {};
    export class QUEUE_NEXT extends Action<null> {};
    export class QUEUE_PREV extends Action<null> {};
    export class QUEUE_ADD_SECTION extends Action<AppTypes.Track> {};
    export class QUEUE_ADD_MANUAL extends Action<AppTypes.Track> {};
    export class QUEUE_LIKE_CURRENT_TRACK extends Action<null> {};
    export class QUEUE_PROCESS_NEW_TRACKS extends Action<{ currentTrack: AppTypes.Track, tracks: AppTypes.Track[] }> {};

    export class JAM_OPEN extends Action<string> {};
    export class JAM_CLOSE extends Action<null> {};
    export class JAM_UPDATE extends Action<null> {};
    export class JAM_SET_TRACK extends Action<AppTypes.Track> {};
    export class JAM_SEEK extends Action<number> {};
    export class JAM_READY extends Action<null> {};
    export class JAM_HOST_LOAD extends Action<string> {};
    export class JAM_LEAVE extends Action<null> {};
}
