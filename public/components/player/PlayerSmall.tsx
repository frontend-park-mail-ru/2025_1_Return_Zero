import { Component } from "libs/rzf/Component";
import { convertDuration } from "utils/durationConverter";
import DragProgressBar from "./DragHandlers/DragProgressBar";

import "./PlayerSmall.scss";

import { Actions } from "components/elements/Actions";
import { ActionsAddToPlaylist, ActionsAddToQueue, ActionsToAlbum, ActionsToArtist } from "components/elements/ActionsTrack";
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

export class PlayerSmall extends Component {
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
            <div id="player" className="small-player">
                <div className="small-player__container">
                    <div className="small-player__song-container" style={{ display: 'flex' }}>
                        <div className="small-player__song" id="song-container" style={{ order: 1 }}>
                            <img
                                id="song-img"
                                src={playerStorage.currentTrackImage}
                            />
                            <div className="small-player__song-text">
                                <SongName />
                                <SongArtist />
                            </div>
                        </div>

                        {playerStorage.currentTrack && [
                            <Actions 
                                className="icon" 
                                opened={this.state.actions_opened} 
                                onClick={() => this.setState({ actions_opened: !this.state.actions_opened })} 
                                style={{ order: 2 }}
                            >
                                <ActionsAddToPlaylist track={playerStorage.currentTrack} />
                                <ActionsAddToQueue track={playerStorage.currentTrack} />
                                <ActionsToAlbum track={playerStorage.currentTrack} />
                                <ActionsToArtist track={playerStorage.currentTrack} />
                            </Actions>,
                            <LikeBtn />,
                        ]}
                    </div>


                    <div className="small-player__widgets">
                        <div className="small-player__controls">
                            <ShuffleBtn />
                            <PrevBtn />
                            <TogglePlayBtn />
                            <NextBtn />
                            <RepeatBtn />
                        </div>
                        <div className="small-player__progress-container">
                            <span id="current-span">{convertDuration(playerStorage.currentTime)}</span>
                            <div className="rectangle" id="play-progress">
                                <div className="rectangle-prev"></div>
                                <div className="circle"></div>
                            </div>
                            <span id='end-span'>{convertDuration(playerStorage.duration)}</span>
                        </div>
                    </div>

                    <div className="small-player__tools">
                        <VolumeBtn />
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

