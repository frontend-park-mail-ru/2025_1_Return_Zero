import { Component } from "libs/rzf/Component";
import { API } from "utils/api";

import playerStorage from "utils/flux/PlayerStorage";
import { ACTIONS } from "utils/flux/actions";
import { TRACKS_STORAGE } from "utils/flux/storages";
import Dispatcher from "libs/flux/Dispatcher";
import { Like } from "components/elements/Like";


export class LikeBtn extends Component {
    state: {
        is_liked: boolean,
    } = {
        is_liked: false,
    }

    componentDidMount() {
        // подписки
        TRACKS_STORAGE.subscribe(this.onAction);
    }

    onAction = (action: any): void => {
        switch (true) {
            case action instanceof ACTIONS.TRACK_LIKE:
                this.onLike(false);
                break;
        }

        this.setState({ is_liked: this.props.track.is_liked });  
    }

    onLike = async (touchTrackLike: boolean) => {
        try {
            if (touchTrackLike) {
                const res = (await API.postTrackLike(this.props.track.id, !this.props.track.is_liked)).body;
                Dispatcher.dispatch(new ACTIONS.TRACK_LIKE(this.props.track));
            } else {
                Dispatcher.dispatch(new ACTIONS.QUEUE_LIKE_CURRENT_TRACK(null));
            }
        } catch (e) {
            console.error(e);
            return;
        }
    }

    componentWillUnmount() {
        TRACKS_STORAGE.unsubscribe(this.onAction);
    }
    
    render() {
        console.log(this.props.track.is_liked)
        return [ 
            <Like 
                className="icon" 
                active={this.props.track.is_liked} 
                onClick={() => this.onLike(true)} 
            />
        ];
    }
}


