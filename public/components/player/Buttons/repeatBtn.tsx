import { Component } from "libs/rzf/Component";

import playerStorage from "utils/flux/PlayerStorage";
import { ACTIONS } from "utils/flux/actions";
import { PLAYER_STORAGE } from "utils/flux/storages";
import Dispatcher from "libs/flux/Dispatcher";

export class RepeatBtn extends Component {
    componentDidMount() {
        // подписки
        PLAYER_STORAGE.subscribe(this.onAction);
    }

    onAction = () => {
        this.setState({});
    }

    onRepeatAction = () => {
        Dispatcher.dispatch(new ACTIONS.QUEUE_REPEAT(null));
    }

    onUnrepeatAction = () => {
        Dispatcher.dispatch(new ACTIONS.QUEUE_UNREPEAT(null));
    }

    componentWillUnmount() {
        PLAYER_STORAGE.unsubscribe(this.onAction);
    }
    
    render() {
        return [
            <img 
                draggable={false}
                src={ playerStorage.repeated 
                    ? "/static/img/player-repeat-active.svg"
                    : "/static/img/player-repeat.svg"
                } 
                className="icon" 
                id="repeat" 
                alt="Repeat"
                onClick={() => {
                    playerStorage.repeated
                        ? this.onUnrepeatAction()
                        : this.onRepeatAction();
                }}
            />
        ];
    }
}

