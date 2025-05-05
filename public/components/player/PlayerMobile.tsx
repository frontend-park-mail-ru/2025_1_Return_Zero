import { Component } from 'libs/rzf/Component';

import tracksQueue from 'common/tracksQueue';
import player from 'common/player';
import './PlayerMobile.scss';

export class PlayerMobile extends Component {
    private unsubscribe: () => void;

    componentDidMount() {
        this.unsubscribe = player.subscribe(() => {
            this.setState({});
        });
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
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
                            src={tracksQueue.getCurrentTrackImage()}
                        />
                        <div className="mobile-player__song-text">
                            <span id="song-name" className="song-name">{tracksQueue.getCurrentTrackName()}</span>
                            <span id="artist-name" className="artist-name">
                                {tracksQueue.getCurrentTrackArtist()}
                            </span>
                        </div>
                    </div>
            
                    <div className="mobile-player__controls"
                        draggable={false}
                    >
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
                    </div>
                </div>
                <div className="mobile-player__progress-container">
                    <div className="rectangle" id="play-progress">
                        <div className="rectangle-prev"
                            style = {{
                                width: `${ player.audio.currentTime / player.audio.duration * 100 }%`
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        ];
    }
}

export default PlayerMobile;
