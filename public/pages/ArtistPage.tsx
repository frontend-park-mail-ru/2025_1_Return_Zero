import { Component } from "libs/rzf/Component";

import { TrackLine } from "components/Track";
import { AlbumCard } from "components/Album";
import { Section } from "components/Section";
import { Button } from "components/elements/Button";

import { API } from "utils/api";

import './pages.scss';

export class ArtistPage extends Component {
    artist_id: number
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

    fetchData() {
        this.artist_id = this.props.artist_id;
        API.getArtist(this.props.artist_id)
            .then(artist => {this.setState({artist: artist.body})})
            .catch(e => console.error(e.message));
        API.getArtistAlbums(this.props.artist_id)
            .then(albums => {this.setState({albums: albums.body})})
            .catch(e => console.error(e.message));
        API.getArtistTracks(this.props.artist_id)
            .then(tracks => {this.setState({tracks: tracks.body})})
            .catch(e => console.error(e.message));
    }

    render() {
        if (this.artist_id !== this.props.artist_id) this.fetchData();

        if (!this.state.artist) {
            return [<div className="page page--404">Артист не найден{'('}</div>]
        }

        return [
            <div className="page page--artist">
                <div className="page__info">
                    <img className="page__info__img" src={this.state.artist.thumbnail_url} alt="error" />
                    <div>
                        <span className="page__info__type">Исполнитель</span>
                        <h2 className="page__info__title">{this.state.artist.title}</h2>
                        <span className="page__info__stats">{this.state.artist.listeners_count} слушателей за месяц</span>
                        <div className="page__info__actions">
                            <img src="/static/img/play.svg" alt="play"/>
                            <Button>Подписаться</Button>
                        </div>
                    </div>
                </div>
                <Section title="Популярные альбомы" horizontal>
                    {this.state.albums.map((album, index) => (
                        <AlbumCard key={album.id} album={album}/>
                    ))}
                </Section>
                <Section title="Популярные треки">
                    {this.state.tracks.map((track, index) => (
                        <TrackLine key={track.id} ind={index} track={track}/>
                    ))}
                </Section>
            </div>
        ]
    }
}