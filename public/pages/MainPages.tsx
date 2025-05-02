import { Component } from "libs/rzf/Component";

import { TrackCard, TrackLine } from "components/Track";
import { AlbumCard, AlbumLine } from "components/Album";
import { ArtistCard } from "components/Artist";
import { Special } from "components/special/Special";
import { Section } from "components/Section";

import { API } from "utils/api";

import './pages.scss';

export class MainPage extends Component {
    state: {
        tracks: AppTypes.Track[],
        history: AppTypes.Track[],
    } = {
        tracks: [],
        history: [],
    }

    componentDidMount() {
        API.getTracks()
            .then(tracks => this.setState({ tracks: tracks.body, history: tracks.body }))
            .catch(e => console.error(e.message));
    }

    render() {
        return [
            <div className="page">
                <Section title="Только для тебя" horizontal>
                    <Special />
                </Section>
                <Section title="История прослушиваний" horizontal>
                    {this.state.tracks.map((track, index) => (
                        <TrackCard key={track.id} ind={index} track={track}/>
                    ))}
                </Section>
                <Section title="Рекомендации">
                    {this.state.tracks.map((track, index) => (
                        <TrackLine key={track.id} ind={index} track={track}/>
                    ))}
                </Section>
            </div>
        ]
    }
}

export class TracksPage extends Component {
    state: {
        tracks: AppTypes.Track[],
        history: AppTypes.Track[],
    } = {
        tracks: [],
        history: [],
    }

    componentDidMount() {
        API.getTracks()
            .then(tracks => this.setState({ tracks: tracks.body, history: tracks.body }))
            .catch(e => console.error(e.message));
    }

    private async getTracks() {
        try {
            return (await API.getTracks(20)).body;
        } catch (e) {
            console.error(e.message);
            return [];
        }
    }

    render() {
        return [
            <div className="page">
                <Section title="Только для тебя" horizontal>
                    <Special />
                </Section>
                <Section title="История прослушиваний" horizontal>
                    {this.state.tracks.map((track, index) => (
                        <TrackCard key={track.id} track={track}/>
                    ))}
                </Section>
                <Section title="Рекомендации">
                    {this.state.tracks.map((track, index) => (
                        <TrackLine key={track.id} ind={index} track={track}/>
                    ))}
                </Section>
            </div>
        ]
    }
}

export class AlbumsPage extends Component {
    state: {
        albums: AppTypes.Album[],
    } = {
        albums: [],
    }

    componentDidMount() {
        API.getAlbums()
            .then(albums => this.setState({ albums: albums.body }))
            .catch(e => console.error(e.message));
    }

    render() {
        return [
            <div className="page">
                <Section title="Только для тебя" horizontal>
                    <Special />
                </Section>
                <Section title="Любимые альбомы" horizontal>
                    {this.state.albums.map((album, index) => (
                        <AlbumCard key={album.id} album={album}/>
                    ))}
                </Section>
                <Section title="Рекомендации">
                    {this.state.albums.map((album, index) => (
                        <AlbumLine key={album.id} ind={index} album={album}/>
                    ))}
                </Section>
            </div>
        ]
    }
}

export class ArtistsPage extends Component {
    state: {
        artists: AppTypes.Artist[],
    } = {
        artists: [],
    }

    componentDidMount() {
        API.getArtists()
            .then(artists => this.setState({ artists: artists.body }))
            .catch(e => console.error(e.message));
    }

    render() {
        return [
            <div className="page">
                <Section title="Только для тебя" horizontal>
                    <Special />
                </Section>
                <Section title="Любимые исполнители" horizontal>
                    {this.state.artists.map((artist, index) => (
                        <ArtistCard key={artist.id} artist={artist}/>
                    ))}
                </Section>
                <Section title="История прослушиваний" horizontal>
                    {this.state.artists.map((artist, index) => (
                        <ArtistCard key={artist.id} artist={artist}/>
                    ))}
                </Section>
            </div>
        ]
    }
}
