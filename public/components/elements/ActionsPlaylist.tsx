import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import { Actions, ActionsCopyLink } from "./Actions";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { USER_STORAGE, PLAYER_STORAGE } from "utils/flux/storages";

import { debounce } from "utils/funcs";
import { API } from "utils/api";


export class ActionsPlaylist extends Component {
    props: {
        playlist: AppTypes.Playlist;
        [key: string]: any;
    }

    render() {
        const { playlist } = this.props;
        return [
            <Actions>
                <ActionsPlay playlist={playlist} />
                <ActionsCopyLink link={'Затычка'} />
            </Actions>
        ]
    }
}

class ActionsPlay extends Component {
    props: {
        playlist: AppTypes.Playlist;
        [key: string]: any;
    }

    
    play = () => {

    }

    render() {
        return [
            <span className="actions-item" onClick={this.play}>Слушать</span>
        ]
    }
}
