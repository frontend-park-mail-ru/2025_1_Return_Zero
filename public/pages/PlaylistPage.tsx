import { Component } from "libs/rzf/Component";
import router, { Link } from "libs/rzf/Router";

import { TrackLine } from "components/track/Track";
import { Section } from "components/elements/Section";
import { PlaylistEdit } from "components/forms/PlaylistEdit";

import { Button, ButtonDanger } from "components/elements/Button";
import { Like } from "components/elements/Like";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { USER_STORAGE } from "utils/flux/storages";
import { API } from "utils/api";

import { one_alive_async } from "utils/funcs";

import './pages.scss';

export class PlaylistPage extends Component {
    playlist_id: number;
    state = {
        playlist: null as AppTypes.Playlist | null,
        tracks: [] as AppTypes.Track[],
        is_liked: false,
        editing: false,
    }

    props: {
        playlist_id: number
    }

    onAction(action: any) {
        switch (true) {
            case action instanceof ACTIONS.USER_LOGIN:
            case action instanceof ACTIONS.USER_LOGOUT:
            case action instanceof ACTIONS.USER_CHANGE:
                this.fetchData();
                break;
        }
    }

    async fetchData() {
        this.playlist_id = this.props.playlist_id;
        API.getPlaylist(this.playlist_id)
            .then(playlist => {
                this.setState({playlist: playlist.body, is_liked: playlist.body.is_liked})
                API.getPlaylistTracks(this.playlist_id)
                    .then(tracks => {this.setState({tracks: tracks.body})})
                    .catch(e => console.error(e.message));
            })
            .catch(e => this.setState({ playlist: null }));
    }

    onSave = (playlist: AppTypes.Playlist) => { this.setState({editing: false, playlist: playlist}); }

    onDelete = () => {
        API.deletePlaylist(this.state.playlist.id)
            .then(() => { Dispatcher.dispatch(new ACTIONS.DELETE_PLAYLIST(this.state.playlist)); router.replace('/', {}) })
            .catch(e => console.error(e.message));
    }

    onLike = one_alive_async(async () => {
        try {
            const resp = await API.postPlaylistLike(this.props.playlist_id, !this.state.is_liked)
            this.setState({is_liked: !this.state.is_liked})
        } catch (err) {
            console.error(err.message);
        }
    })

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
                            {(!USER_STORAGE.getUser() || USER_STORAGE.getUser().username !== playlist.username) && <Like active={this.state.is_liked} onClick={this.onLike} />}
                        </div>
                    </div>
                </div>
                <Section title="Треки в плейлисте">
                    {this.state.tracks.length ? 
                        this.state.tracks.map((track, index) => (
                            <TrackLine key={track.id} ind={index} track={track} inPlaylist={playlist} removeFromPlaylist={
                                () => this.setState({ tracks: this.state.tracks.filter(t => t.id !== track.id)})}
                            />
                        )) :
                        <span>В этом плейлисте пока-что пусто{'('}</span>
                    }
                </Section>
                {this.state.editing && <PlaylistEdit playlist={playlist} onClose={() => this.setState({editing: false})} onSave={this.onSave}/>}
                <div className="page__buttons">
                    {USER_STORAGE.getUser() && USER_STORAGE.getUser().username === playlist.username && <Button className="page--playlist__delete" onClick={() => this.setState({ editing: true })}>Изменить плейлист</Button>}
                    {USER_STORAGE.getUser() && USER_STORAGE.getUser().username === playlist.username && <ButtonDanger className="page--playlist__delete" onClick={this.onDelete}>Удалить плейлист</ButtonDanger>}
                </div>
            </div>
        ]
    }
}