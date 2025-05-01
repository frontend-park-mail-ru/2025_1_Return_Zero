import { API } from "./api";

// @ts-ignore
const oldGet = API.get.bind(API);
// @ts-ignore
API.get = async (endpoint: string) => {
    console.log(endpoint)
    switch (true) {
        case endpoint.match(/^\/albums\/\d+$/) !== null:
            return {
                status: 200,
                body: {
                    id: 1,
                    title: 'Album 1',
                    thumbnail_url: 'https://placehold.jp/400x400.png',
                    artists: [{ id: 1, title: 'Artist 1' }, { id: 2, title: 'Artist 2' }],
                    liked: false,
                    type: 'album',
                    release_date: '2020-01-01',
                },
            }
        case endpoint.match(/^\/playlists\/\d+$/) !== null:
            return {
                status: 200,
                body: {
                    id: 1,
                    title: 'Playlist 1',
                    thumbnail_url: 'https://placehold.jp/400x400.png',
                    user: { id: 1, username: 'User_1'},
                    liked: true,
                    created_at: '2020-01-01'
                }
            }
        case endpoint.match(/^\/user\/\w+\/playlists?/) !== null:
            return {
                status: 200,
                body: [
                    {
                        id: 1,
                        title: 'Playlist 1',
                        thumbnail_url: 'https://placehold.jp/99c1f1/ffffff/200x200.png',
                        user: { id: 1, username: 'User_1'},
                        liked: true,
                        created_at: '2020-01-01'
                    },
                    {
                        id: 2,
                        title: 'Playlist 2',
                        thumbnail_url: 'https://placehold.jp/8ff0a4/ffffff/200x200.png',
                        user: { id: 1, username: 'User_1'},
                        liked: true,
                        created_at: '2021-01-01'
                    },
                    {
                        id: 3,
                        title: 'Playlist 3',
                        thumbnail_url: 'https://placehold.jp/f9f06b/ffffff/200x200.png',
                        user: { id: 1, username: 'User_1'},
                        liked: true,
                        created_at: '2022-01-01'
                    },
                ]
            }
        default:
            return oldGet(endpoint);
    }
}

API.getAlbumTracks = async (id: number) => API.getTracks();
API.getPlaylistTracks = async (id: number, limit?: number, offset?: number) => API.getTracks();

API.getFavoriteTracks = async (username: string, limit?: number, offset?: number) => API.getTracks(limit, offset);
API.getFavoriteAlbums = async (username: string, limit?: number, offset?: number) => API.getAlbums(limit, offset);
API.getFavoriteArtists = async (username: string, limit?: number, offset?: number) => API.getArtists(limit, offset);