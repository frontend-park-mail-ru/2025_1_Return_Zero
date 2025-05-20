import { Component } from 'libs/rzf/Component';

import './PlayerMobile.scss';

import { TRACKS_STORAGE } from "utils/flux/storages";
import { PLAYER_STORAGE } from "utils/flux/storages";

import { SongName } from './SongTitle/SongName';
import { SongArtist } from './SongTitle/SongArtist';
import { NextBtn } from './Buttons/nextBtn';
import { PrevBtn } from './Buttons/prevBtn';
import { TogglePlayBtn } from './Buttons/togglePlayBtn';

import playerStorage from "utils/flux/PlayerStorage";

export class PlayerMobile extends Component {
    componentDidMount() {
        // подписки
        TRACKS_STORAGE.subscribe(this.onAction);
        PLAYER_STORAGE.subscribe(this.onAction);
    }

    onAction = () => {
        this.setState({});
    }

    componentWillUnmount() {
        TRACKS_STORAGE.unsubscribe(this.onAction);
        PLAYER_STORAGE.unsubscribe(this.onAction);
    }

    clickHandler = (onResize: () => void) => (e: MouseEvent) => {
        e.preventDefault();
    
        const notAllowedClick = ['play', 'next', 'prev', 'song-img'];
        if (e.target instanceof HTMLElement) {
            if (notAllowedClick.includes(e.target.id)) {
                return;
            }
    
            onResize();
        }
    }

    render() {
        return [
            <div id='player' className='mobile-player'
                onClick={this.clickHandler(this.props.onResize)}
            >
                <div className="mobile-player__container">
                    <div className="mobile-player__song" id="song-container">
                        <img id="song-img"
                            src={playerStorage.currentTrackImage}
                        />
                        <div className="mobile-player__song-text">
                            <SongName />
                            <SongArtist />
                        </div>
                    </div>
            
                    <div className="mobile-player__controls"
                        draggable={false}
                    >
                        <PrevBtn />
                        <TogglePlayBtn />
                        <NextBtn />
                    </div>
                </div>
                <div className="mobile-player__progress-container">
                    <div className="rectangle" id="play-progress">
                        <div className="rectangle-prev"
                            style = {{
                                width: `${ playerStorage.currentTime / playerStorage.duration * 100 }%`
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        ];
    }
}

export default PlayerMobile;
