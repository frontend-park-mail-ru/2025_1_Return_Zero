import { Component } from "libs/rzf/Component";
import player from 'common/player';
import { convertDuration } from "utils/durationConverter";
import tracksQueue from "common/tracksQueue";
import MobileDragProgressBar from "./MobileDragProgressBar";

import Router from "libs/rzf/Router";

import "./PlayerMobileFullscreen.scss";

import { Like } from "components/elements/Like";
import { ACTIONS } from "utils/flux/actions";
import { ActionsTrack } from "components/elements/ActionsTrack";
import { API } from "utils/api";
import Dispatcher from "libs/flux/Dispatcher";
import { TRACKS_STORAGE } from "utils/flux/storages";
import { updateMarquee } from "common/marquee";

export class PlayerMobileFullscreen extends Component {
    private unsubscribe: () => void;
    private storageUnsubscribe: any;
    private playDragging: MobileDragProgressBar;

    state = {
        actions_opened: false,
    }

    componentDidMount() {
        // подписки
        this.unsubscribe = player.subscribe(() => {
            this.setState({});    
        });
        this.storageUnsubscribe = TRACKS_STORAGE.subscribe(this.onAction);

        this.configurePlayProgressBar();

        queueMicrotask(() => updateMarquee());
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

        this.playDragging = new MobileDragProgressBar(
            fullProgress,
            progress,
            circle,
            'play'
        );
    }

    private touchStartY: number = 0;

    handleTouchStart = (e: TouchEvent) => {
        this.touchStartY = e.touches[0].clientY;
    };

    handleTouchEnd = (e: TouchEvent) => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - this.touchStartY;

        if (deltaY > 50) {
            this.props.onResize();
        }
    };

    handleTouchMove = (e: TouchEvent) => {
        if (this.touchStartY !== null) {
            e.preventDefault();
        }
    };

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
        console.warn(tracksQueue.getCurrentTrack());

        return [
            <div id="player" class="fullscreen-mobile-player" style={{ overscrollBehavior: 'contain' }}>
                <div className="fullscreen-mobile-player__container">
                    <div class="fullscreen-mobile-player__container__top">
                        <div onClick={() => Router.push(tracksQueue.getCurrentTrack().album_page, {})} class="album-href">Перейти к альбому</div>
                        <img onClick={this.props.onResize} class="cross" src="/static/img/cross.svg" />
                    </div>

                    <img 
                        id="song-img"
                        class="song-img" 
                        onTouchMove={this.handleTouchMove}
                        src={tracksQueue.getCurrentTrackImage()}
                        draggable={false}
                        onTouchStart={this.handleTouchStart}
                        onTouchEnd={this.handleTouchEnd}
                    />

                    <div class="fullscreen-mobile-player__container__widgets">
                        <Like className="icon" active={tracksQueue.getCurrentTrack().is_liked} onClick={this.onLike}/>
                        <div className="song-text">
                            <div id="song-name" className="song-name">
                                <span className="marquee">{tracksQueue.getCurrentTrackName()}</span>
                            </div>
                            <div id="artist-name" className="artist-name" 
                                onClick={() => {Router.push(tracksQueue.getAristURL(), {}); onResize()}}
                            >
                                <span className="marquee">{tracksQueue.getCurrentTrackArtist()}</span>
                            </div>
                        </div>
                        <ActionsTrack track={tracksQueue.getCurrentTrack()} />
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

