import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import { Actions, ActionsCopyLink } from "./Actions";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { USER_STORAGE, PLAYER_STORAGE } from "utils/flux/storages";

import { debounce } from "utils/funcs";
import { API } from "utils/api";


export class ActionsAlbum extends Component {
    props: {
        album: AppTypes.Album;
        [key: string]: any;
    }

    render() {
        const { album } = this.props;
        return [
            <Actions>
                <ActionsPlay album={album} />
                <ActionsCopyLink link={URL.parse(album.album_page, location.href).toString()} />
            </Actions>
        ]
    }
}

class ActionsPlay extends Component {
    props: {
        album: AppTypes.Album;
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
