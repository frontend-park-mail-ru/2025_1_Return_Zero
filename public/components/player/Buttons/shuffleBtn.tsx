import { Component } from "libs/rzf/Component";

import playerStorage from "utils/flux/PlayerStorage";
import { ACTIONS } from "utils/flux/actions";
import { PLAYER_STORAGE } from "utils/flux/storages";
import Dispatcher from "libs/flux/Dispatcher";

export class ShuffleBtn extends Component {
    componentDidMount() {
        // подписки
        PLAYER_STORAGE.subscribe(this.onAction);
    }

    onAction = () => {
        this.setState({});
    }

    onShuffleAction = () => {
        Dispatcher.dispatch(new ACTIONS.QUEUE_SHUFFLE(null));
    }

    onUnshuffleAction = () => {
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

