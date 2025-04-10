export interface ApiResponse<T> {
    status: number;
    body: T;
}  

export type Track = {
    id: number;
    title: string;
    artist: string;
    thumbnail_url: string;
};

export type Album = {
    id: number;
    title: string;
    artist: string;
    thumbnail_url: string;
};

export type Artist = {
    id: number;
    title: string;
    thumbnail_url: string;
};

export type User = {
    id: number;
    email: string;
    username: string;
    avatar: string;
};

export type AuthSendingData = {
    identifier?: string,
    username?: string,
    email?: string,
    password?: string,
    passwordRepeat?: string
}

export namespace TemplateAPI {
    export type TracksResponse = ApiResponse<Track[]>;

    export type ArtistsResponse = ApiResponse<Artist[]>;
    export type ArtistResponse = ApiResponse<Artist>;

    export type AlbumsResponse = ApiResponse<Album[]>;

    export type PlaylistsResponse = ApiResponse<Album[]>;
}

