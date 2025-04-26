import { Component } from "libs/rzf/Component";

import { TrackCard, TrackLine } from "components/Track";
import { AlbumCard, AlbumLine } from "components/Album";
import { ArtistCard } from "components/Artist";
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
        this.getTracks().then(tracks => this.setState({ tracks }));
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
        this.getTracks().then(tracks => this.setState({ tracks }));
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
        this.getAlbums().then(albums => this.setState({ albums }));
    }

    private async getAlbums() {
        try {
            return (await API.getAlbums()).body;
        } catch (e) {
            console.error(e.message);
            return [];
        }
    }

    render() {
        return [
            <div className="page">
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
        this.getArtists().then(artists => this.setState({ artists }));
    }

    private async getArtists() {
        try {
            return (await API.getArtists()).body;
        } catch (e) {
            console.error(e.message);
            return [];
        }
    }

    render() {
        return [
            <div className="page">
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
