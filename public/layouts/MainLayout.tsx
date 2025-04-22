import h from "libs/rzf/jsx";
import { Component } from "libs/rzf/Component";
import { Route } from "libs/rzf/Router";

import { Header } from "components/Header";
import { PlaylistsPanel } from "components/PlaylistsPanel";

import { MainPage, TracksPage, AlbumsPage, ArtistsPage } from "pages/MainPages";
import { ArtistPage } from "pages/ArtistPage";

import "./layout.scss";

export default class MainLayout extends Component {
    render() {
        return (
            <div classes={["layout", "layout--main"]}>
                <Header />
                <PlaylistsPanel />
                <Route path="/"><MainPage /></Route>
                <Route path="/tracks"><TracksPage /></Route>
                <Route path="/albums"><AlbumsPage /></Route>
                <Route path="/artists"><ArtistsPage /></Route>
                <Route path="/artists/1"><ArtistPage artist_id="1" /></Route>
            </div>
        )
    }
}