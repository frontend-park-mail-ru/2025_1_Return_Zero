export interface ApiResponse<T> {
    status: number;
    body: T;
}  

export type TrackBody = {
    id: number;
    title: string;
    role: string;
}

export type Track = {
    id: number;
    title: string;
    artists: TrackBody[];
    image: string;
    duration: number;
    file_url: string;
    thumbnail_url: string;
};

export type Album = {
    id: number;
    title: string;
    artist: string;
    image: string;
};

export type Artist = {
    id: number;
    title: string;
    image: string;
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
    export type TrackResponse = ApiResponse<Track>;
    export type TracksResponse = ApiResponse<Track[]>;
    export type ArtistsResponse = ApiResponse<Artist[]>;
    export type AlbumsResponse = ApiResponse<Album[]>;
    export type playlistsResponse = ApiResponse<Album[]>;
}

