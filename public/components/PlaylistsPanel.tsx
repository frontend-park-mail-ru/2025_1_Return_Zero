import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import { ACTIONS } from "utils/flux/actions";
import { USER_STORAGE } from "utils/flux/storages";

import { API } from "utils/api";

import "./PlaylistsPanel.scss";

export class PlaylistsPanel extends Component {
    state = {
        playlists: [] as AppTypes.Playlist[]
    }

    componentDidMount(): void {
        USER_STORAGE.subscribe(this.onAction);
        USER_STORAGE.getUser() && API.getUserPlaylists(USER_STORAGE.getUser().username)
            .then((playlists) => this.setState({playlists: playlists.body}))
            .catch((reason) => console.error(reason.message));
    }
    
    componentWillUnmount(): void {
        USER_STORAGE.unSubscribe(this.onAction);
    }

    onAction = (action: any) => {
        switch (true) {
            case action instanceof ACTIONS.USER_LOGIN:
            case action instanceof ACTIONS.USER_CHANGE:
                API.getUserPlaylists(USER_STORAGE.getUser().username)
                    .then((playlists) => this.setState({playlists: playlists.body}))
                    .catch((reason) => console.error(reason.message));
                break;
            case action instanceof ACTIONS.USER_LOGOUT:
                this.setState({ playlists: [] })
        }
    }

    render() {
        return [
            <div className="playlists-panel">
                <Link to="" className="playlists-panel__create">
                    <img src="/static/img/plus.svg" alt="error"/>
                </Link>
                {this.state.playlists.map((playlist, index) => (
                    <Link key={playlist.id} to={playlist.playlist_page}>
                        <img className="playlists-panel__item" src={playlist.thumbnail_url} alt="error"/>
                    </Link>
                ))} 
            </div>
        ];
    }
}