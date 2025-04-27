import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { TRACKS_STORAGE } from "utils/flux/storages";

import "./Track.scss";

function durationToString(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

abstract class TrackBase extends Component {
    state: {
        playing: 'play' | 'pause' | null,
        hover: boolean
    } = {
        playing: null,
        hover: false
    }

    componentDidMount(): void {
        TRACKS_STORAGE.subscribe(this.onAction)
        if (TRACKS_STORAGE.getPlaying() && TRACKS_STORAGE.getPlaying().id === this.props.track.id) {
            this.setState({
                playing: TRACKS_STORAGE.getPlayingState()
            });
        }
    }

    componentWillUnmount(): void {
        TRACKS_STORAGE.unSubscribe(this.onAction);
    }

    onAction = (action: any): void => {
        switch (true) {
            case action instanceof ACTIONS.TRACK_PLAY:
                this.setState({playing: this.props.track.id === action.payload.id ? 'play' : null});
                break;
            case action instanceof ACTIONS.TRACK_PAUSE:
                this.setState({playing: this.props.track.id === action.payload.id ? 'pause' : null});
                break;
            default:
                this.setState({playing: null});
        }
    }

    onPlay = (): void => {
        if (this.state.playing === 'play') {
            Dispatcher.dispatch(new ACTIONS.TRACK_PAUSE(this.props.track));
        } else {
            Dispatcher.dispatch(new ACTIONS.TRACK_PLAY(this.props.track));
        }
    }
}

export class TrackLine extends TrackBase {
    render() {
        const ind: number = this.props.ind;
        const track: AppTypes.Track = this.props.track;

        return [
            <div className={this.state.playing || this.state.hover ? "track-line active" : "track-line"}>
                <div className="track-line__info">
                    {ind !== undefined && <span className="track-line__info__index">{ind + 1}</span>}
                    <div className="track-line__info__img" onClick={this.onPlay} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
                        <img className="content" src={track.thumbnail_url} alt="error"/>
                        {
                            this.state.playing ? <img className="state" src={`/static/img/${this.state.playing}.svg`} />
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
                    <Link to={`/album/${track.album_id}`}>{track.album}</Link>
                </div>

                <div className="track-line__controls">
                    <div className="track-line__controls__duration-container">
                        <span className="track-line__controls__duration">{durationToString(track.duration)}</span>
                    </div>
                    <img src="/static/img/like-default.svg" alt="like"/>
                    <img src="/static/img/dots.svg" alt="more"/>
                </div>
            </div>
        ]
    }
}

export class TrackCard extends TrackBase {
    render() {
        const track: AppTypes.Track = this.props.track;
        return [
            <div className={this.state.playing || this.state.hover ? "track-card active" : "track-card"}>
                <div className="track-card__img" onClick={this.onPlay} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
                    <img className="content" src={track.thumbnail_url} alt="error"/>
                    {
                        this.state.playing ? <img className="state" src={`/static/img/${this.state.playing}.svg`} />
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