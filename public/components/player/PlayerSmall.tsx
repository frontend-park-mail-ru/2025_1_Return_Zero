import { Component } from "libs/rzf/Component";
import player from 'common/player';
import { convertDuration } from "utils/durationConverter";
import DragProgressBar from "./DragProgressBar";

import "./PlayerSmall.scss";
import tracksQueue from "common/tracksQueue";

export class PlayerSmall extends Component {
    private unsubscribe: () => void;
    private playDragging: DragProgressBar;
    private volumeDragging: DragProgressBar;

    componentDidMount() {
        this.unsubscribe = player.subscribe(() => {
            this.setState({});
        });
        this.configurePlayProgressBar();
        this.configureVolumeProgressBar();
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
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

    render() {
        return [
            <div id="player" class="small-player">
                <div className="small-player__container">
                    <div className="small-player__song-container">
                        <div className="small-player__song" id="song-container">
                            <img id="song-img"
                                src={tracksQueue.getCurrentTrackImage()}
                            />
                            <div className="small-player__song-text">
                                <span id="song-name" className="song-name">{tracksQueue.getCurrentTrackName()}</span>
                                <span id="artist-name" className="artist-name">{tracksQueue.getCurrentTrackArtist()}</span>
                            </div>
                        </div>
                        <img src='/static/img/like-default.svg' className='icon' alt='Like' />
                        <img src='/static/img/dots.svg' className='icon' alt='Menu' />
                    </div>

                    <div className="small-player__widgets">
                        <div className="small-player__controls">
                            <img 
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
                                onClick={() => tracksQueue.previousTrack()}
                            />
                            <img 
                                src={player.audio.paused 
                                    ? "/static/img/player-play.svg" 
                                    : "/static/img/player-pause.svg"} 
                                className="icon" 
                                id="play" 
                                alt={player.audio.paused ? "Play" : "Pause"}
                                onClick={() => player.togglePlay()}
                            />
                            <img src="/static/img/player-next.svg" className="icon" id="next" alt="Next"
                                onClick={() => tracksQueue.nextTrack()}
                            />
                            <img 
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
                        <img className="icon resize" src="/static/img/maximize.svg" id="resize" alt="Small" />
                    </div>
                </div>
            </div>
        ];
    }
}

export default PlayerSmall;

