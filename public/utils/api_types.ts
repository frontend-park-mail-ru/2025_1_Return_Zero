export namespace DataTypes {
    export type Track = {
        id: number,
        title: string,
        thumbnail_url: string
        duration: number,
        album_id: number,
        album: string,
        artists: {
            id: number,
            title: string,
            role: string
            // added fields
            artist_page: string
        }[]
    }
    
    export type Album = {
        id: number,
        title: string,
        thumbnail_url: string,
        artists: {
            id: number,
            title: string
            // added fields
            artist_page: string
        },
        type: string,
        reelase_date: string,
    }
    
    export type Artist = {
        id: number,
        title: string,
        description: string,
        thumbnail_url: string,
        // added fields
        artist_page: string
    }
    
    export type User = {
        id: number,
        email: string,
        username: string,
        avatar: string
    }
}

export interface ApiResponse<T> {
    status: number,
    body: T
}  

export type AuthSendingData = {
    identifier?: string,
    username?: string,
    email?: string,
    password?: string,
    passwordRepeat?: string
}

export namespace TemplateAPI {
    export type TracksResponse = ApiResponse<DataTypes.Track[]>;

    export type ArtistsResponse = ApiResponse<DataTypes.Artist[]>;
    export type ArtistResponse = ApiResponse<DataTypes.Artist>;

    export type AlbumsResponse = ApiResponse<DataTypes.Album[]>;

    export type PlaylistsResponse = ApiResponse<DataTypes.Album[]>;
}

