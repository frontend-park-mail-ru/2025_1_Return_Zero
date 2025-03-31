import {
    Track,
    Album,
    Artist,
    User,
    LoginData,
    SignupData,
} from './api_types.ts';

export class API {
    static baseUrl = '/api';

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

    static async getTracks() {
        return (await API.get('/tracks?limit=20')) as Track[];
    }

    static async getAlbums() {
        return (await API.get('/albums')) as Album[];
    }

    static async getArtists() {
        return (await API.get('/artists')) as Artist[];
    }

    static async getPlaylists() {
        return await API.get('/playlists');
    }

    static async postSignup(data: SignupData) {
        return await API.post('/signup', data);
    }

    static async postLogin(data: LoginData) {
        return await API.post('/login', data);
    }

    static async postLogout() {
        return await API.post('/logout', {});
    }

    static async getCurrentUser() {
        return (await API.get('/user')) as User;
    }
}
