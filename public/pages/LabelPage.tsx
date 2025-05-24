import { Component } from "libs/rzf/Component";

import { Section } from "components/elements/Section";
import { ArtistCard } from "components/artist/Artist";
import { AlbumCard } from "components/album/Album";

import './pages.scss'
import { Button } from "components/elements/Button";
import { ArtistCreate } from "components/forms/ArtistCreate";
import { API } from "utils/api";
import { ArtistEdit } from "components/forms/ArtistEdit";

export class LabelPage extends Component {
    state: {
        artists: AppTypes.Artist[],
        albums: AppTypes.Album[],
        artistCreateOpen: boolean,
    } = {
        artists: [],
        albums: [],
        artistCreateOpen: false,
    }

    componentDidMount(): void {
        this.loadData();
    }

    loadData() {
        API.getLabelArtists().then(artists => this.setState({artists: artists.body})).catch(err => console.log(err));
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
        const { artists } = this.state;
        return [
            <div className="page page--label">
                <Section title="Мои артисты" horizontal wrap>
                    <Button className="page--label__artist-create-btn" onClick={() => this.setState({artistCreateOpen: true})}><img src="/static/img/plus.svg" alt="error"/></Button>
                    {artists.map(artist => 
                        <ArtistCard artist={artist} onEdit={this.artistEdited} />
                    )}
                </Section>

                {this.state.artistCreateOpen && <ArtistCreate 
                    onClose={() => this.setState({ artistCreateOpen: false })}
                    onCreate={this.artistCreated}
                />}
            </div>
        ];
    }
}
