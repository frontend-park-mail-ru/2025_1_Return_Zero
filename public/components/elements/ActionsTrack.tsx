import { Component } from "libs/rzf/Component";

import { TrackToPlaylist } from "components/dialogs/TrackToPlaylist";

import { USER_STORAGE } from "utils/flux/storages";
import { debounce } from "utils/funcs";

import tracksQueue from "common/tracksQueue";
import { Link } from "libs/rzf/Router";

export class ActionsAddToPlaylist extends Component {
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
            USER_STORAGE.getUser() && <span className="actions-item" onClick={this.onClick}>Добавить в плейлист</span>,
            this.state.opened && <TrackToPlaylist onClose={this.onClick} track={this.props.track}/>
        ].filter(Boolean)
    }
}

export class ActionsAddToQueue extends Component {
    props: {
        track: AppTypes.Track;
        [key: string]: any;
    }

    onAdd = debounce((e: Event) => {
        tracksQueue.manualAddTrack(this.props.track.id.toString());
    })

    render() {
        return [
            <span className="actions-item" onClick={this.onAdd}>Добавить в очередь</span>
        ].filter(Boolean)
    }
}

export class ActionsToAlbum extends Component {
    props: {
        track: AppTypes.Track;
        [key: string]: any;
    }
    
    render() {
        return [
            <Link className="actions-item" to={this.props.track.album_page}>Перейти к альбому</Link>
        ]
    }
}

export class ActionsToArtist extends Component {
    props: {
        track: AppTypes.Track;
        [key: string]: any;
    }
    
    render() {
        return [
            <Link className="actions-item" to={this.props.track.artists[0].artist_page}>Перейти к исполнителю</Link>
        ]
    }
}

export class ActionsRemoveFromPlaylist extends Component {
    props: {
        track: AppTypes.Track;
        playlist: AppTypes.Playlist;
        [key: string]: any;
    }
    
    render() {
        return [] as any;
    }
}