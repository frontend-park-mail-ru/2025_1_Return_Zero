export namespace ParamTypes {
    export type PutUser = {
        password?: string;
        new_email?: string;
        new_username?: string;
        new_password?: string;
        privacy: {
            is_public_playlists: boolean;
            is_public_favorite_tracks: boolean;
            is_public_favorite_artists: boolean;
            is_public_minutes_listened: boolean;
            is_public_tracks_listened: boolean;
            is_public_artists_listened: boolean;
        };
    };

    export type UserDelete = {
        username: string;
        email: string;
        password: string;
    };
}

export interface ApiResponse<T> {
    status: number;
    body: T;
}

export type AuthSendingData = {
    identifier?: string;
    username?: string;
    email?: string;
    password?: string;
    passwordRepeat?: string;
};

export namespace TemplateAPI {
    export type TrackResponse = ApiResponse<AppTypes.Track>;
    export type TracksResponse = ApiResponse<AppTypes.Track[]>;
    
    export type AlbumResponse = ApiResponse<AppTypes.Album>;
    export type AlbumsResponse = ApiResponse<AppTypes.Album[]>;

    export type ArtistResponse = ApiResponse<AppTypes.Artist>;
    export type ArtistsResponse = ApiResponse<AppTypes.Artist[]>;

    export type PlaylistResponse = ApiResponse<AppTypes.Playlist>;
    export type PlaylistsResponse = ApiResponse<AppTypes.Playlist[]>;

    export type LikeResponse = ApiResponse<AppTypes.Like>;

    export type UserResponse = ApiResponse<AppTypes.User>;
}
