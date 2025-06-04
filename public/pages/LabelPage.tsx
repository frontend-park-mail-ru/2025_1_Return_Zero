import { Component } from "libs/rzf/Component";

import { Button } from "components/elements/Button";
import { Section } from "components/elements/Section";
import { ArtistCard } from "components/artist/Artist";
import { AlbumCard } from "components/album/Album";
import { ArtistCreate } from "components/forms/ArtistCreate";
import { AlbumCreate } from "components/forms/AlbumCreate";

import { API } from "utils/api";
import { USER_STORAGE } from "utils/flux/storages";

import './pages.scss'

export class LabelPage extends Component {
    state = {
        artists: [] as AppTypes.Artist[],
        artists_loading: true,
        albums: [] as AppTypes.Album[],
        albums_loading: true,
        artistCreateOpen: false,
    }

    componentDidMount(): void {
        this.loadData();
        USER_STORAGE.subscribe(this.onAction)
    }

    componentWillUnmount(): void {
        USER_STORAGE.unsubscribe(this.onAction)
    }

    onAction = (action: any) => this.loadData();


    loadData() {
        if (USER_STORAGE.getUser()?.is_label) {
            this.setState({artists_loading: true, albums_loading: true})
            API.getLabelArtists().then(artists => this.setState({artists: artists.body}))
                .catch(err => console.log(err)).finally(() => this.setState({artists_loading: false}));
            API.getLabelAlbums().then(albums => this.setState({albums: albums.body}))
                .catch(err => console.log(err)).finally(() => this.setState({albums_loading: false}));
            return;
        }
        this.setState({artists: [], albums: [], artists_loading: false, albums_loading: false})
    }

    artistCreated = (artist: AppTypes.Artist) => {
        this.setState({artistCreateOpen: false})
        this.setState({artists: [artist, ...this.state.artists]})
    }

    artistEdited = (artist: AppTypes.Artist) => {
        this.setState({artistEditOpen: false})
        this.setState({artists: this.state.artists.map((a) => {
            if (a.id === artist.id) return artist;
            return a;
        })})
    }

    render() {
        if (!USER_STORAGE.getUser()?.is_label) {
            return [
                <div className="page page--404 page__empty">
                    <h1>У вас нет доступа</h1>
                </div>
            ];
        }
        const { artists } = this.state;
        return [
            <div className="page page--label">
                <Section title="Мои артисты" horizontal wrap is_loading={this.state.artists_loading}>
                    <Button className="page--label__artist-create-btn" onClick={() => this.setState({artistCreateOpen: true})}>
                        <img src="/static/img/plus.svg" alt="error"/>
                    </Button>
                    {artists.map(artist => <ArtistCard artist={artist} onEdit={this.artistEdited} />)}
                </Section>
                <Section title="Мои альбомы" horizontal wrap is_loading={this.state.albums_loading}>
                    { this.state.albums.map(album => <AlbumCard album={album} />) }
                </Section>
                <Section title="Выложить альбом" horizontal wrap>
                    <AlbumCreate onCreate={(album: AppTypes.Album) => this.setState({albums: [album, ...this.state.albums]})} />
                </Section>

                {this.state.artistCreateOpen && <ArtistCreate 
                    onClose={() => this.setState({ artistCreateOpen: false })}
                    onCreate={this.artistCreated}
                />}
            </div>
        ];
    }
}
