import { Route } from '../libs/Router';

export const routes = {
    pageRoute: new Route('^/(tracks|albums|artists|profile|)'),
    artistsRoute: new Route('^/artists/([0-9]+)|^/artists', params => `/artists/${params.artist_id}`),
    profileRoute: new Route('^/profile/([^/]+|settings)|^/profile', params => `/profile/${params.username}`),

    authRoute: new Route('#(login|register)'),
    logoutRoute: new Route('/logout'),
}
