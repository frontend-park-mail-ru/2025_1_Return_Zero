import { Component } from "libs/rzf/Component";
import { Route } from "libs/rzf/Router";

import { Header } from "components/Header";
import { PlaylistsPanel } from "components/PlaylistsPanel";
import { Player } from "components/player/Player";
import { Logo } from "components/logo/Logo";

import { LoginForm, LogoutForm, SignupForm } from "components/forms/AuthForms";

import { MainPage, TracksPage, AlbumsPage, ArtistsPage } from "pages/MainPages";
import { AlbumPage } from "pages/AlbumPage";
import { ArtistPage } from "pages/ArtistPage";
import { PlaylistPage } from "pages/PlaylistPage";
import { ProfilePage } from "pages/ProfilePage";
import { SettingsPage } from "pages/SettingsPage";

import "./layout.scss";

export default class MainLayout extends Component {
    render() {
        return [
            <div className="layout layout--main">
                <Logo />
                <Header />
                <PlaylistsPanel />

                <Route path="^/" exact component={MainPage}></Route>
                <Route path="^/tracks/" exact component={TracksPage} />

                <Route path="^/albums/" exact component={AlbumsPage} />
                <Route path="^/albums/:album_id<int>/" exact component={AlbumPage} />

                <Route path="^/artists/" exact component={ArtistsPage} />
                <Route path="^/artists/:artist_id<int>/" exact component={ArtistPage} />

                <Route path="^/playlists/:playlist_id<int>/" exact component={PlaylistPage} />

                <Route path="^/profile/:username/" exact component={ProfilePage} />
                <Route path="^/settings/" exact component={SettingsPage} />

                <Route path="#login$" component={LoginForm} />
                <Route path="#register$" component={SignupForm} />
                <Route path="#logout$" component={LogoutForm} />

                <Player />
            </div>
        ]
    }
}