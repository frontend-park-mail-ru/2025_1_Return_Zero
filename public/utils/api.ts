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

    private static async putMultipart(endpoint: string, data: FormData) {
        const resp = await fetch(this.baseUrl + endpoint, {
            method: 'PUT',
            headers: {
                'X-Csrf-Token': csrf,
            },
            body: data,
        })
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

    static async getTrack(id: number): Promise<TemplateAPI.TrackResponse> {
        const tracks_resp = await API.get(`/tracks/${id}`);
        tracks_resp.body = API.extendTrack(tracks_resp.body, API.getTrack, {id})
        return tracks_resp;
    }

    static async getTracks(limit?: number, offset?: number): Promise<TemplateAPI.TracksResponse> {
        const url = API.addParams('/tracks', {limit, offset});
        const tracks_resp = await API.get(url);
        tracks_resp.body = tracks_resp.body.map((track: AppTypes.Track) =>
            API.extendTrack(track, API.getTracks, {limit, offset})
        );
        return tracks_resp;
    }

    static async searchTracks(query: string): Promise<TemplateAPI.TracksResponse> {
        const url = API.addParams('/tracks/search', {query});
        const tracks_resp = await API.get(url);
        tracks_resp.body = tracks_resp.body.map((track: AppTypes.Track) =>
            API.extendTrack(track, API.searchTracks, {query})
        );
        return tracks_resp;
    }

    static async getAlbumTracks(id: number): Promise<TemplateAPI.TracksResponse> {
        const url = `/albums/${id}/tracks`;
        const tracks_resp = await API.get(url);
        tracks_resp.body = tracks_resp.body.map((track: AppTypes.Track) =>
            API.extendTrack(track, API.getAlbumTracks, { id })
        );
        return tracks_resp;
    }

    static async getArtistTracks(
        id: number,
        limit?: number,
        offset?: number
    ): Promise<TemplateAPI.TracksResponse> {
        const url = API.addParams(`/artists/${id}/tracks`, {limit, offset});
        const tracks_resp = await API.get(url);
        tracks_resp.body = tracks_resp.body.map((track: AppTypes.Track) =>
            API.extendTrack(track, API.getArtistTracks, { id, limit, offset })
        );
        return tracks_resp;
    }

    static async getPlaylistTracks(
        id: number,
        limit?: number,
        offset?: number,
    ): Promise<TemplateAPI.TracksResponse> {
        const url = API.addParams(`/playlists/${id}/tracks`, {limit, offset});
        const tracks_resp = await API.get(url);
        tracks_resp.body = tracks_resp.body.map((track: AppTypes.Track) =>
            API.extendTrack(track, API.getPlaylistTracks, { id, limit, offset })
        );
        return tracks_resp;
    }

    static async getFavoriteTracks(username: string, limit?: number, offset?: number): Promise<TemplateAPI.TracksResponse> {
        const url = API.addParams(`/user/${username}/tracks`, {limit, offset});
        const tracks_resp = await API.get(url);
        tracks_resp.body = tracks_resp.body.map((track: AppTypes.Track) =>
            API.extendTrack(track, API.getFavoriteTracks, { username, limit, offset })
        );
        return tracks_resp;
    }

    static async getHistoryTracks(
        limit?: number,
        offset?: number
    ): Promise<TemplateAPI.TracksResponse> {
        const url = API.addParams(`/user/me/history`, {limit, offset});
        const tracks_resp = await API.get(url);
        tracks_resp.body = tracks_resp.body.map((track: AppTypes.Track) =>
            API.extendTrack(track, API.getHistoryTracks, { limit, offset })
        );
        return tracks_resp;
    }

    
    static async getAlbum(id: number): Promise<TemplateAPI.AlbumResponse> {
        const album_resp = (await API.get(`/albums/${id}`));
        album_resp.body = this.extendAlbum(album_resp.body);
        return album_resp;
    }

    static async getAlbums(limit?: number, offset?: number): Promise<TemplateAPI.AlbumsResponse> {
        const albums_resp = await API.get(API.addParams('/albums', {limit, offset}));
        albums_resp.body = albums_resp.body.map((album: AppTypes.Album) =>
            API.extendAlbum(album)
        );
        return albums_resp;
    }

    static async searchAlbums(query: string): Promise<TemplateAPI.AlbumsResponse> {
        const albums_resp = await API.get(API.addParams('/albums/search', {query}));
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
        const albums_resp = await API.get(API.addParams(`/user/${'me'}/albums`, {limit, offset}));
        albums_resp.body = albums_resp.body.map((album: AppTypes.Album) =>
            API.extendAlbum(album)
        );
        return albums_resp;
    }


    static async getArtist(id: number): Promise<TemplateAPI.ArtistResponse> {
        const artist_resp = await API.get(`/artists/${id}`);
        artist_resp.body = API.extendArtist(artist_resp.body);
        return artist_resp;
    }

    static async getArtists(limit?: number, offset?: number): Promise<TemplateAPI.ArtistsResponse> {
        const artists_resp = await API.get(API.addParams('/artists', {limit, offset}));
        artists_resp.body = artists_resp.body.map((artist: AppTypes.Artist) =>
            API.extendArtist(artist)
        );
        return artists_resp;
    }

    static async searchArtists(query: string): Promise<TemplateAPI.ArtistsResponse> {
        const artists_resp = await API.get(API.addParams('/artists/search', {query}));
        artists_resp.body = artists_resp.body.map((artist: AppTypes.Artist) =>
            API.extendArtist(artist)
        );
        return artists_resp;
    }

    static async getFavoriteArtists(username: string, limit?: number, offset?: number): Promise<TemplateAPI.ArtistsResponse> {
        const artists_resp = await API.get(API.addParams(`/user/${username}/artists`, {limit, offset}));
        artists_resp.body = artists_resp.body.map((artist: AppTypes.Artist) =>
            API.extendArtist(artist)
        );
        return artists_resp;
    }

    
    static async getPlaylist(id: number): Promise<TemplateAPI.PlaylistResponse> {
        const playlist_resp = await API.get(`/playlists/${id}`);
        playlist_resp.body = API.extendPlaylist(playlist_resp.body);
        return playlist_resp;
    }

    static async getPlaylists(limit?: number, offset?: number): Promise<TemplateAPI.PlaylistsResponse> {
        const playlists_resp = await API.get(API.addParams('/playlists/me', {limit, offset}));
        playlists_resp.body = playlists_resp.body.map((playlist: any) => API.extendPlaylist(playlist));
        return playlists_resp;
    }

    static async searchPlaylists(query: string): Promise<TemplateAPI.PlaylistsResponse> {
        const playlists_resp = await API.get(API.addParams('/playlists/search', {query}));
        playlists_resp.body = playlists_resp.body.map((playlist: any) => API.extendPlaylist(playlist));
        return playlists_resp;
    }

    static async getTrackPlaylists(track_id: number): Promise<ApiResponse<AppTypes.TrackPlaylist[]>> {
        const playlists_resp = await API.get(API.addParams(`/playlists/to-add`, { trackId: track_id}));
        playlists_resp.body = playlists_resp.body.map((playlist: any) => API.extendPlaylist(playlist));
        return playlists_resp;
    }

    static async getUserPlaylists(username: string, limit?: number, offset?: number): Promise<TemplateAPI.PlaylistsResponse> {
        const playlists_resp = await API.get(API.addParams(`/user/${username}/playlists`, {limit, offset}));
        playlists_resp.body = playlists_resp.body.map((playlist: any) => API.extendPlaylist(playlist));
        return playlists_resp;
    }

    static async postPlaylist(title: string, thumbnail: File): Promise<TemplateAPI.PlaylistResponse> {
        const data = new FormData();
        data.append('title', title);
        data.append('thumbnail', thumbnail);
        const playlist_resp = await API.postMultipart('/playlists', data);
        playlist_resp.body = API.extendPlaylist(playlist_resp.body);
        return playlist_resp;
    }

    static async putPlaylist(id: number, title: string, thumbnail: File): Promise<TemplateAPI.PlaylistResponse> {
        const data = new FormData();
        data.append('title', title);
        if (thumbnail) {
            data.append('thumbnail', thumbnail);
        }
        const playlist_resp = await API.putMultipart(`/playlists/${id}`, data);
        playlist_resp.body = API.extendPlaylist(playlist_resp.body);
        return playlist_resp;
    }

    static async deletePlaylist(id: number) {
        return await API.delete(`/playlists/${id}`, {});
    }

    static async addTrackPlaylist(track_id: number, playlist_id: number) {
        return await API.post(`/playlists/${playlist_id}/tracks`, { track_id });
    }

    static async deleteTrackPlaylist(track_id: number, playlist_id: number) {
        return await API.delete(`/playlists/${playlist_id}/tracks/${track_id}`, {});
    }


    static async getCheck(): Promise<TemplateAPI.UserResponse> {
        return await API.get('/auth/check');
    }

    static async getUserSettings(username: string): Promise<TemplateAPI.UserResponse> {
        return await API.get(`/user/${username}`);
    }

    
    static async postTrackLike(id: number, value: boolean) {
        return await API.post(`/tracks/${id}/like`, { value });
    }

    static async postAlbumLike(id: number, value: boolean) {
        return await API.post(`/albums/${id}/like`, { value });
    }

    static async postArtistLike(id: number, value: boolean) {
        return await API.post(`/artists/${id}/like`, { value });
    }

    static async postPlaylistLike(id: number, value: boolean) {
        return await API.post(`/playlists/${id}/like`, { value });
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


    static async getLabelArtists(limit?: number, offset?: number): Promise<TemplateAPI.ArtistsResponse> {
        const artists_resp = await API.get(API.addParams('/label/artists', {limit, offset}));
        artists_resp.body = artists_resp.body.map((artist: AppTypes.Artist) =>
            API.extendArtist(artist)
        );
        return artists_resp;
    }

    static async postLabelArtist(title: string, thumbnail: File): Promise<TemplateAPI.ArtistResponse> {
        const data = new FormData();
        data.append('title', title);
        data.append('thumbnail', thumbnail);
        const artist_resp = await API.postMultipart('/label/artist', data);
        artist_resp.body = API.extendArtist(artist_resp.body);
        return artist_resp;
    }

    static async putLabelArtist(id: number, title: string, thumbnail?: File): Promise<TemplateAPI.ArtistResponse> {
        const data = new FormData();
        data.append('title', title);
        if (thumbnail) {
            data.append('thumbnail', thumbnail);
        }
        const artist_resp = await API.putMultipart(`/label/artist/${id}`, data);
        artist_resp.body = API.extendArtist(artist_resp.body);
        return artist_resp;
    }

    static async deleteLabelArtist(id: number) {
        return await API.delete(`/label/artist/${id}`, {});
    }


    static extendTrack(track: any, retriever_func: Function, retriever_args: Record<string, any>): AppTypes.Track {
        return {
            ...track,
            album_page: `/albums/${track.album_id}`,
            artists: track.artists.map((artist: any) =>
                API.extendArtist(artist)
            ),

            retriever_func,
            retriever_args,
        };
    }

    static extendAlbum(album: any): AppTypes.Album {
        return {
            ...album,
            album_page: `/albums/${album.id}`,
            artists: album.artists.map((artist: any) =>
                API.extendArtist(artist)
            ),
            release_date: new Date(album.release_date),
        };
    }

    static extendArtist(artist: any): AppTypes.Artist {
        return {
            ...artist,
            artist_page: routes.artistsRoute.build({ artist_id: artist.id }),
        };
    }

    static extendPlaylist(playlist: any): AppTypes.Playlist {
        return {
            ...playlist,
            user_page: `/profile/${playlist.username}`,
            playlist_page: `/playlists/${playlist.id}`
        };
    }
}
