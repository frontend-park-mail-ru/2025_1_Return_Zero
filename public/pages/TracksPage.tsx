import { Component } from "libs/rzf/Component";

import { TrackCard, TrackLine } from "components/track/Track";
import { Special } from "components/special/Special";
import { Section } from "components/elements/Section";

import { USER_STORAGE } from "utils/flux/storages";
import { ACTIONS } from "utils/flux/actions";
import { API } from "utils/api";

import './pages.scss';
import { PlaylistCard } from "components/playlist/PlaylistCard";

export class TracksPage extends Component {
    state = {
        history: [] as AppTypes.Track[],
        playlists: [] as AppTypes.Playlist[],
        
        tracks: [] as AppTypes.Track[],
    }

    componentDidMount() {
        USER_STORAGE.subscribe(this.onAction);
        this.fetchData();
    }

    componentWillUnmount(): void {
        USER_STORAGE.unsubscribe(this.onAction);
    }

    fetchData() {
        if (USER_STORAGE.getUser()) {
            API.getHistoryTracks().then(res => {
                this.setState({ history: res.body });
            }).catch(() => this.setState({ history: [] }));
            API.getPlaylists().then(res => {
                this.setState({ playlists: res.body });
            }).catch(() => this.setState({ playlists: [] }));
        }
        API.getTracks().then(res => {
            this.setState({ tracks: res.body });
        }).catch(() => this.setState({ tracks: [] }));
    }

    onAction = (action: any) => {
        switch (true) {
            case action instanceof ACTIONS.USER_LOGIN:
            case action instanceof ACTIONS.USER_CHANGE:
            case action instanceof ACTIONS.USER_LOGOUT:
                this.fetchData();
                break;
        }
    }

    render() {
        return [
            <div className="page">
                <Section title="Только для тебя" horizontal>
                    <Special />
                </Section>
                {!!this.state.playlists.length && <Section title="Плейлисты" horizontal all_link="/all/playlists">
                    {this.state.playlists.map((playlist, index) => <PlaylistCard key={playlist.id} playlist={playlist} />)}
                </Section>}
                {!!this.state.history.length && <Section title="История прослушивания" horizontal all_link="/all/tracks/history">
                    {this.state.history.map((track, index) => <TrackCard key={track.id} track={track} />)}
                </Section>}
                <Section title="Рекомендации" all_link="/all/tracks/top">
                    {this.state.tracks.map((track, index) => (
                        <TrackLine key={track.id} ind={index} track={track}/>
                    ))}
                </Section>
            </div>
        ]
    }
}
