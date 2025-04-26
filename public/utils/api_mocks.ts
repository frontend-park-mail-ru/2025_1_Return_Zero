import { API } from "./api";

API.getFavoriteTracks = async (username: string, limit?: number, offset?: number) => API.getTracks(limit, offset);
API.getFavoriteAlbums = async (username: string, limit?: number, offset?: number) => API.getAlbums(limit, offset);
API.getFavoriteArtists = async (username: string, limit?: number, offset?: number) => API.getArtists(limit, offset);

API.postTrackLike = async (id: number, value: boolean) => ({ status: 200, body: { id, value }});
API.postArtistLike = async (id: number, value: boolean) => ({ status: 200, body: { id, value }});
API.postArtistLike = async (id: number, value: boolean) => ({ status: 200, body: { id, value }});