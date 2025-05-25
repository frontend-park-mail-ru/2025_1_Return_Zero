import { Component } from "libs/rzf/Component";
import { API } from "utils/api";

import playerStorage from "utils/flux/PlayerStorage";
import { ACTIONS } from "utils/flux/actions";
import { PLAYER_STORAGE, TRACKS_STORAGE } from "utils/flux/storages";
import Dispatcher from "libs/flux/Dispatcher";
import { Like } from "components/elements/Like";
import Broadcast from "common/broadcast";

export class LikeBtn extends Component {
    state: {
        is_liked: boolean,
    } = {
        is_liked: false,
    }

    componentDidMount() {
        // подписки
        TRACKS_STORAGE.subscribe(this.onAction);
        PLAYER_STORAGE.subscribe(this.onAction);
    }

    componentWillUnmount() {
        TRACKS_STORAGE.unsubscribe(this.onAction);
        PLAYER_STORAGE.unsubscribe(this.onAction);
    }

    onAction = (action: any): void => {
        this.setState({is_liked: TRACKS_STORAGE.isLiked(playerStorage.currentTrack)});
    }

    onLike = () => {
        try {
            Dispatcher.dispatch(new ACTIONS.TRACK_LIKE(this.props.track));
        } catch (e) {
            console.error(e);
            return;
        }
    }
    
    render() {
        return [ 
            <Like 
                className="icon" 
                active={this.state.is_liked} 
                onClick={this.onLike} 
            />
        ];
    }
}


