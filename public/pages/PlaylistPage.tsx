import { Component } from "libs/rzf/Component";
import router, { Link } from "libs/rzf/Router";

import { Section } from "components/elements/Section";
import { Button, ButtonDanger } from "components/elements/Button";
import { DialogConfirm } from "components/elements/Dialog";
import { Like } from "components/elements/Like";
import { ActionsPlaylist } from "components/elements/Actions/ActionsPlaylist";

import { TrackLine } from "components/track/Track";
import { PlaylistEdit } from "components/forms/PlaylistEdit";
import { Preloader } from "components/preloader/Preloader";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { USER_STORAGE } from "utils/flux/storages";
import { API } from "utils/api";

import { one_alive_async } from "utils/funcs";
import Broadcast from "common/broadcast";

import './pages.scss';

export class PlaylistPage extends Component {
    playlist_id: number;
    state = {
        playlist: null as AppTypes.Playlist | null,
        playlist_loading: true,
        tracks: [] as AppTypes.Track[],
        tracks_loading: true,

        is_liked: false,
        editing: false,
        confirm_delete: false,
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
        this.setState({ playlist_loading: true, tracks_loading: true});
        API.getPlaylist(this.playlist_id)
            .then(playlist => this.setState({playlist: playlist.body, is_liked: playlist.body.is_liked}))
            .catch(e => this.setState({ playlist: null }))
            .finally(() => this.setState({ playlist_loading: false }));
        API.getPlaylistTracks(this.playlist_id)
            .then(tracks => this.setState({tracks: tracks.body}))
            .catch(e => this.setState({tracks: []}))
            .finally(() => this.setState({ tracks_loading: false }));
    }

    onSave = (playlist: AppTypes.Playlist) => { this.setState({editing: false, playlist: playlist}); }

    onDelete = () => {
        API.deletePlaylist(this.state.playlist.id)
            .then(() => { 
                Dispatcher.dispatch(new ACTIONS.DELETE_PLAYLIST(this.state.playlist)); router.replace('/', {}); 
                Broadcast.send('deletePlaylist', this.state.playlist);
            })
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
        
        if (this.state.playlist_loading) {
            return [
                <div className="page page--404 page__empty">
                    <Preloader />
                </div>
            ]
        }
        if (!this.state.playlist) {
            return [
                <div className="page page--404 page__empty">
                    <img src="/static/img/icon-tracks.svg" alt="" />
                    <h1>Плейлист не найден</h1>
                </div>
            ]
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
                            {(!USER_STORAGE.getUser() || USER_STORAGE.getUser().username !== playlist.username) && <Like active={this.state.is_liked} onClick={this.onLike} />}
                            <ActionsPlaylist playlist={playlist} />
                        </div>
                    </div>
                </div>
                <Section title="Треки в плейлисте" is_loading={this.state.tracks_loading}>
                    {this.state.tracks.map((track, index) => 
                        <TrackLine key={track.id} ind={index} track={track} inPlaylist={playlist} removeFromPlaylist={
                            () => this.setState({ tracks: this.state.tracks.filter(t => t.id !== track.id)})}
                        />
                    )}
                </Section>
                <div className="page__buttons">
                    {USER_STORAGE.getUser() && USER_STORAGE.getUser().username === playlist.username && <Button className="page--playlist__edit" onClick={() => this.setState({ editing: true })}>Изменить плейлист</Button>}
                    {USER_STORAGE.getUser() && USER_STORAGE.getUser().username === playlist.username && <ButtonDanger className="page--playlist__delete" onClick={() => this.setState({ confirm_delete: true })}>Удалить плейлист</ButtonDanger>}
                </div>
                {this.state.editing && <PlaylistEdit playlist={playlist} onClose={() => this.setState({editing: false})} onSave={this.onSave}/>}
                {this.state.confirm_delete && <DialogConfirm onClose={() => this.setState({confirm_delete: false})} onConfirm={this.onDelete} message="Вы уверены что хотите удалить плейлист?" />}
            </div>
        ]
    }
}