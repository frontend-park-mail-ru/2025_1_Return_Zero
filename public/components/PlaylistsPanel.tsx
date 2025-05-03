import { Component } from "libs/rzf/Component";
import router, { Link } from "libs/rzf/Router";

import { Button } from "./elements/Button";
import { PlaylistCreate } from "./forms/PlaylistCreate";

import { ACTIONS } from "utils/flux/actions";
import { USER_STORAGE, CONTENT_STORAGE } from "utils/flux/storages";

import "./PlaylistsPanel.scss";

export class PlaylistsPanel extends Component {
    state = {
        playlists: [] as AppTypes.Playlist[],
        createPopup: false
    }

    componentDidMount(): void {
        CONTENT_STORAGE.subscribe(this.onAction);
    }
    
    componentWillUnmount(): void {
        CONTENT_STORAGE.unSubscribe(this.onAction);
    }

    onAction = (action: any) => {
        switch (true) {
            case action instanceof ACTIONS.CONTENT_PLAYLISTS_CHANGED:
                this.setState({playlists: CONTENT_STORAGE.playlists});
                break;
        }
    }

    render() {
        return [
            <div className="playlists-panel">
                {USER_STORAGE.getUser() ? 
                    <Button className="playlists-panel__create" onClick={() => this.setState({ createPopup: true })}>
                        <img src="/static/img/plus.svg" alt="error"/>
                    </Button> :
                    <Button className="playlists-panel__create" onClick={() => router.push('#login', {})}>
                        <img src="/static/img/plus.svg" alt="error"/>
                    </Button>
                }
                {this.state.playlists.map((playlist, index) => (
                    <Link key={playlist.id} to={playlist.playlist_page} className="playlists-panel__item">
                        <img src={playlist.thumbnail_url} alt="error"/>
                    </Link>
                ))} 
                {this.state.createPopup && <PlaylistCreate 
                    onClose={() => this.setState({ createPopup: false }) } 
                    onCreate={() => this.setState({ createPopup: false }) }
                />}
            </div>
        ]
    }
}
