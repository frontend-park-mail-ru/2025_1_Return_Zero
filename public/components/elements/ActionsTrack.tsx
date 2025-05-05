import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import { Actions } from "./Actions";
import { TrackToPlaylist } from "components/dialogs/TrackToPlaylist";

import { USER_STORAGE } from "utils/flux/storages";
import { ACTIONS } from "utils/flux/actions";
import { debounce } from "utils/funcs";

import tracksQueue from "common/tracksQueue";

export class ActionsTrack extends Component {
    props: {
        track: AppTypes.Track;
        [key: string]: any;
    }

    state = {
        opened: false,
        addTrack: false
    }

    componentDidMount(): void { USER_STORAGE.subscribe(this.onAction) }
    componentWillUnmount(): void { USER_STORAGE.unsubscribe(this.onAction); }

    onAction = (action: any): void => {
        switch (true) {
            case action instanceof ACTIONS.USER_LOGIN:
            case action instanceof ACTIONS.USER_LOGOUT:
            case action instanceof ACTIONS.USER_CHANGE:
                this.setState({});
                break;
        }
    }

    onAddPlaylist = debounce(() => { this.setState({opened: false, addTrack: true}); })
    onAddQueue = debounce(() => { tracksQueue.manualAddTrack(this.props.track.id.toString()); this.setState({opened: false}); })

    render() {
        return [
            <Actions opened={this.state.opened} className="actions actions--track" onClick={() => this.setState({opened: true})} onClickOutside={() => this.setState({opened: false})}>
                {USER_STORAGE.getUser() && <span onClick={this.onAddPlaylist}>Добавить в плейлист</span>}
                <span onClick={this.onAddQueue}>Добавить в очередь</span>
                <Link to={this.props.track.artists[0]?.artist_page}>Перейти к исполнителю</Link>
                <Link to={this.props.track.album_page}>Перейти к альбому</Link>
            </Actions>,
            this.state.addTrack && <TrackToPlaylist onClose={() => this.setState({addTrack: false})} track={this.props.track}/>
        ].filter(Boolean)
    }
}
