import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import { Actions, ActionsCopyLink } from "./Actions";
import { TrackToPlaylist } from "components/dialogs/TrackToPlaylist";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { USER_STORAGE, PLAYER_STORAGE } from "utils/flux/storages";

import { debounce } from "utils/funcs";
import { API } from "utils/api";


export class ActionsTrack extends Component {
    props: {
        track: AppTypes.Track;
        playlist?: AppTypes.Playlist;
        removeFromPlaylist?: () => void;
        [key: string]: any;
    }

    render() {
        const { track, playlist } = this.props;
        return [
            <Actions>
                {!this.props.inPlaylist && USER_STORAGE.getUser() && 
                    <ActionsAddToPlaylist track={track} />}
                {this.props.playlist && USER_STORAGE.getUser()?.username === this.props.playlist.username && 
                    <ActionsRemoveFromPlaylist track={track} playlist={playlist} onRemove={this.props.removeFromPlaylist} />}
                <ActionsAddToQueue track={track} />
                <ActionsCopyLink link={'Затычка'} />
                <Link className="actions-item" to={this.props.track.album_page}>Перейти к альбому</Link>
                <Link className="actions-item" to={this.props.track.artists[0].artist_page}>Перейти к исполнителю</Link>
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
            <span className="actions-item" onClick={this.onClick}>Добавить в плейлист</span>,
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
            <span className="actions-item" onClick={this.onAdd}>Добавить в очередь</span>
        ].filter(Boolean)
    }
}
