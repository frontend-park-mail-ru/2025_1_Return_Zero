export namespace ParamTypes {
    export type UserUpdate = {
        username: string;
        email: string;
        password: string;
        new_email?: string;
        new_username?: string;
        new_password?: string;
        is_public_playlists: boolean;
        is_public_favorite_tracks: boolean;
        is_public_favorite_artists: boolean;
        is_public_minutes_listened: boolean;
        is_public_tracks_listened: boolean;
        is_public_artists_listened: boolean;
    };

    export type UserDelete = {
        username: string;
        email: string;
        password: string;
    };
}

export namespace DataTypes {
    export type Track = {
        id: number;
        title: string;
        thumbnail_url: string;
        duration: number;
        album_id: number;
        album: string;
        artists: {
            id: number;
            title: string;
            role: string;
            // added fields
            artist_page: string;
        }[];
        file_url?: string;
    };

    export type Album = {
        id: number;
        title: string;
        thumbnail_url: string;
        artists: {
            id: number;
            title: string;
            // added fields
            artist_page: string;
        };
        type: string;
        reelase_date: string;
    };

    export type Artist = {
        id: number;
        title: string;
        description: string;
        thumbnail_url: string;
        // added fields
        artist_page: string;
    };

    export type User = {
        id: number;
        email: string;
        username: string;
        avatar_url: string;
        // not included in /auth/check
        is_public_minutes_listened?: boolean;
        is_public_tracks_listened?: boolean;
        is_public_artists_listened?: boolean;
        is_public_playlists?: boolean;
        is_public_favorite_tracks?: boolean;
        is_public_favorite_artists?: boolean;
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
    export type TracksResponse = ApiResponse<DataTypes.Track[]>;
    export type TrackResponse = ApiResponse<DataTypes.Track>;
    export type ArtistsResponse = ApiResponse<DataTypes.Artist[]>;
    export type ArtistResponse = ApiResponse<DataTypes.Artist>;
    export type AlbumsResponse = ApiResponse<DataTypes.Album[]>;
    export type PlaylistsResponse = ApiResponse<DataTypes.Album[]>;
    export type UserResponse = ApiResponse<DataTypes.User>;
}
