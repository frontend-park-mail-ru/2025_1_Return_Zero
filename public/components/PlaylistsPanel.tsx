import { Component } from "libs/rzf/Component";
import router, { Link } from "libs/rzf/Router";

import { Button } from "./elements/Button";
import { NearPopup } from "./elements/NearPopup";
import { PlaylistCreate } from "./forms/PlaylistCreate";

import { ACTIONS } from "utils/flux/actions";
import { USER_STORAGE, CONTENT_STORAGE } from "utils/flux/storages";

import "./PlaylistsPanel.scss";

export class PlaylistsPanel extends Component {
    state = {
        playlists: [] as AppTypes.Playlist[],
        createDialog: false,
    }

    componentDidMount(): void {
        CONTENT_STORAGE.subscribe(this.onAction);
    }
    
    componentWillUnmount(): void {
        CONTENT_STORAGE.unsubscribe(this.onAction);
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
                    <Button className="playlists-panel__create" onClick={() => this.setState({ createDialog: true })}>
                        <img src="/static/img/plus.svg" alt="error"/>
                    </Button> :
                    <Button className="playlists-panel__create" onClick={() => router.push('#login', {})}>
                        <img src="/static/img/plus.svg" alt="error"/>
                    </Button>
                }
                <section className="playlists-panel__playlists">
                    {this.state.playlists.map((playlist, index) => (
                        <PlaylistItem key={playlist.id} playlist={playlist}/>
                    ))} 
                </section>
                {this.state.createDialog && <PlaylistCreate 
                    onClose={() => this.setState({ createDialog: false }) } 
                    onCreate={() => this.setState({ createDialog: false }) }
                />}
            </div>
        ]
    }
}

class PlaylistItem extends Component {
    props: {
        playlist: AppTypes.Playlist,
        [key: string]: any
    }

    componentDidMount(): void {
        queueMicrotask(() => {
            this.positionTitle();
            this.vnode.firstDom.parentElement.addEventListener('scroll', this.positionTitle);
        });
    }

    componentWillUnmount(): void {
        this.vnode.firstDom.parentElement.removeEventListener('scroll', this.positionTitle);
    }

    positionTitle = () => {
        const rect = (this.vnode.firstDom as HTMLElement).getBoundingClientRect();
        const title = ((this.vnode.firstDom as HTMLElement).querySelector('.item__title') as HTMLElement);
        title.style.left = `${rect.right + rect.width * 0.15}px`;
        title.style.top = `${rect.top + rect.height / 2}px`;
    }

    render() {
        const playlist = this.props.playlist;

        return [
            <Link to={playlist.playlist_page} className="item">
                <img src={playlist.thumbnail_url} alt="error"/>
                <span className="item__title">{playlist.title}</span>
            </Link>
        ]
    }
}




