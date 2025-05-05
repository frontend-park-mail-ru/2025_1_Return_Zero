import { Component } from "libs/rzf/Component";
import player from 'common/player';
import { convertDuration } from "utils/durationConverter";
import DragProgressBar from "./DragProgressBar";

import "./PlayerSmall.scss";
import tracksQueue from "common/tracksQueue";

import { Like } from "components/elements/Like";
import { Link } from "libs/rzf/Router";
import { ACTIONS } from "utils/flux/actions";
import { ActionsTrack } from "components/elements/ActionsTrack";
import { API } from "utils/api";
import Dispatcher from "libs/flux/Dispatcher";
import { TRACKS_STORAGE } from "utils/flux/storages";

export class PlayerSmall extends Component {
    private unsubscribe: () => void;
    private storageUnsubscribe: any
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
        console.log("Small on action");
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

        return [
            <div id="player" className="small-player">
                <div className="small-player__container">
                    <div className="small-player__song-container">
                        <div className="small-player__song" id="song-container" style={{ order: 1 }}>
                            <img
                                id="song-img"
                                src={tracksQueue.getCurrentTrackImage()}
                            />
                            <div className="small-player__song-text">
                                <span id="song-name" className="song-name">{tracksQueue.getCurrentTrackName()}</span>
                                <Link id="artist-name" className="artist-name" to={tracksQueue.getAristURL()}>
                                    {tracksQueue.getCurrentTrackArtist()}
                                </Link>
                            </div>
                        </div>

                        {tracksQueue.getCurrentTrack() && [
                            <ActionsTrack
                                key="actions"
                                className="icon"
                                style={{ order: 10 }}
                                track={tracksQueue.getCurrentTrack()}
                            />,
                            <Like
                                key="like"
                                className="icon"
                                style={{ order: 3 }}
                                active={tracksQueue.getCurrentTrack().is_liked}
                                onClick={this.onLike}
                            />,
                        ]}
                    </div>

                    <div className="small-player__widgets">
                        <div className="small-player__controls">
                            <img 
                                draggable={false}
                                src={ tracksQueue.shuffled 
                                    ? "/static/img/player-shuffle-active.svg"
                                    : "/static/img/player-shuffle.svg"
                                }
                                className="icon" 
                                id="shuffle" 
                                alt="Shuffle" 
                                onClick={() => {
                                    tracksQueue.shuffled 
                                        ? tracksQueue.unshuffle()
                                        : tracksQueue.shuffle();
                                    this.setState({});
                                }}
                            />
                            <img src="/static/img/player-prev.svg" className="icon" id="prev" alt="Prev"
                                draggable={false}
                                onClick={() => tracksQueue.previousTrack()}
                            />
                            <img 
                                draggable={false}
                                src={player.audio.paused 
                                    ? "/static/img/player-play.svg" 
                                    : "/static/img/player-pause.svg"} 
                                className="icon" 
                                id="play" 
                                alt={player.audio.paused ? "Play" : "Pause"}
                                onClick={() => player.togglePlay()}
                            />
                            <img src="/static/img/player-next.svg" className="icon" id="next" alt="Next"
                                draggable={false}
                                onClick={() => tracksQueue.nextTrack()}
                            />
                            <img 
                                draggable={false}
                                src={ tracksQueue.repeated 
                                    ? "/static/img/player-repeat-active.svg"
                                    : "/static/img/player-repeat.svg"
                                } 
                                className="icon" 
                                id="repeat" 
                                alt="Repeat"
                                onClick={() => {
                                    tracksQueue.repeated
                                        ? tracksQueue.unrepeat()
                                        : tracksQueue.repeat();
                                    this.setState({}); 
                                }}
                            />
                        </div>
                        <div className="small-player__progress-container">
                            <span id="current-span">{convertDuration(player.getCurrentTime())}</span>
                            <div className="rectangle" id="play-progress">
                                <div className="rectangle-prev"></div>
                                <div className="circle"></div>
                            </div>
                            <span id='end-span'>{convertDuration(player.getDuration())}</span>
                        </div>
                    </div>

                    <div className="small-player__tools">
                        <img 
                            draggable={false}
                            className="icon" 
                            src={player.audioLevel > 0 
                                ? "/static/img/volume.svg" 
                                : "/static/img/volume-mute.svg"} 
                            onClick={() => player.toggleMute()}
                            alt="Volume" 
                        />
                        <div className="rectangle-volume" id="volume-progress">
                            <div className="rectangle-prev"></div>
                            <div className="circle"></div>
                        </div>
                        <img draggable={false} className="icon resize" src="/static/img/maximize.svg" id="resize" alt="Small" 
                            onClick={onResize}
                        />
                    </div>
                </div>
            </div>
        ];
    }
}

export default PlayerSmall;

