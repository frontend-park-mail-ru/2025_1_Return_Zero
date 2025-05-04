import { Component } from "libs/rzf/Component";
import router, { Link } from "libs/rzf/Router";

import { TrackLine } from "components/Track";
import { Section } from "components/Section";

import { ButtonDanger } from "components/elements/Button";
import { Like } from "components/elements/Like";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { API } from "utils/api";

import './pages.scss';

export class PlaylistPage extends Component {
    playlist_id: number;
    state: {
        playlist: AppTypes.Playlist,
        tracks: AppTypes.Track[],
    } = {
        playlist: null,
        tracks: [],
    }

    props: {
        playlist_id: number
    }

    async fetchData() {
        this.playlist_id = this.props.playlist_id;
        API.getPlaylist(this.playlist_id)
            .then(playlist => {
                this.setState({playlist: playlist.body})
                API.getPlaylistTracks(this.playlist_id)
                    .then(tracks => {this.setState({tracks: tracks.body})})
                    .catch(e => console.error(e.message));
            })
            .catch(e => this.setState({ playlist: null }));
    }

    onDelete = () => {
        API.deletePlaylist(this.state.playlist.id)
            .then(() => { Dispatcher.dispatch(new ACTIONS.DELETE_PLAYLIST(this.state.playlist)); router.replace('/', {}) })
            .catch(e => console.error(e.message));
    }

    onLike = () => {

    }

    render() {
        if (this.props.playlist_id !== this.playlist_id) this.fetchData();
        
        if (!this.state.playlist) {
            return [<div className="page page--404">Плейлист не найден{'('}</div>]
        }
        const playlist = this.state.playlist;
        return [
            <div className="page page--playlist">
                <div className="page__info">
                    <img className="page__info__img" src={playlist.thumbnail_url} alt="error" />
                    <div>
                        <span className="page__info__type" style={{textTransform: 'capitalize'}}>Плейлист</span> {/* добавить кол-во треков */}
                        <h2 className="page__info__title">{playlist.title}</h2>
                        <div className="page__info__user">
                            <Link key={playlist.username} to={playlist.user_page}>{playlist.username}</Link>
                        </div>
                        <div className="page__info__actions">
                            <img src="/static/img/play.svg" alt="play"/>
                            <Like active={playlist.is_liked} onClick={this.onLike} />
                        </div>
                    </div>
                </div>
                <Section title="Треки в плейлисте">
                    {this.state.tracks.length ? 
                        this.state.tracks.map((track, index) => (
                            <TrackLine key={track.id} ind={index} track={track}/>
                        )) :
                        <span>В этом плейлисте пока-что пусто{'('}</span>
                    }
                </Section>
                <ButtonDanger className="page--playlist__delete" onClick={this.onDelete}>Удалить плейлист</ButtonDanger>
            </div>
        ]
    }
}