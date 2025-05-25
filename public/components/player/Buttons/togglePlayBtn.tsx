import { Component } from "libs/rzf/Component";

import playerStorage from "utils/flux/PlayerStorage";
import { ACTIONS } from "utils/flux/actions";
import { PLAYER_STORAGE } from "utils/flux/storages";
import Dispatcher from "libs/flux/Dispatcher";

export class TogglePlayBtn extends Component {
    componentDidMount() {
        // подписки
        PLAYER_STORAGE.subscribe(this.onAction);
    }

    onAction = () => {
        this.setState({});
    }

    onTogglePlayAction = () => {
        Dispatcher.dispatch(new ACTIONS.AUDIO_TOGGLE_PLAY(null));
        Dispatcher.dispatch(new ACTIONS.JAM_PLAY(null));
    }

    componentWillUnmount() {
        PLAYER_STORAGE.unsubscribe(this.onAction);
    }
    
    render() {
        return [
            <img 
                draggable={false}
                src={playerStorage.isPlaying 
                    ? "/static/img/player-pause.svg" 
                    : "/static/img/player-play.svg"} 
                className="icon" 
                id="play" 
                alt={playerStorage.isPlaying ? "Play" : "Pause"}
                onClick={this.onTogglePlayAction}
            />
        ];
    }
}

