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
        albums_loading: true,
        favorites: [] as AppTypes.Album[],
        favorites_loading: true
    }

    componentDidMount() {
        USER_STORAGE.subscribe(this.onAction);
        this.fetchData();
    }

    componentWillUnmount(): void {
        USER_STORAGE.unsubscribe(this.onAction);
    }

    fetchData() {
        this.setState({ favorites_loading: true, albums_loading: true });
        if (USER_STORAGE.getUser()) {
            API.getFavoriteAlbums('me').then(res => this.setState({ favorites: res.body }))
                .catch(() => this.setState({ favorites: [] }))
                .finally(() => this.setState({ favorites_loading: false }));
        } else { 
            this.setState({
                favorites: [],
                favorites_loading: false 
            })
        }
        API.getAlbums().then(res => this.setState({ albums: res.body }))
            .catch(() => this.setState({ albums: [] }))
            .finally(() => this.setState({ albums_loading: false}));
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
                {USER_STORAGE.getUser() && 
                    <Section title="Любимые альбомы" horizontal all_link="/all/albums/favorite" is_loading={this.state.favorites_loading}>
                        {this.state.favorites.map((album, index) => (
                            <AlbumCard key={album.id} album={album}/>
                        ))}
                    </Section>
                }
                <Section title="Рекомендации" all_link="/all/albums/top" is_loading={this.state.albums_loading}>
                    {this.state.albums.map((album, index) => (
                        <AlbumLine key={album.id} ind={index} album={album} />
                    ))}
                </Section>
            </div>
        ]
    }
}
