declare global {
    namespace AppTypes {
        type Track = {
            id: number;
            title: string;
            thumbnail_url: string;
            liked: boolean;
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
        };
    
        type Artist = {
            id: number;
            title: string;
            description: string;
            liked: boolean;
            thumbnail_url: string;
            listeners_count: number;
            favorites_count: number;
            // added fields
            artist_page: string;
        };
    
        type User = {
            id: number;
            username: string;
            email: string;
            avatar_url: string;
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

        type Like = {
            id: number;
            value: boolean;
        }
    }
} 

export {};
