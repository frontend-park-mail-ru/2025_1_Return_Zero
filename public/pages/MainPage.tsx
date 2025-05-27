import { Component } from "libs/rzf/Component";

import { TrackCard, TrackLine } from "components/track/Track";
import { Special } from "components/special/Special";
import { Section } from "components/elements/Section";
import { Preloader } from "components/preloader/Preloader";

import { USER_STORAGE } from "utils/flux/storages";
import { ACTIONS } from "utils/flux/actions";
import { API } from "utils/api";

import './pages.scss';

export class MainPage extends Component {
    state = {
        tracks: [] as AppTypes.Track[],
        tracks_loading: true,
        favorites: [] as AppTypes.Track[],
        favorites_loading: true
    }

    componentDidMount() {
        USER_STORAGE.subscribe(this.onAction);
        this.fetchData();
    }

    componentWillUnmount(): void {
        USER_STORAGE.unsubscribe(this.onAction);
    }

    fetchData() {
        this.setState({ tracks_loading: true, favorites_loading: true})
        if (USER_STORAGE.getUser()) {
            API.getFavoriteTracks(USER_STORAGE.getUser().username)
                .then(res => this.setState({ favorites: res.body}))
                .catch(() => this.setState({ favorites: [] }))
                .finally(() => this.setState({ favorites_loading: false }));
        } else { this.setState({ favorites_loading: false }) }
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
                {(!!this.state.favorites.length || this.state.favorites_loading) && <Section title="Любимые треки" horizontal all_link="/all/tracks/favorite">
                    {!this.state.favorites_loading ? this.state.favorites.map((track, index) => <TrackCard key={track.id} track={track}/>) : <Preloader />}
                </Section>}
                <Section title="Рекомендации" all_link="/all/tracks/top">
                    {!this.state.tracks_loading ? this.state.tracks.map((track, index) => <TrackLine key={track.id} ind={index} track={track}/>) : <Preloader />}
                </Section>
            </div>
        ]
    }
}
