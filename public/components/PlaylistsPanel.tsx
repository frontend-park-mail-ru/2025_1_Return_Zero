import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import { Button } from "./elements/Button";
import { PlaylistCreate } from "./forms/PlaylistCreate";

import { ACTIONS } from "utils/flux/actions";
import { USER_STORAGE } from "utils/flux/storages";
import { API } from "utils/api";

import "./PlaylistsPanel.scss";

export class PlaylistsPanel extends Component {
    state = {
        playlists: [] as AppTypes.Playlist[],
        createPopup: false
    }

    componentDidMount(): void {
        USER_STORAGE.subscribe(this.onAction);
        USER_STORAGE.getUser() && this.fetchData();
    }

    fetchData() {
        API.getPlaylists()
            .then((playlists) => this.setState({playlists: playlists.body}))
            .catch((reason) => { this.setState({}); console.error(reason.message)});
    }
    
    componentWillUnmount(): void {
        USER_STORAGE.unSubscribe(this.onAction);
    }

    onAction = (action: any) => {
        console.log(action)
        switch (true) {
            case action instanceof ACTIONS.USER_LOGIN:
            case action instanceof ACTIONS.USER_CHANGE:
                this.fetchData();
                break;
            case action instanceof ACTIONS.USER_LOGOUT:
                this.setState({ playlists: [] });
                break;
        }
    }

    render() {
        return [
            <div className="playlists-panel">
                {USER_STORAGE.getUser() && <Button className="playlists-panel__create" onClick={() => this.setState({ createPopup: true })}>
                    <img src="/static/img/plus.svg" alt="error"/>
                </Button>}
                {this.state.playlists.map((playlist, index) => (
                    <Link key={playlist.id} to={playlist.playlist_page} className="playlists-panel__item">
                        <img src={playlist.thumbnail_url} alt="error"/>
                    </Link>
                ))} 
                {this.state.createPopup && <PlaylistCreate 
                    onClose={() => { this.setState({ createPopup: false }) }} 
                    onCreate={() => { this.setState({ createPopup: false }); this.fetchData(); }}
                />}
            </div>
        ]
    }
}
