import {
    ApiResponse,
    ParamTypes,
    TemplateAPI,
    AuthSendingData,
} from './api_types.ts';

import { routes } from './routes';


let csrf: string = undefined;
const CSRF_HEADER = 'X-Csrf-Token';


export class API {
    static baseUrl = '/api/v1';

    private static async get(endpoint: string) {
        const resp = await fetch(this.baseUrl + endpoint);
        csrf = resp.headers.get(CSRF_HEADER);
        return await API.processResponse(resp);
    }

    private static async post(endpoint: string, data: any) {
        const resp = await fetch(this.baseUrl + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Csrf-Token': csrf,
            },
            body: JSON.stringify(data),
        });

        return await API.processResponse(resp);
    }

    private static async postMultipart(endpoint: string, data: FormData) {
        const resp = await fetch(this.baseUrl + endpoint, {
            method: 'POST',
            headers: {
                'X-Csrf-Token': csrf,
            },
            body: data,
        });
        return await API.processResponse(resp);
    }

    private static async put(endpoint: string, data: any) {
        const resp = await fetch(this.baseUrl + endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Csrf-Token': csrf,
            },
            body: JSON.stringify(data),
        });
        return await API.processResponse(resp);
    }

    private static async delete(endpoint: string, data: any) {
        const resp = await fetch(this.baseUrl + endpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Csrf-Token': csrf,
            },
            body: JSON.stringify(data),
        });
        return await API.processResponse(resp);
    }

    static async processResponse(resp: Response): Promise<ApiResponse<any>> {
        if (!resp.ok) throw new Error(resp.statusText);
        let data = await resp.json();
        if (data.error) throw new Error(data.status + ': ' + data.error);
        return data;
    }


    static addParams(url: string, params: {[key: string]: any}): string {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            value && search.append(key, value.toString());
        }
        search && (url += `?${search.toString()}`);
        return url;
    }

    static async getTracks(limit?: number, offset?: number): Promise<TemplateAPI.TracksResponse> {
        const tracks_resp = await API.get(API.addParams('/tracks', {limit, offset}));
        tracks_resp.body = tracks_resp.body.map((track: AppTypes.Track) =>
            API.extendTrack(track)
        );
        return tracks_resp;
    }

    static async getTrack(id: number): Promise<TemplateAPI.TrackResponse> {
        return await API.get(`/tracks/${id}`);
    }

    static async getAlbumTracks(id: number): Promise<TemplateAPI.TracksResponse> {
        const tracks_resp = await API.get(`/albums/${id}/tracks`);
        tracks_resp.body = tracks_resp.body.map((track: AppTypes.Track) =>
            API.extendTrack(track)
        );
        return tracks_resp;
    }

    static async getArtistTracks(
        id: number,
        limit?: number,
        offset?: number
    ): Promise<TemplateAPI.TracksResponse> {
        const tracks_resp = await API.get(API.addParams(`/artists/${id}/tracks`, {limit, offset}));
        tracks_resp.body = tracks_resp.body.map((track: AppTypes.Track) =>
            API.extendTrack(track)
        );
        return tracks_resp;
    }

    static async getFavoriteTracks(username: string, limit?: number, offset?: number): Promise<TemplateAPI.TracksResponse> {
        const tracks_resp = await API.get(API.addParams(`/user/${username}/favorite`, {limit, offset}));
        tracks_resp.body = tracks_resp.body.map((track: AppTypes.Track) =>
            API.extendTrack(track)
        );
        return tracks_resp;
    }

    static async getHistoryTracks(
        username: string,
        limit?: number,
        offset?: number
    ): Promise<TemplateAPI.TracksResponse> {
        const tracks_resp = await API.get(API.addParams(`/user/${username}/history`, {limit, offset}));
        tracks_resp.body = tracks_resp.body.map((track: AppTypes.Track) =>
            API.extendTrack(track)
        );
        return tracks_resp;
    }


    static async getAlbums(limit?: number, offset?: number): Promise<TemplateAPI.AlbumsResponse> {
        const albums_resp = await API.get(API.addParams('/albums', {limit, offset}));
        albums_resp.body = albums_resp.body.map((album: AppTypes.Album) =>
            API.extendAlbum(album)
        );
        return albums_resp;
    }

    static async getArtistAlbums(
        id: number,
        limit?: number,
        offset?: number
    ): Promise<TemplateAPI.AlbumsResponse> {
        const albums_resp = await API.get(API.addParams(`/artists/${id}/albums`, {limit, offset}));
        albums_resp.body = albums_resp.body.map((album: AppTypes.Album) =>
            API.extendAlbum(album)
        );
        return albums_resp;
    }

    static async getFavoriteAlbums(username: string, limit?: number, offset?: number): Promise<TemplateAPI.AlbumsResponse> {
        const albums_resp = await API.get(API.addParams(`/user/${username}/favorite`, {limit, offset}));
        albums_resp.body = albums_resp.body.map((album: AppTypes.Album) =>
            API.extendAlbum(album)
        );
        return albums_resp;
    }


    static async getArtists(limit?: number, offset?: number): Promise<TemplateAPI.ArtistsResponse> {
        const artists_resp = await API.get(API.addParams('/artists', {limit, offset}));
        artists_resp.body = artists_resp.body.map((artist: AppTypes.Artist) =>
            API.extendArtist(artist)
        );
        return artists_resp;
    }

    static async getArtist(id: number): Promise<TemplateAPI.ArtistResponse> {
        const artist_resp = await API.get(`/artists/${id}`);
        artist_resp.body = API.extendArtist(artist_resp.body);
        return artist_resp;
    }

    static async getFavoriteArtists(username: string, limit?: number, offset?: number): Promise<TemplateAPI.ArtistsResponse> {
        const artists_resp = await API.get(API.addParams(`/user/${username}/favorite`, {limit, offset}));
        artists_resp.body = artists_resp.body.map((artist: AppTypes.Artist) =>
            API.extendArtist(artist)
        );
        return artists_resp;
    }


    static async getUserPlaylists(username: string, limit?: number, offset?: number): Promise<TemplateAPI.PlaylistsResponse> {
        return await API.get(API.addParams(`/user/${username}/playlists`, {limit, offset}));
    }


    static async getCheck(): Promise<TemplateAPI.UserResponse> {
        return await API.get('/auth/check');
    }

    static async getUserSettings(username: string): Promise<TemplateAPI.UserResponse> {
        return await API.get(`/user/${username}`);
    }

    
    static async postTrackLike(id: number, value: boolean = true): Promise<TemplateAPI.LikeResponse> {
        return await API.post(`/tracks/${id}/like`, { value });
    }

    static async postAlbumLike(id: number, value: boolean = true): Promise<TemplateAPI.LikeResponse> {
        return await API.post(`/albums/${id}/like`, { value });
    }

    static async postArtistLike(id: number, value: boolean = true): Promise<TemplateAPI.LikeResponse> {
        return await API.post(`/artists/${id}/like`, { value });
    }


    static async postSignup(
        data: AuthSendingData
    ): Promise<TemplateAPI.UserResponse> {
        return await API.post('/auth/signup', data);
    }
    
    static async postLogin(
        data: AuthSendingData
    ): Promise<TemplateAPI.UserResponse> {
        return await API.post('/auth/login', data);
    }

    static async postLogout() {
        return await API.post('/auth/logout', {});
    }
    

    static async postAvatar(data: FormData): Promise<any> {
        return await API.postMultipart(`/user/me/avatar`, data);
    }

    static async putUser(
        data: ParamTypes.PutUser
    ): Promise<TemplateAPI.UserResponse> {
        return await API.put(`/user/me`, data);
    }


    static async deleteUser(
        data: ParamTypes.UserDelete
    ): Promise<TemplateAPI.UserResponse> {
        return await API.delete(`/user/me`, data);
    }


    static async createStream(id: number) {
        return await API.post(`/tracks/${id}/stream`, {});
    }

    static async updateStream(id: number, duration: number) {
        return await API.put(`/streams/${id}`, { duration });
    }

    static extendTrack(track: any): AppTypes.Track {
        return {
            ...track,
            artists: track.artists.map((artist: any) =>
                API.extendArtist(artist)
            ),
        };
    }

    static extendAlbum(album: any): AppTypes.Album {
        return {
            ...album,
            artists: album.artists.map((artist: any) =>
                API.extendArtist(artist)
            ),
        };
    }

    static extendArtist(artist: any): AppTypes.Artist {
        return {
            ...artist,
            artist_page: routes.artistsRoute.build({ artist_id: artist.id }),
        };
    }
}
