import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import { Dialog, Button, ButtonDanger, ButtonSuccess } from "components/elements/index";
import { TrackCard } from "components/Track";
import { PlaylistCreate } from "components/forms/PlaylistCreate";

import { debounce } from "utils/funcs";
import { API } from "utils/api";

import "./TrackToPlaylist.scss";

export class TrackToPlaylist extends Component {
    props: {
        track: AppTypes.Track;
        onClose: () => void
    }
    state = {
        playlists: [] as AppTypes.TrackPlaylist[],
        create: false
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        API.getTrackPlaylists(this.props.track.id).then(playlists => {
            this.setState({ playlists: playlists.body, create: false });
        }).catch(() => this.setState({ playlists: [] }));
    }

    onCreated = (playlist: AppTypes.Playlist) => {
        this.setState({ playlists: [playlist, ...this.state.playlists], create: false });
    }

    render() {
        console.log(this.state)
        if (this.state.create) return [ <PlaylistCreate onCreate={ this.onCreated } onClose={() => this.setState({ create: false })} /> ]
        return [
            <Dialog onClose={this.props.onClose}>
                <div className="track-to-playlist">
                    <TrackCard track={this.props.track} />
                    <div className="track-to-playlist__options">
                        <Button className="track-to-playlist__create" onClick={() => this.setState({ create: true })}>Создать плейлист</Button>
                        {this.state.playlists.map(playlist => 
                            <PlaylistLine track={this.props.track} playlist={playlist} />
                        )}
                    </div>
                </div>
            </Dialog>
        ]
    }
}

class PlaylistLine extends Component {
    props: {
        track: AppTypes.Track;
        playlist: AppTypes.TrackPlaylist;
    }
    state = {
        is_included: this.props.playlist.is_included
    }

    onAdd = debounce(
        () => API.addTrackPlaylist(this.props.track.id, this.props.playlist.id)
            .then(() => this.setState({ is_included: true }))
            .catch((reason) => console.error(reason.message))
    )

    onRemove = debounce(
        () => API.deleteTrackPlaylist(this.props.track.id, this.props.playlist.id)
            .then(() => this.setState({ is_included: false }))
            .catch((reason) => console.error(reason.message))
    )

    render() {
        const playlist = this.props.playlist;
        return [
            <div className="track-to-playlist__line">
                <img className="track-to-playlist__line__img" src={playlist.thumbnail_url} />
                <Link to={this.props.playlist.playlist_page} className="track-to-playlist__line__title">{playlist.title}</Link>
                {this.state.is_included ? 
                    <ButtonDanger className="track-to-playlist__line__button" onClick={this.onRemove}>Удалить</ButtonDanger> :
                    <ButtonSuccess className="track-to-playlist__line__button" onClick={this.onAdd}>Добавить</ButtonSuccess>
                }
            </div>
        ]
    }
}
