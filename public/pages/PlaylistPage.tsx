import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import { TrackLine } from "components/Track";
import { Section } from "components/Section";

import { Like } from "components/elements/Like";

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

    componentDidMount() { this.fetchData() };

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
                        <span className="page__info__type" style={{textTransform: 'capitalize'}}>Плейлист {playlist.created_at.getFullYear()}</span> {/* добавить кол-во треков */}
                        <h2 className="page__info__title">{playlist.title}</h2>
                        <div className="page__info__user">
                            <Link key={playlist.user.id} to={playlist.user.user_page}>{playlist.user.username}</Link>
                        </div>
                        <div className="page__info__actions">
                            <img src="/static/img/play.svg" alt="play"/>
                            <Like active={playlist.liked} />
                        </div>
                    </div>
                </div>
                <Section title="Треки в плейлисте">
                    {this.state.tracks.map((track, index) => (
                        <TrackLine key={track.id} ind={index} track={track}/>
                    ))}
                </Section>
            </div>
        ]
    }
}