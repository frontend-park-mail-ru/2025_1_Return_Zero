import { Component } from "libs/rzf/Component";
import { API } from "utils/api";

import playerStorage from "utils/flux/PlayerStorage";
import { ACTIONS } from "utils/flux/actions";
import { TRACKS_STORAGE } from "utils/flux/storages";
import Dispatcher from "libs/flux/Dispatcher";
import { Like } from "components/elements/Like";


export class LikeBtn extends Component {
    componentDidMount() {
        // подписки
        TRACKS_STORAGE.subscribe(this.onAction);
    }

    onAction = () => {
        this.setState({});
    }

    onLike = async () => {
        const currentTrack = playerStorage.currentTrack;

        try {
            const res = (await API.postTrackLike(currentTrack.id, !currentTrack.is_liked)).body;
            Dispatcher.dispatch(new ACTIONS.TRACK_LIKE({...currentTrack, is_liked: !currentTrack.is_liked}));
            this.setState({});
        } catch (e) {
            console.error(e);
            return;
        }
    }

    componentWillUnmount() {
        TRACKS_STORAGE.unsubscribe(this.onAction);
    }
    
    render() {
        return [
            <Like 
                className="icon" 
                style={{ order: 2 }} 
                active={playerStorage.currentTrack.is_liked} 
                onClick={this.onLike} 
            />
        ];
    }
}

