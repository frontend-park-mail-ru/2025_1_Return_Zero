import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { TRACKS_STORAGE } from "utils/flux/storages";
import { API } from "utils/api";

import { Like } from "./elements/Like";
import { Actions } from "./elements/Actions";

import "./Track.scss";

function durationToString(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

abstract class TrackBase extends Component {
    state: {
        playing: boolean | null,
        liked: boolean,
        hover: boolean,
    } = {
        playing: null,
        liked: false,
        hover: false,
    }

    constructor(props: Record<string, any>) {
        super(props);

        this.state.liked = props.track.liked;
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
                this.setState({playing: this.props.track.id === action.payload.id ? true : null});
                break;
            case action instanceof ACTIONS.TRACK_STATE_CHANGE:
                this.setState({playing: this.props.track.id === TRACKS_STORAGE.getPlaying().id ? TRACKS_STORAGE.getPlayingState() : null});
                break;
        }
    }

    onPlay = (): void => {
        if (typeof this.state.playing === 'boolean') {
            Dispatcher.dispatch(new ACTIONS.TRACK_STATE_CHANGE({playing: !this.state.playing}));
            return;
        } 
        Dispatcher.dispatch(new ACTIONS.TRACK_PLAY(this.props.track));
    }

    onLike = async () => {
        try {
            const res = (await API.postTrackLike(this.props.track.id, !this.state.liked)).body;
            console.log(res)
            this.setState({liked: res.value});
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
                    <Like active={this.state.liked} onClick={this.onLike}/>
                    <Actions>
                        <span onClick={() => console.log("click add to playlist")}>Добавить в плейлист</span>
                        <span>Добавить в очередь</span>
                        <span>Перейти к исполнителю</span>
                        <span>Перейти к альбому</span>
                    </Actions>
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