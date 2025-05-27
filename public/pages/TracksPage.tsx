import { Component } from "libs/rzf/Component";

import { TrackCard, TrackLine } from "components/track/Track";
import { Special } from "components/special/Special";
import { Section } from "components/elements/Section";

import { USER_STORAGE } from "utils/flux/storages";
import { ACTIONS } from "utils/flux/actions";
import { API } from "utils/api";

import './pages.scss';
import { PlaylistCard } from "components/playlist/PlaylistCard";
import { Preloader } from "components/preloader/Preloader";

export class TracksPage extends Component {
    state = {
        history: [] as AppTypes.Track[],
        history_loading: true,
        playlists: [] as AppTypes.Playlist[],
        playlists_loading: true,
        
        tracks: [] as AppTypes.Track[],
        tracks_loading: true
    }

    componentDidMount() {
        USER_STORAGE.subscribe(this.onAction);
        this.fetchData();
    }

    componentWillUnmount(): void {
        USER_STORAGE.unsubscribe(this.onAction);
    }

    fetchData() {
        this.setState({ history_loading: true, playlists_loading: true, tracks_loading: true });
        if (USER_STORAGE.getUser()) {
            API.getHistoryTracks().then(res => this.setState({ history: res.body }))
                .catch(() => this.setState({ history: [] }))
                .finally(() => this.setState({ history_loading: false }));
            API.getPlaylists().then(res => this.setState({ playlists: res.body }))
                .catch(() => this.setState({ playlists: [] }))
                .finally(() => this.setState({ playlists_loading: false }));
        } else {
            this.setState({ history_loading: false, playlists_loading: false });
        }
        API.getTracks().then(res => this.setState({ tracks: res.body }))
            .catch(() => this.setState({ tracks: [] }))
            .finally(() => this.setState({ tracks_loading: false }));
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
                {(!!this.state.playlists.length || this.state.playlists_loading) && <Section title="Плейлисты" horizontal all_link="/all/playlists">
                    {!this.state.playlists_loading ? this.state.playlists.map((playlist, index) => <PlaylistCard key={playlist.id} playlist={playlist} />) : <Preloader />}
                </Section>}
                {(!!this.state.history.length || this.state.history_loading) && <Section title="История прослушивания" horizontal all_link="/all/tracks/history">
                    {!this.state.history_loading ? this.state.history.map((track, index) => <TrackCard key={track.id} track={track} />) : <Preloader />}
                </Section>}
                <Section title="Рекомендации" all_link="/all/tracks/top">
                    {!this.state.tracks_loading ? this.state.tracks.map((track, index) => (
                        <TrackLine key={track.id} ind={index} track={track}/>
                    )) : <Preloader />}
                </Section>
            </div>
        ]
    }
}
