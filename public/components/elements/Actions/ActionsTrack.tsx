import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import { Actions, ActionsCopyLink } from "./Actions";
import { TrackToPlaylist } from "components/dialogs/TrackToPlaylist";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { USER_STORAGE, PLAYER_STORAGE, JAM_STORAGE } from "utils/flux/storages";

import { debounce } from "utils/funcs";
import { API } from "utils/api";

import Router from "libs/rzf/Router";
import { Action } from "libs/flux/Action";

export class ActionsTrack extends Component {
    componentDidMount() {
        JAM_STORAGE.subscribe(this.onAction);
    }

    componentWillUnmount() {
        JAM_STORAGE.unsubscribe(this.onAction);
    }

    onAction = (action: Action) => {
        switch (true) {
            case action instanceof ACTIONS.JAM_LEAVE:
                this.setState({ isJam: false });
                break;
            case action instanceof ACTIONS.JAM_OPEN:
                this.setState({ isJam: true });
                break;
        }
    }

    props: {
        track: AppTypes.Track;
        playlist?: AppTypes.Playlist;
        removeFromPlaylist?: () => void;
        [key: string]: any;
    }

    state = {
        isJam: JAM_STORAGE.roomId ? true : false,
    }



    render() {
        const { track, playlist } = this.props;
        return [
            <Actions>
                <ActionsCopyLink link={'Затычка'} />
                {!this.props.inPlaylist && USER_STORAGE.getUser() && 
                    <ActionsAddToPlaylist track={track} />}
                {this.props.playlist && USER_STORAGE.getUser()?.username === this.props.playlist.username && 
                    <ActionsRemoveFromPlaylist track={track} playlist={playlist} onRemove={this.props.removeFromPlaylist} />}
                <ActionsAddToQueue track={track} />
                
                {this.state.isJam 
                    ? <ActionsGoToJam room_id={JAM_STORAGE.roomId} />
                    : <ActionsStartJam track={track} />
                }
                {this.state.isJam && <ActionsLeaveJam />}

                <ActionsGoToAlbum album_page={this.props.track.album_page} />
                <ActionsGoToArtist artist_page={this.props.track.artists[0].artist_page} />
            </Actions>
        ]
    }
}


class ActionsAddToPlaylist extends Component {
    props: {
        track: AppTypes.Track;
        [key: string]: any;
    }
    
    state = {
        opened: false,
    }

    onClick = (e: Event) => {
        this.setState({opened: !this.state.opened});
    }

    render() {
        return [
            <div className="actions-item" onClick={this.onClick}>
                <img src="/static/img/cloud.svg" alt="cloud" />
                <span>Добавить в плейлист</span>
            </div>,
            this.state.opened && <TrackToPlaylist onClose={this.onClick} track={this.props.track}/>
        ]
    }
}

class ActionsRemoveFromPlaylist extends Component {
    props: {
        track: AppTypes.Track;
        playlist: AppTypes.Playlist;
        onRemove?: () => void;
        [key: string]: any;
    }

    onClick = (e: Event) => {
        API.deleteTrackPlaylist(this.props.track.id, this.props.playlist.id)
            .then((res) => {
                this.props.onRemove && this.props.onRemove();
                Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
                    type: "success",
                    message: "Трек убран из плейлиста",
                }))
            }).catch((err) => { console.error(err.message) })
    }

    render() {
        return [
            <span className="actions-item" onClick={this.onClick}>Удалить из плейлиста</span>
        ]
    }
}

class ActionsAddToQueue extends Component {
    props: {
        track: AppTypes.Track;
        [key: string]: any;
    }

    onAdd = debounce((e: Event) => {
        Dispatcher.dispatch(new ACTIONS.QUEUE_ADD_MANUAL(this.props.track));
        Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
            type: "success",
            message: "Трек добавлен в очередь",
        }))
    })

    render() {
        return [
            <div className="actions-item" onClick={this.onAdd}>
                <img src="/static/img/play-circle.svg" alt="queue" />
                <span>Добавить в очередь</span>
            </div>
        ].filter(Boolean)
    }
}

class ActionsStartJam extends Component {
    props: {
        track: AppTypes.Track;
        [key: string]: any;
    }

    onClick = debounce(async (e: Event) => {
        const response = await API.createRoom(this.props.track.id.toString(), 0);
        if (response.status === 200 || response.status === 201) {
            Router.push(`/jam/${response.body.room_id}`, {});
        } else {
            console.error(response.body);
        }
    })

    render() {
        return [
            <div className="actions-item" onClick={this.onClick}>
                <img src="/static/img/headphones.svg" alt="play" />
                <span>Начать джем</span>
            </div>
        ].filter(Boolean)
    }
}

class ActionsGoToJam extends Component {
    props: {
        [key: string]: any;
    }

    onClick = debounce(async (e: Event) => {
        Router.push(`/jam/${this.props.room_id}`, {});
    })

    render() {
        return [
            <span className="actions-item" onClick={this.onClick}>Перейти в джем</span>
        ].filter(Boolean)
    }
}


class ActionsLeaveJam extends Component {
    props: {
        [key: string]: any;
    }

    onClick = debounce(async (e: Event) => {
        Dispatcher.dispatch(new ACTIONS.JAM_LEAVE(null));
    })

    render() {
        return [
            <span className="actions-item" onClick={this.onClick}>Покинуть джем</span>
        ].filter(Boolean)
    }
}

class ActionsGoToAlbum extends Component {
    props: {
        [key: string]: any;
    }
    
    onClick = debounce(async (e: Event) => {
        Router.push(this.props.album_page, {});
    })

    render() {
        return [
            <div className="actions-item" onClick={this.onClick}>
                <img src="/static/img/disc.svg" alt="album" />
                <span>Перейти к альбому</span>
            </div>
        ].filter(Boolean)
    }
}

class ActionsGoToArtist extends Component {
    props: {        
        [key: string]: any;
    }

    onClick = debounce(async (e: Event) => {
        Router.push(this.props.artist_page, {});
    })

    render() {
        return [
            <div className="actions-item" onClick={this.onClick}>
                <img src="/static/img/star.svg" alt="user" />
                <span>Перейти к исполнителю</span>
            </div>
        ].filter(Boolean)   
    }
}

