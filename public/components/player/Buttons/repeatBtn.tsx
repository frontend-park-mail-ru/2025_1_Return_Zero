import { Component } from "libs/rzf/Component";

import playerStorage from "utils/flux/PlayerStorage";
import { ACTIONS } from "utils/flux/actions";
import { JAM_STORAGE, PLAYER_STORAGE } from "utils/flux/storages";
import Dispatcher from "libs/flux/Dispatcher";
import { JamToggleError } from "common/errors";
export class RepeatBtn extends Component {
    componentDidMount() {
        // подписки
        PLAYER_STORAGE.subscribe(this.onAction);
    }

    onAction = () => {
        this.setState({});
    }

    onRepeatAction = () => {
        if (JAM_STORAGE.roomId && !JAM_STORAGE.isLeader) {
            Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
                message: JamToggleError,
                type: 'error'
            }));
            return;
        }

        Dispatcher.dispatch(new ACTIONS.QUEUE_REPEAT(null));
    }

    onUnrepeatAction = () => {
        if (JAM_STORAGE.roomId && !JAM_STORAGE.isLeader) {
            Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
                message: 'Сначала выйдите из режима Jam',
                type: 'error'
            }));
            return;
        }

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

