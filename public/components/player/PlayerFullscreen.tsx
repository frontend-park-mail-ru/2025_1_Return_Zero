import { Component } from "libs/rzf/Component";
import player from 'common/player';
import { convertDuration } from "utils/durationConverter";
import DragProgressBar from "./DragProgressBar";
import "./PlayerFullscreen.scss";
import tracksQueue from "common/tracksQueue";

import Router from "libs/rzf/Router";

import { Like } from "components/elements/Like";
import { Link } from "libs/rzf/Router";
import { ACTIONS } from "utils/flux/actions";
import { ActionsTrack } from "components/elements/ActionsTrack";
import { API } from "utils/api";
import Dispatcher from "libs/flux/Dispatcher";
import { TRACKS_STORAGE } from "utils/flux/storages";

export class PlayerFullscreen extends Component {
    private unsubscribe: () => void;
    private storageUnsubscribe: any;
    private playDragging: DragProgressBar;
    private volumeDragging: DragProgressBar;

    componentDidMount() {
        // подписки
        this.unsubscribe = player.subscribe(() => {
            this.setState({});     
        });
        this.storageUnsubscribe = TRACKS_STORAGE.subscribe(this.onAction);

        this.configurePlayProgressBar();
        this.configureVolumeProgressBar();
    }

    onAction = () => {
        this.setState({});
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        TRACKS_STORAGE.unsubscribe(this.onAction);
    }


    configurePlayProgressBar() {
        const fullProgress = document.getElementById("play-progress");
        const progress = document.getElementById("play-progress").querySelector(".rectangle-prev") as HTMLElement;
        const circle = document.getElementById("play-progress").querySelector(".circle") as HTMLElement;

        this.playDragging = new DragProgressBar(
            fullProgress,
            progress,
            circle,
            'play'
        );
    }

    configureVolumeProgressBar() {
        const fullProgress = document.getElementById("volume-progress");
        const progress = document.getElementById("volume-progress").querySelector(".rectangle-prev") as HTMLElement;
        const circle = document.getElementById("volume-progress").querySelector(".circle") as HTMLElement;

        this.volumeDragging = new DragProgressBar(
            fullProgress,
            progress,
            circle, 
            'volume'
        );
    }

    onLike = async () => {
        try {
            const res = (await API.postTrackLike(tracksQueue.getCurrentTrack().id, !tracksQueue.getCurrentTrack().is_liked)).body;
            Dispatcher.dispatch(new ACTIONS.TRACK_LIKE({...tracksQueue.getCurrentTrack(), is_liked: !tracksQueue.getCurrentTrack().is_liked}));
            this.setState({});
        } catch (e) {
            console.error(e);
            return;
        }
    }

    render() {
        const onResize = this.props.onResize;
        console.log("Render fullscreen") // срабатывает
        return [
            <div id="player" class="fullscreen-player">
                <div className="fullscreen-player__container">
                    <div className="fullscreen-player__song" id="song-container">
                        <img 
                            id="song-img" 
                            src={tracksQueue.getCurrentTrackImage()}
                            draggable={false}
                        />
                        <div className="fullscreen-player__song-text">
                            <span id="song-name" className="song-name">
                                {tracksQueue.getCurrentTrackName()}
                            </span>
                            <span id="artist-name" className="artist-name" 
                                onClick={() => {Router.push(tracksQueue.getAristURL(), {}); onResize()}}
                            >
                                {tracksQueue.getCurrentTrackArtist()}
                            </span>
                        </div>
                        <div className="fullscreen-player__controls">
                            <img 
                                src={tracksQueue.shuffled 
                                    ? "/static/img/player-shuffle-active.svg"
                                    : "/static/img/player-shuffle.svg"}
                                className="icon" 
                                id="shuffle" 
                                alt="Shuffle"
                                draggable={false}
                                onClick={() => {
                                    tracksQueue.shuffled 
                                        ? tracksQueue.unshuffle()
                                        : tracksQueue.shuffle();
                                    this.setState({});
                                }}
                            />
                            <img 
                                src="/static/img/player-prev.svg" 
                                className="icon" 
                                id="prev" 
                                alt="Prev"
                                draggable={false}
                                onClick={() => tracksQueue.previousTrack()}
                            />
                            <img 
                                src={player.audio.paused 
                                    ? "/static/img/player-play.svg" 
                                    : "/static/img/player-pause.svg"} 
                                className="icon" 
                                id="play" 
                                alt={player.audio.paused ? "Play" : "Pause"}
                                draggable={false}
                                onClick={() => player.togglePlay()}
                            />
                            <img 
                                src="/static/img/player-next.svg" 
                                className="icon" 
                                id="next" 
                                alt="Next"
                                draggable={false}
                                onClick={() => tracksQueue.nextTrack()}
                            />
                            <img 
                                src={tracksQueue.repeated 
                                    ? "/static/img/player-repeat-active.svg"
                                    : "/static/img/player-repeat.svg"} 
                                className="icon" 
                                id="repeat" 
                                alt="Repeat"
                                draggable={false}
                                onClick={() => {
                                    tracksQueue.repeated
                                        ? tracksQueue.unrepeat()
                                        : tracksQueue.repeat();
                                    this.setState({});
                                }}
                            />
                        </div>
                    </div>

                    <div className="fullscreen-player__bottom-content">
                        <div className="fullscreen-player__progress-container">
                            <span id="current-span">{convertDuration(player.getCurrentTime())}</span>
                            <div className="rectangle" id="play-progress">
                                <div className="rectangle-prev"></div>
                                <div className="circle"></div>
                            </div>
                            <span id="end-span">{convertDuration(player.getDuration())}</span>
                        </div>
                        <div className="fullscreen-player__tools">
                            <div className="icons" style={{ display: 'flex' }}>
                                <Like
                                    className="icon"
                                    style={{ order: 1 }}
                                    active={tracksQueue.getCurrentTrack().is_liked}
                                    onClick={this.onLike}
                                />
                                <ActionsTrack
                                    className="icon"
                                    style={{ order: 2 }}
                                    track={tracksQueue.getCurrentTrack()}
                                />
                            </div>
                            <div className="controls">
                                <img 
                                    className="icon" 
                                    src={player.audioLevel > 0 
                                        ? "/static/img/volume.svg" 
                                        : "/static/img/volume-mute.svg"} 
                                    alt="Volume" 
                                    draggable={false}
                                    onClick={() => player.toggleMute()}
                                />
                                <div className="rectangle-volume" id="volume-progress">
                                    <div className="rectangle-prev"></div>
                                    <div className="circle"></div>
                                </div>
                                <img 
                                    className="icon resize" 
                                    src="/static/img/minimize.svg" 
                                    id="resize" 
                                    alt="Fullscreen"
                                    draggable={false}
                                    onClick={onResize}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ];
    }
}

export default PlayerFullscreen;

