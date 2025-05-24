import { Component } from "libs/rzf/Component";

import playerStorage from "utils/flux/PlayerStorage";
import { ACTIONS } from "utils/flux/actions";
import { PLAYER_STORAGE } from "utils/flux/storages";
import Dispatcher from "libs/flux/Dispatcher";

export class VolumeBtn extends Component {
    componentDidMount() {
        // подписки
        PLAYER_STORAGE.subscribe(this.onAction);
    }

    onAction = () => {
        this.setState({});
    }

    onToggleMuteAction = () => {
        Dispatcher.dispatch(new ACTIONS.AUDIO_TOGGLE_MUTE(null));
    }

    componentWillUnmount() {
        PLAYER_STORAGE.unsubscribe(this.onAction);
    }
    
    render() {
        return [
            <img 
                draggable={false}
                className="icon" 
                src={playerStorage.audioLevel > 0 
                    ? "/static/img/volume.svg" 
                    : "/static/img/volume-mute.svg"} 
                onClick={this.onToggleMuteAction}
                alt="Volume" 
            />
        ];
    }
}

