import { Component } from "libs/rzf/Component";

import playerStorage from "utils/flux/PlayerStorage";
import { ACTIONS } from "utils/flux/actions";
import { JAM_STORAGE, PLAYER_STORAGE } from "utils/flux/storages";
import Dispatcher from "libs/flux/Dispatcher";
import { JamToggleError } from "common/errors";

export class ShuffleBtn extends Component {
    componentDidMount() {
        // подписки
        PLAYER_STORAGE.subscribe(this.onAction);
    }

    onAction = () => {
        this.setState({});
    }

    onShuffleAction = () => {
        if (JAM_STORAGE.roomId && !JAM_STORAGE.isLeader) {
            Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
                message: JamToggleError,
                type: 'error'
            }));
            return;
        }

        Dispatcher.dispatch(new ACTIONS.QUEUE_SHUFFLE(null));
    }

    onUnshuffleAction = () => {
        if (JAM_STORAGE.roomId && !JAM_STORAGE.isLeader) {
            Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
                message: JamToggleError,
                type: 'error'
            }));
            return;
        }

        Dispatcher.dispatch(new ACTIONS.QUEUE_UNSHUFFLE(null));
    }

    componentWillUnmount() {
        PLAYER_STORAGE.unsubscribe(this.onAction);
    }
    
    render() {
        return [
            <img 
                draggable={false}
                src={ playerStorage.shuffled 
                    ? "/static/img/player-shuffle-active.svg"
                    : "/static/img/player-shuffle.svg"
                }
                className="icon" 
                id="shuffle" 
                alt="Shuffle" 
                onClick={() => {
                    playerStorage.shuffled 
                        ? this.onUnshuffleAction()
                        : this.onShuffleAction();
                    this.setState({});
                }}
            />
        ];
    }
}

