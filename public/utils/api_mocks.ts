import { API } from "./api";

// @ts-ignore
const oldGet = API.get.bind(API);
// @ts-ignore
API.get = async (endpoint: string) => {
    switch (true) {
        case endpoint.match(/^\/albums\/\d+$/) !== null:
            return {
                status: 200,
                body: {
                    id: 1,
                    title: 'Album 1',
                    thumbnail_url: 'https://placehold.jp/400x400.png',
                    artists: [{ id: 1, title: 'Artist 1' }, { id: 2, title: 'Artist 2' }],
                    type: 'album',
                    release_date: '2020-01-01',
                },
            }
        default:
            // @ts-ignore
            return oldGet(endpoint);
    }
}

API.getAlbumTracks = async (id: number) => API.getTracks();

API.getFavoriteTracks = async (username: string, limit?: number, offset?: number) => API.getTracks(limit, offset);
API.getFavoriteAlbums = async (username: string, limit?: number, offset?: number) => API.getAlbums(limit, offset);
API.getFavoriteArtists = async (username: string, limit?: number, offset?: number) => API.getArtists(limit, offset);

API.postTrackLike = async (id: number, value: boolean) => ({ status: 200, body: { id, value }});
API.postArtistLike = async (id: number, value: boolean) => ({ status: 200, body: { id, value }});
API.postArtistLike = async (id: number, value: boolean) => ({ status: 200, body: { id, value }});