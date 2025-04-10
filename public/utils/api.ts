import {
    TemplateAPI,
    AuthSendingData
} from './api_types.ts';

export class API {
    static baseUrl = '/api/v1';

    static async get(endpoint: string) {
        const resp = await fetch(this.baseUrl + endpoint);
        if (resp.ok) {
            return await resp.json();
        }
        return API.processResponse(resp);
    }

    static async post(endpoint: string, data: any) {
        const resp = await fetch(this.baseUrl + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return API.processResponse(resp);
    }

    static processResponse(resp: Response) {
        if (resp.ok) {
            return resp.json();
        }
        throw new Error(resp.statusText);
    }

    static async getTracks(): Promise<TemplateAPI.TracksResponse> {
        return (await API.get('/tracks?limit=20'));
    }

    static async getTrack(id: number): Promise<TemplateAPI.TrackResponse> {
        return (await API.get(`/tracks/${id}`));
    }

    static async getAlbums(): Promise<TemplateAPI.AlbumsResponse> {
        return (await API.get('/albums'));
    }

    static async getArtists(): Promise<TemplateAPI.ArtistsResponse> {
        return (await API.get('/artists'));
    }

    static async getPlaylists(): Promise<TemplateAPI.playlistsResponse> {
        return await API.get('/playlists');
    }

    static async postSignup(data: AuthSendingData) {
        return await API.post('/auth/signup', data);
    }

    static async postLogin(data: AuthSendingData) {
        return await API.post('/auth/login', data);
    }

    static async postLogout() {
        return await API.post('/logout', {});
    }

    static async getCurrentUser() {
        try {
            return (await API.get('/user'));
        } catch (e) {
            return null;
        }
    }
}
