import { Component } from "libs/rzf/Component";

import { ACTIONS } from "utils/flux/actions";
import { JAM_STORAGE, PLAYER_STORAGE } from "utils/flux/storages";
import Dispatcher from "libs/flux/Dispatcher";

export class PrevBtn extends Component {
    componentDidMount() {
        // подписки
        PLAYER_STORAGE.subscribe(this.onAction);
    }

    onAction = () => {
        this.setState({});
    }

    onPrevAction = () => {
        if (JAM_STORAGE.roomId && !JAM_STORAGE.isLeader) {
            Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
                message: 'Сначала выйдите из режима Jam',
                type: 'error'
            }));
            return;
        }
        
        Dispatcher.dispatch(new ACTIONS.QUEUE_PREV(null));
    }

    componentWillUnmount() {
        PLAYER_STORAGE.unsubscribe(this.onAction);
    }
    
    render() {
        return [
            <img src="/static/img/player-prev.svg" className="icon" id="prev" alt="Prev"
                draggable={false}
                onClick={this.onPrevAction}
            />
        ];
    }
}

