import { Component } from "libs/rzf/Component";
import { Route } from "libs/rzf/Router";

import { Header } from "components/Header";
import { PlaylistsPanel } from "components/PlaylistsPanel";

import { LoginForm, LogoutForm, SignupForm } from "components/forms/AuthForms";

import { MainPage, TracksPage, AlbumsPage, ArtistsPage } from "pages/MainPages";
import { ArtistPage } from "pages/ArtistPage";

import "./layout.scss";

export default class MainLayout extends Component {
    render() {
        return [
            <div className="layout layout--main">
                <Header />
                <PlaylistsPanel />

                <Route path="^/" exact component={MainPage}></Route>
                <Route path="^/tracks/" exact component={TracksPage} />
                <Route path="^/albums/" exact component={AlbumsPage} />
                <Route path="^/artists/" exact component={ArtistsPage} />
                <Route path="^/artists/:artist_id<int>/" exact component={ArtistPage} />

                <Route path="#login$" component={LoginForm} />
                <Route path="#register$" component={SignupForm} />
                <Route path="#logout$" component={LogoutForm} />
            </div>
        ]
    }
}