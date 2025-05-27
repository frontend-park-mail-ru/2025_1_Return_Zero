import { Component } from "libs/rzf/Component";

import { ACTIONS } from "utils/flux/actions";
import { JAM_STORAGE, PLAYER_STORAGE } from "utils/flux/storages";
import Dispatcher from "libs/flux/Dispatcher";

export class NextBtn extends Component {
    componentDidMount() {
        // подписки
        PLAYER_STORAGE.subscribe(this.onAction);
    }

    onAction = () => {
        this.setState({});
    }

    onNextAction = () => {
        if (JAM_STORAGE.roomId && !JAM_STORAGE.isLeader) {
            Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
                message: 'Сначала выйдите из режима Jam',
                type: 'error'
            }));
            return;
        }
        Dispatcher.dispatch(new ACTIONS.QUEUE_NEXT(null));
    }

    componentWillUnmount() {
        PLAYER_STORAGE.unsubscribe(this.onAction);
    }
    
    render() {
        return [
            <img src="/static/img/player-next.svg" className="icon" id="next" alt="Next"
                draggable={false}
                onClick={this.onNextAction}
            />
        ];
    }
}

