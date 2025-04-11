import {
    ApiResponse,
    DataTypes,
    TemplateAPI,
    AuthSendingData,
} from './api_types.ts';

import { routes } from './routes';


export class API {
    static baseUrl = '/api/v1';

    static async get(endpoint: string) {
        const resp = await fetch(this.baseUrl + endpoint);
        if (resp.ok) {
            return await resp.json();
        }
        return (await API.processResponse(resp));
    }

    static async post(endpoint: string, data: any) {
        const resp = await fetch(this.baseUrl + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return (await API.processResponse(resp));
    }

    static async processResponse(resp: Response): Promise<ApiResponse<any>> {
        if (resp.ok) {
            let data = await resp.json();
            if (data.error)
                throw new Error(data.status + ': ' + data.error);
            return data;
        }
        throw new Error(resp.statusText);
    }

    static async getTracks(): Promise<TemplateAPI.TracksResponse> {
        const tracks_resp = (await API.get('/tracks'));
        tracks_resp.body = tracks_resp.body.map((track: any) => this.extendTrack(track));
        return tracks_resp
    }

    static async getTrack(id: number): Promise<TemplateAPI.TrackResponse> {
        return (await API.get(`/tracks/${id}`));
    }

    static async getAlbums(): Promise<TemplateAPI.AlbumsResponse> {
        const albums_resp = (await API.get('/albums'));
        albums_resp.body = albums_resp.body.map((album: any) => this.extendAlbum(album));
        return albums_resp
    }

    static async getArtists(): Promise<TemplateAPI.ArtistsResponse> {
        const artists_resp = (await API.get('/artists'));
        artists_resp.body = artists_resp.body.map((artist: any) => this.extendArtist(artist));
        return artists_resp
    }

    static async getArtist(id: number): Promise<TemplateAPI.ArtistResponse> {
        const artist_resp = (await API.get(`/artists/${id}`));
        artist_resp.body = this.extendArtist(artist_resp.body);
        return artist_resp
    }

    static async getArtistTracks(id: number): Promise<TemplateAPI.TracksResponse> {
        const tracks_resp = (await API.get(`/artists/${id}/tracks`));
        tracks_resp.body = tracks_resp.body.map((track: any) => this.extendTrack(track));
        return tracks_resp
    }

    static async getArtistAlbums(id: number): Promise<TemplateAPI.AlbumsResponse> {
        const albums_resp = (await API.get(`/artists/${id}/albums`));
        albums_resp.body = albums_resp.body.map((album: any) => this.extendAlbum(album));
        return albums_resp
    }

    static async getPlaylists(): Promise<TemplateAPI.PlaylistsResponse> {
        return await API.get('/playlists');
    }

    static async postSignup(data: AuthSendingData) {
        return await API.post('/auth/signup', data);
    }

    static async postLogin(data: AuthSendingData) {
        return await API.post('auth/login', data);
    }


    static async postLogout() {
        return await API.post('auth/logout', {});
    }

    static async getCurrentUser() {
        try {
            return (await API.get('/auth/check'));
        } catch (e) {
            return null;
        }
    }


    static extendTrack(track: any): DataTypes.Track {
        return {
            ...track,
            artists: track.artists.map((artist: any) => this.extendArtist(artist)),
        }
    }

    static extendAlbum(album: any): DataTypes.Album {
        return {
            ...album,
            artists: album.artists.map((artist: any) => this.extendArtist(artist)),
        }
    }

    static extendArtist(artist: any): DataTypes.Artist {
        return {
            ...artist,
            artist_page: routes.artistsRoute.build({ artist_id: artist.id })
        }
    }
}
