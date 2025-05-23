import { Component } from "libs/rzf/Component";

import { Section } from "components/elements/Section";
import { ArtistCard } from "components/artist/Artist";
import { AlbumCard } from "components/album/Album";

import './pages.scss'
import { Button } from "components/elements/Button";
import { ArtistCreate } from "components/forms/ArtistCreate";

export class LabelPage extends Component {
    state: {
        artists: AppTypes.Artist[],
        albums: AppTypes.Album[],
        artistCreate: boolean,
    }

    componentDidMount(): void {
        
    }

    render() {
        return [
            <div className="page page--label">
                <Section title="Мои артисты" horizontal wrap>
                    <Button onClick={() => {}}><img src="/static/img/plus.svg" alt="error"/></Button>
                    {this.state.artists.map(artist => <ArtistCard artist={artist} />)}
                </Section>
                <Section title="Мои альбомы" horizontal wrap>
                    {this.state.albums.map(album => <AlbumCard album={album} />)}
                </Section>

                {this.state.artistCreate && <ArtistCreate 
                    onClose={() => this.setState({ artistCreate: false })}
                    onCreate={() => {}}
                />}
            </div>
        ];
    }
}
