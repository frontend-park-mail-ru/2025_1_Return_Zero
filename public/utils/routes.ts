import { Route } from '../libs/Router';

export const routes = {
    pageRoute: new Route('^/(tracks|albums|artists|profile|settings|)'),
    artistsRoute: new Route('^/artists/([0-9]+)|^/artists', params => `/artists/${params.artist_id}`),

    authRoute: new Route('#(login|register)'),
    logoutRoute: new Route('/logout'),
}
