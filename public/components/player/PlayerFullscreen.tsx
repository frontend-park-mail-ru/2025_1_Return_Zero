import { Component } from "libs/rzf/Component";
import { convertDuration } from "utils/durationConverter";
import DragProgressBar from "./DragHandlers/DragProgressBar";
import "./PlayerFullscreen.scss";

import { ActionsTrack } from "components/elements/ActionsTrack";
import { TRACKS_STORAGE } from "utils/flux/storages";
import { PLAYER_STORAGE } from "utils/flux/storages";

import { SongName } from "./SongTitle/SongName";
import { SongArtist } from "./SongTitle/SongArtist";
import { TogglePlayBtn } from "./Buttons/togglePlayBtn";
import { PrevBtn } from "./Buttons/prevBtn";
import { NextBtn } from "./Buttons/nextBtn";
import { VolumeBtn } from "./Buttons/volumeBtn";
import { RepeatBtn } from "./Buttons/repeatBtn";
import { ShuffleBtn } from "./Buttons/shuffleBtn";
import { LikeBtn } from "./Buttons/likeBtn";

import playerStorage from "utils/flux/PlayerStorage";

export class PlayerFullscreen extends Component {
    private playDragging: DragProgressBar;
    private volumeDragging: DragProgressBar;

    state = {
        actions_opened: false,
    }
    
    componentDidMount() {
        // подписки
        TRACKS_STORAGE.subscribe(this.onAction);
        PLAYER_STORAGE.subscribe(this.onAction);
        this.configurePlayProgressBar();
        this.configureVolumeProgressBar();
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
        const onResize = this.props.onResize;
        
        return [
            <div id="player" class="fullscreen-player">
                <div className="fullscreen-player__container">
                    <div className="fullscreen-player__song" id="song-container">
                        <img 
                            id="song-img" 
                            src={playerStorage.currentTrackImage}
                            draggable={false}
                        />
                        <div className="fullscreen-player__song-text">
                            <SongName />
                            <SongArtist onResize={onResize}/>
                        </div>
                        <div className="fullscreen-player__controls">
                            <ShuffleBtn />
                            <PrevBtn />
                            <TogglePlayBtn />
                            <NextBtn />
                            <RepeatBtn />
                        </div>
                    </div>

                    <div className="fullscreen-player__bottom-content">
                        <div className="fullscreen-player__progress-container">
                            <span id="current-span">{convertDuration(playerStorage.currentTime)}</span>
                            <div className="rectangle" id="play-progress">
                                <div className="rectangle-prev"></div>
                                <div className="circle"></div>
                            </div>
                            <span id="end-span">{convertDuration(playerStorage.duration)}</span>
                        </div>
                        <div className="fullscreen-player__tools">
                        <div className="icons" style={{ display: 'flex' }}>
                            <ActionsTrack track={playerStorage.currentTrack} />
                            <LikeBtn track={playerStorage.currentTrack} />
                        </div>
                            <div className="controls">
                                <VolumeBtn />
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

