import { Component } from "libs/rzf/Component";

import { TrackLine } from "components/track/Track";
import { AlbumCard } from "components/album/Album";
import { Section } from "components/elements/Section";
import { Button, ButtonDanger } from "components/elements/Button";
import { ActionsArtist } from "components/elements/Actions/ActionsArtist";
import { Preloader } from "components/preloader/Preloader";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";

import { API } from "utils/api";
import { one_alive_async } from "utils/funcs";

import './pages.scss';

export class ArtistPage extends Component {
    artist_id: number
    state = {
        artist: null as AppTypes.Artist | null,
        artist_loading: true,
        tracks: [] as AppTypes.Track[],
        tracks_loading: true,
        albums: [] as AppTypes.Album[],
        albums_loading: true,
        is_liked: false,
    }

    props: {
        artist_id: number
    }

    fetchData() {
        this.artist_id = this.props.artist_id;
        this.setState({artist_loading: true, tracks_loading: true, albums_loading: true});
        API.getArtist(this.props.artist_id)
            .then(artist => {this.setState({artist: artist.body, is_liked: artist.body.is_liked})})
            .catch(e => console.error(e.message))
            .finally(() => this.setState({artist_loading: false}));
        API.getArtistAlbums(this.props.artist_id)
            .then(albums => {this.setState({albums: albums.body})})
            .catch(e => console.error(e.message))
            .finally(() => this.setState({albums_loading: false}));
        API.getArtistTracks(this.props.artist_id)
            .then(tracks => {this.setState({tracks: tracks.body})})
            .catch(e => console.error(e.message))
            .finally(() => this.setState({tracks_loading: false}));
    }

    onLike = one_alive_async(async () => {
        try {
            const resp = await API.postArtistLike(this.props.artist_id, !this.state.is_liked);
            Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
                type: "success",
                message: !this.state.is_liked ? `Вы подписались на ${this.state.artist.title}` : `Вы отписались от ${this.state.artist.title}`,
            }))
            this.setState({is_liked: !this.state.is_liked});
        } catch (e) {
        }
    });

    render() {
        if (this.artist_id !== this.props.artist_id) this.fetchData();

        if (this.state.artist_loading) {
            return [
                <div className="page page--404 page__empty">
                    <Preloader />
                </div>
            ]
        }
        if (!this.state.artist) {
            return [
                <div className="page page--404 page__empty">
                    <img src="/static/img/icon-artists.svg" alt="" />
                    <h1>Артист не найден</h1>
                </div>
            ]
        }

        return [
            <div className="page page--artist">
                <div className="page__info">
                    <img className="page__info__img" src={ this.state.artist.thumbnail_url } alt="error" />
                    <div>
                        <span className="page__info__type">Исполнитель</span>
                        <h2 className="page__info__title">{this.state.artist.title}</h2>
                        <span className="page__info__stats">{this.state.artist.listeners_count} слушателей за месяц</span>
                        <div className="page__info__actions">
                            {!this.state.is_liked ? 
                                <Button onClick={this.onLike}>Подписаться</Button> :
                                <ButtonDanger onClick={this.onLike}>Отписаться</ButtonDanger>}
                            <ActionsArtist artist={this.state.artist} />
                        </div>
                    </div>
                </div>
                <Section title="Популярные альбомы" horizontal all_link={`/all/artists/${this.artist_id}/albums`} is_loadin={this.state.albums_loading}>
                    {this.state.albums.map((album, index) => (
                        <AlbumCard key={album.id} album={album}/>
                    ))}
                </Section>
                <Section title="Популярные треки" all_link={`/all/artists/${this.artist_id}/tracks`} is_loading={this.state.tracks_loading}>
                    {this.state.tracks.map((track, index) => (
                        <TrackLine key={track.id} ind={index} track={track}/>
                    ))}
                </Section>
            </div>
        ]
    }
}