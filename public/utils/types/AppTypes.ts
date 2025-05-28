declare global {
    namespace AppTypes {
        type Track = {
            id: number;
            title: string;
            thumbnail_url: string;
            is_liked: boolean;
            duration: number;
            file_url?: string;

            album_id: number;
            album: string;
            album_page: string; // extended

            artists: {
                id: number;
                title: string;
                role: string;
                artist_page: string; // extended
            }[];
            
            retriever_func: Function;
            retriever_args: Record<string, any>;
        };
    
        type Album = {
            id: number;
            title: string;
            thumbnail_url: string;
            album_page: string; // extended
            artists: {
                id: number;
                title: string;
                artist_page: string; // extended
            }[];
            type: string;
            release_date: Date;
            is_liked: boolean,
        };
    
        type Artist = {
            id: number;
            title: string;
            description: string;
            thumbnail_url: string;
            listeners_count: number;
            favorites_count: number;
            is_liked: boolean;
            // added fields
            artist_page: string;
        };

        type Playlist = {
            id: number;
            title: string;
            thumbnail_url: string,
            playlist_page: string, // extended
            username: string,
            user_page: string, // extended
            is_liked: boolean
        }

        type TrackPlaylist = Playlist & {
            is_included: boolean;
        }
    
        type User = {
            id: number;
            username: string;
            email: string;
            avatar_url: string;
            is_label: boolean;
            // not included in /auth/check
            privacy?: {
                is_public_minutes_listened: boolean;
                is_public_tracks_listened: boolean;
                is_public_artists_listened: boolean;
                is_public_playlists: boolean;
                is_public_favorite_tracks: boolean;
                is_public_favorite_artists: boolean;
            };
            statistics?: {
                minutes_listened?: number;
                tracks_listened?: number;
                artists_listened?: number;
            };
        };
    }
} 

export {};
