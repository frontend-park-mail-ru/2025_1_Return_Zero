import { Route } from '../libs/Router';

export const routes = {
    pageRoute: new Route('^/(tracks|albums|artists|profile|all|)'),
    artistsRoute: new Route(
        '^/artists/([0-9]+)(/popular-tracks|/popular-albums)?|^/artists',
        (params) => `/artists/${params.artist_id}${params.type ? '/'+params.type : ''}`
    ),
    profileRoute: new Route(
        '^/profile/([^/#?]+|settings)|^/profile',
        (params) => `/profile/${params.username}`
    ),
    allRoute: new Route(
        '^/all/(loved-albums|recommendations-albums|loved-artists|recommendation-artists|history|loved|recommendations)|^/all',
        (params) => `/all/${params.type}`
    ),

    authRoute: new Route('#(login|register|logout)')
};
