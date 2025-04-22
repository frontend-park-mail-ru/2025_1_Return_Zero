import h from "libs/rzf/jsx";
import { Component } from "libs/rzf/Component";

import { TrackLine } from "components/Track";
import { AlbumCard } from "components/Album";
import { Section, SectionHorizontal } from "components/Section";
import { Button } from "components/elements/Button";

import { API } from "utils/api";

import './pages.scss';

export class ArtistPage extends Component {
    state: {
        tracks: AppTypes.Track[],
        albums: AppTypes.Album[],
        artist: AppTypes.Artist
    } = {
        tracks: [],
        albums: [],
        artist: null
    }

    props: {
        artist_id: number
    }

    componentDidMount() {
        this.getArtist().then(artist => this.setState({ artist }));
        this.getArtistTracks().then(tracks => this.setState({ tracks }));
        this.getArtistAlbums().then(albums => this.setState({ albums }));
    }

    private async getArtist() {
        try {
            return (await API.getArtist(this.props.artist_id)).body;
        } catch (e) {
            console.error(e.message);
            return null;
        }
    }

    private async getArtistTracks() {
        try {
            return (await API.getArtistTracks(this.props.artist_id)).body;
        } catch (e) {
            console.error(e.message);
            return [];
        }
    }

    private async getArtistAlbums() {
        try {
            return (await API.getArtistAlbums(this.props.artist_id)).body;
        } catch (e) {
            console.error(e.message);
            return [];
        }
    }

    render() {
        if (!this.state.artist) {
            return <div classes={["page", "page--404"]}>Артист не найден{'('}</div>
        }
        return (
            <div classes={["page", "page--artist"]}>
                <div classes={["page--artist__info"]}>
                    <img classes={["page--artist__info__img"]} src={this.state.artist.thumbnail_url} alt="error" />
                    <div>
                        <span classes={["page--artist__info__type"]}>Исполнитель</span>
                        <h2 classes={["page--artist__info__title"]}>{this.state.artist.title}</h2>
                        <span classes={["page--artist__info__stats"]}>{this.state.artist.listeners_count} слушателей за месяц</span>
                        <div classes={["page--artist__info__actions"]}>
                            <img src="/static/img/play.svg" alt="play"/>
                            <Button>Подписаться</Button>
                        </div>
                    </div>
                </div>
                <SectionHorizontal title="Популярные альбомы">
                    {...this.state.albums.map((album, index) => (
                        <AlbumCard key={album.id} album={album}/>
                    ))}
                </SectionHorizontal>
                <Section title="Популярные треки">
                    {...this.state.tracks.map((track, index) => (
                        <TrackLine key={track.id} ind={index} track={track}/>
                    ))}
                </Section>
            </div>
        )
    }
}