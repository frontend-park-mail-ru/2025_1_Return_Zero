import { Component } from "libs/rzf/Component";
import player from 'common/player';
import { convertDuration } from "utils/durationConverter";
import tracksQueue from "common/tracksQueue";
import MobileDragProgressBar from "./MobileDragProgressBar";

import Router from "libs/rzf/Router";

import "./PlayerMobileFullscreen.scss";

export class PlayerMobileFullscreen extends Component {
    private unsubscribe: () => void;
    private playDragging: MobileDragProgressBar;

    componentDidMount() {
        this.unsubscribe = player.subscribe(() => {
            this.setState({});
        });
        this.configurePlayProgressBar();
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

        this.playDragging = new MobileDragProgressBar(
            fullProgress,
            progress,
            circle,
            'play'
        );
    }

    render() {
        const onResize = this.props.onResize;
        
        return [
            <div id="player" class="fullscreen-mobile-player">
                <div className="fullscreen-mobile-player__container">
                    <div class="fullscreen-mobile-player__container__top">
                        <div class="album-href">Перейти к альбому</div>
                        <img onClick={this.props.onResize} class="cross" src="/static/img/cross.svg" />
                    </div>
                    <img 
                        id="song-img"
                        class="song-img" 
                        src={tracksQueue.getCurrentTrackImage()}
                        draggable={false}
                    />

                    <div  class="fullscreen-mobile-player__container__widgets">
                        <img src="/static/img/dots.svg" />
                        <div className="song-text">
                            <span id="song-name" className="song-name">
                                {tracksQueue.getCurrentTrackName()}
                            </span>
                            <span id="artist-name" className="artist-name" 
                                onClick={() => {Router.push(tracksQueue.getAristURL(), {}); onResize()}}
                            >
                                {tracksQueue.getCurrentTrackArtist()}
                            </span>
                        </div>
                        <img src="/static/img/like-default.svg" />
                    </div> 

                    <div className="fullscreen-mobile-player__container__line">
                        <div className="fullscreen-mobile-player__container__progress-container">
                            <div className="rectangle" id="play-progress">
                                <div className="rectangle-prev"></div>
                                <div className="circle"></div>
                            </div>
                        </div>

                        <div className="fullscreen-mobile-player__container__duration">
                            <span id="current-span">{convertDuration(player.getCurrentTime())}</span>
                            <span id='end-span'>{convertDuration(player.getDuration())}</span>
                        </div>
                    </div>

                    <div className="fullscreen-mobile-player__container__controls">
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
            </div>
        ];
    }
}

export default PlayerMobileFullscreen;

