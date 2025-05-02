import { API } from "./api";

// @ts-ignore
const oldGet = API.get.bind(API);
// @ts-ignore
API.get = async (endpoint: string) => {
    console.log(endpoint)
    switch (true) {
        default:
            return oldGet(endpoint);
    }
}


API.getFavoriteTracks = async (username: string, limit?: number, offset?: number) => API.getTracks(limit, offset);
API.getFavoriteAlbums = async (username: string, limit?: number, offset?: number) => API.getAlbums(limit, offset);
API.getFavoriteArtists = async (username: string, limit?: number, offset?: number) => API.getArtists(limit, offset);