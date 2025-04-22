import h from "libs/rzf/jsx";
import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import "./PlaylistsPanel.scss";

export class PlaylistsPanel extends Component {
    state: {
        playlists: any[]
    }

    constructor(props: any={}, children: any[]=[]) {
        super(props, children);
        this.state = {
            playlists: []
        }
    }

    render() {
        return (
            <div classes={["playlists-panel"]}>
                <Link to="">
                    <img classes={["playlists-panel__item"]} src="/static/img/plus.svg" alt="error"/>
                </Link>
                {...this.state.playlists.map((playlist, index) => (
                    <Link to={playlist.playlist_page}>{playlist.title}
                        <img classes={["playlists-panel__item"]} src={playlist.thumbnail_url} alt="error"/>
                    </Link>
                ))}
            </div>
        );
    }
}