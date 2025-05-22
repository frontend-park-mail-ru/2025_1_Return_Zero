import { Component } from "libs/rzf/Component";

import { AlbumCard, AlbumLine } from "components/album/Album";
import { Special } from "components/special/Special";
import { Section } from "components/elements/Section";

import { USER_STORAGE } from "utils/flux/storages";
import { ACTIONS } from "utils/flux/actions";
import { API } from "utils/api";

import './pages.scss';

export class AlbumsPage extends Component {
    state = {
        albums: [] as AppTypes.Album[],
        favorites: [] as AppTypes.Album[],
    }

    componentDidMount() {
        USER_STORAGE.subscribe(this.onAction);
        this.fetchData();
    }

    componentWillUnmount(): void {
        USER_STORAGE.unsubscribe(this.onAction);
    }

    fetchData() {
        if (USER_STORAGE.getUser()) {
            API.getFavoriteAlbums('me').then(res => {
                this.setState({ favorites: res.body });
            }).catch(() => this.setState({ favorites: [] }))
        }
        API.getAlbums().then(res => {
            this.setState({ albums: res.body });
        }).catch(() => this.setState({ albums: [] }));
    }

    onAction = (action: any) => {
        switch (true) {
            case action instanceof ACTIONS.USER_LOGIN:
            case action instanceof ACTIONS.USER_CHANGE:
            case action instanceof ACTIONS.USER_LOGOUT:
                this.fetchData();
                break;
        }
    }

    render() {
        return [
            <div className="page">
                <Section title="Только для тебя" horizontal>
                    <Special />
                </Section>
                {!!this.state.favorites.length && <Section title="Любимые альбомы" horizontal>
                    {this.state.favorites.map((album, index) => (
                        <AlbumCard key={album.id} album={album}/>
                    ))}
                </Section>}
                <Section title="Рекомендации">
                    {this.state.albums.map((album, index) => (
                        <AlbumLine key={album.id} ind={index} album={album}/>
                    ))}
                </Section>
            </div>
        ]
    }
}
