import { Component } from "libs/rzf/Component";

import { TrackCard, TrackLine } from "components/Track";
import { Special } from "components/special/Special";
import { Section } from "components/Section";

import { USER_STORAGE } from "utils/flux/storages";
import { ACTIONS } from "utils/flux/actions";
import { API } from "utils/api";

import './pages.scss';

export class TracksPage extends Component {
    state = {
        tracks: [] as AppTypes.Track[],
        favorites: [] as AppTypes.Track[],
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
            API.getFavoriteTracks(USER_STORAGE.getUser().username).then(res => {
                this.setState({ favorites: res.body });
            }).catch(() => this.setState({ favorites: [] }))
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
                {this.state.favorites.length ? <Section title="Любимые треки" horizontal>
                    {this.state.favorites.map((track, index) => (
                        <TrackCard key={track.id} track={track}/>
                    ))}
                </Section> : undefined}
                <Section title="Рекомендации">
                    {this.state.tracks.map((track, index) => (
                        <TrackLine key={track.id} ind={index} track={track}/>
                    ))}
                </Section>
            </div>
        ]
    }
}
