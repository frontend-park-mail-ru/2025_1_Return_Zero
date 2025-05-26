import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";

import { TRACKS_STORAGE, USER_STORAGE, PLAYER_STORAGE } from "utils/flux/storages";
import { API } from "utils/api";

import { Like } from "../elements/Like";
import { ActionsTrack } from "../elements/Actions/ActionsTrack";

import "./Track.scss";  


function durationToString(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

import playerStorage from "utils/flux/PlayerStorage";
import Broadcast from "common/broadcast";

abstract class TrackBase extends Component {
    props: {
        track: AppTypes.Track,
        ind?: number,

        inPlaylist?: AppTypes.Playlist,
        removeFromPlaylist?: () => void,
        [key: string]: any
    }

    state: {
        playing: boolean | null,
        is_liked: boolean,
        hover: boolean,
        [key: string]: any
    } = {
        playing: null,
        is_liked: false,
        hover: false,
    }

    constructor(props: Record<string, any>) {
        super(props);

        this.state.is_liked = props.track.is_liked;
        Dispatcher.dispatch(new ACTIONS.TRACK_ADD(props.track));
        this.state.playing = this.checkPlaying();
    }

    checkPlaying() {
        if (!playerStorage.currentTrack) return null;

        if (playerStorage.currentTrack.id === this.props.track.id) {
            if (playerStorage.isPlaying) {
                return true;
            }
            return false;
        }
        return null;
    } 

    componentDidMount(): void {
        TRACKS_STORAGE.subscribe(this.onAction);
        PLAYER_STORAGE.subscribe(this.onPlayerAction);
    }

    componentWillUnmount(): void {
        TRACKS_STORAGE.unsubscribe(this.onAction);
        PLAYER_STORAGE.unsubscribe(this.onPlayerAction);
    }

    onAction = (action: any): void => {
        switch (true) {
            case action instanceof ACTIONS.TRACK_LIKE:
                this.props.track.id === action.payload.id && this.setState({is_liked: TRACKS_STORAGE.isLiked(this.props.track)});
                break;
            case action instanceof ACTIONS.TRACK_LIKE_STATE:
                this.props.track.id === action.payload.trackId && this.setState({is_liked: TRACKS_STORAGE.isLiked(this.props.track)});
                break;
        }
    }

    onPlayerAction = (action: any): void => {
        this.setState({playing: this.checkPlaying()});
    }

    onPlay = (): void => {
        if (this.checkPlaying() !== null) {
            Dispatcher.dispatch(new ACTIONS.AUDIO_TOGGLE_PLAY(null));
            return;
        }
        Dispatcher.dispatch(new ACTIONS.QUEUE_ADD_SECTION(this.props.track));
    }

    onLike = async () => {
        try {
            Dispatcher.dispatch(new ACTIONS.TRACK_LIKE(this.props.track));
        } catch (e) {
            console.error(e);
            return;
        }
    }
}

export class TrackLine extends TrackBase {
    render() {
        const ind: number = this.props.ind;
        const track: AppTypes.Track = this.props.track;

        return [
            <div className={this.state.playing !== null || this.state.hover ? "track-line active" : "track-line"}>
                <div className="track-line__info">
                    {ind !== undefined && <span className="track-line__info__index">{ind + 1}</span>}
                    <div className="track-line__info__img" onClick={this.onPlay} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
                        <img className="content" src={track.thumbnail_url} alt="error"/>
                        {
                            this.state.playing !== null ? <img className="state" src={`/static/img/${this.state.playing ? 'pause' : 'play'}.svg`} />
                            : this.state.hover && <img className="state" src="/static/img/play.svg" />
                        }
                    </div>
                    <div className="track-line__info__text">
                        <span className="track-line__info__text__title">{track.title}</span>
                        <div className="track-line__info__text__artists">
                            {track.artists.map((artist, index) => (
                                <span key={artist.id}>
                                    <Link to={artist.artist_page}>{artist.title}</Link>
                                    {index < track.artists.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="track-line__album">
                    <Link to={track.album_page}>{track.album}</Link>
                </div>

                <div className="track-line__controls">
                    <div className="track-line__controls__duration-container">
                        <span className="track-line__controls__duration">{durationToString(track.duration)}</span>
                    </div>
                    <Like active={this.state.is_liked} onClick={this.onLike}/>
                    <ActionsTrack track={track} playlist={this.props.inPlaylist} removeFromPlaylist={this.props.removeFromPlaylist} />
                </div>
            </div>
        ]
    }
}

export class TrackCard extends TrackBase {
    render() {
        const track: AppTypes.Track = this.props.track;
        return [
            <div className={this.state.playing !== null || this.state.hover ? "track-card active" : "track-card"}>
                <div className="track-card__img" onClick={this.onPlay} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
                    <img className="content" src={track.thumbnail_url} alt="error"/>
                    {
                        this.state.playing !== null ? <img className="state" src={`/static/img/${this.state.playing ? 'pause' : 'play'}.svg`} />
                        : this.state.hover && <img className="state" src="/static/img/play.svg" />
                    }
                </div>
                <div className="track-card__info">
                    <span className="track-card__info__title">{track.title}</span>
                    <span className="track-card__info__artists">
                        {track.artists.map((artist, index) => (
                            <span key={artist.id}>
                                <Link to={artist.artist_page}>{artist.title}</Link>
                                {index < track.artists.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </span>
                </div>
            </div>
        ]
    }
}

