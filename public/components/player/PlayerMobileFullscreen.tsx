import { Component } from "libs/rzf/Component";
import { convertDuration } from "utils/durationConverter";
import MobileDragProgressBar from "./DragHandlers/MobileDragProgressBar";

import Router from "libs/rzf/Router";

import "./PlayerMobileFullscreen.scss";

import { Like } from "components/elements/Like";
import { ACTIONS } from "utils/flux/actions";
import { ActionsAddToPlaylist, ActionsAddToQueue, ActionsToAlbum, ActionsToArtist } from "components/elements/ActionsTrack";
import { API } from "utils/api";
import Dispatcher from "libs/flux/Dispatcher";
import { TRACKS_STORAGE } from "utils/flux/storages";
import { PLAYER_STORAGE } from "utils/flux/storages";
import { Actions } from "components/elements/Actions";

import { SongName } from "./SongTitle/SongName";
import { SongArtist } from "./SongTitle/SongArtist";
import { TogglePlayBtn } from "./Buttons/togglePlayBtn";
import { PrevBtn } from "./Buttons/prevBtn";
import { NextBtn } from "./Buttons/nextBtn";
import { RepeatBtn } from "./Buttons/repeatBtn";
import { ShuffleBtn } from "./Buttons/shuffleBtn";

import playerStorage from "utils/flux/PlayerStorage";

export class PlayerMobileFullscreen extends Component {
    private playDragging: MobileDragProgressBar;

    state = {
        actions_opened: false,
    }
    
    componentDidMount() {
        // подписки
        TRACKS_STORAGE.subscribe(this.onAction);
        PLAYER_STORAGE.subscribe(this.onAction);
        this.configurePlayProgressBar();
    }

    onAction = () => {
        this.setState({});
    }

    componentWillUnmount() {
        TRACKS_STORAGE.unsubscribe(this.onAction);
        PLAYER_STORAGE.unsubscribe(this.onAction);
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
        const currentTrack = playerStorage.currentTrack;

        try {
            const res = (await API.postTrackLike(currentTrack.id, !currentTrack.is_liked)).body;
            Dispatcher.dispatch(new ACTIONS.TRACK_LIKE({...currentTrack, is_liked: !currentTrack.is_liked}));
            this.setState({});
        } catch (e) {
            console.error(e);
            return;
        }
    }


    render() {
        const onResize = this.props.onResize;

        return [
            <div id="player" class="fullscreen-mobile-player" style={{ overscrollBehavior: 'contain' }}>
                <div className="fullscreen-mobile-player__container">
                    <div class="fullscreen-mobile-player__container__top">
                        <div onClick={() => Router.push(playerStorage.currentTrack.album_page, {})}
                            class="album-href"
                            >
                                Перейти к альбому
                        </div>
                        <img onClick={this.props.onResize} class="cross" src="/static/img/cross.svg" />
                    </div>

                    <img 
                        id="song-img"
                        class="song-img" 
                        onTouchMove={this.handleTouchMove}
                        src={playerStorage.currentTrackImage}
                        draggable={false}
                        onTouchStart={this.handleTouchStart}
                        onTouchEnd={this.handleTouchEnd}
                    />

                    <div class="fullscreen-mobile-player__container__widgets">
                        <Like className="icon" active={playerStorage.currentTrack.is_liked} onClick={this.onLike}/>
                        <div className="song-text">
                            <SongName />
                            <SongArtist onResize={onResize} />
                        </div>
                        <Actions className="icon">
                            <ActionsAddToPlaylist track={playerStorage.currentTrack} />
                            <ActionsAddToQueue track={playerStorage.currentTrack} />
                            <ActionsToAlbum track={playerStorage.currentTrack} />
                            <ActionsToArtist track={playerStorage.currentTrack} />
                        </Actions>
                    </div> 

                    <div className="fullscreen-mobile-player__container__line">
                        <div className="fullscreen-mobile-player__container__progress-container">
                            <div className="rectangle" id="play-progress">
                                <div className="rectangle-prev"></div>
                                <div className="circle"></div>
                            </div>
                        </div>

                        <div className="fullscreen-mobile-player__container__duration">
                            <span id="current-span">{convertDuration(playerStorage.currentTime)}</span>
                            <span id='end-span'>{convertDuration(playerStorage.duration)}</span>
                        </div>
                    </div>

                    <div className="fullscreen-mobile-player__container__controls">
                        <ShuffleBtn />
                        <PrevBtn />
                        <TogglePlayBtn />
                        <NextBtn />
                        <RepeatBtn />
                    </div>
                </div>
            </div>
        ];
    }
}

export default PlayerMobileFullscreen;

