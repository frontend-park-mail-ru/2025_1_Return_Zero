import { Component } from "libs/rzf/Component";

import { ArtistCard } from "components/artist/Artist";
import { Special } from "components/special/Special";
import { Section } from "components/elements/Section";

import { USER_STORAGE } from "utils/flux/storages";
import { ACTIONS } from "utils/flux/actions";
import { API } from "utils/api";

import './pages.scss';

export class ArtistsPage extends Component {
    state = {
        artists: [] as AppTypes.Artist[],
        favorites: [] as AppTypes.Artist[],
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
            API.getFavoriteArtists(USER_STORAGE.getUser().username).then(res => {
                this.setState({ favorites: res.body });
            }).catch(() => this.setState({ favorites: [] }))
        }
        API.getArtists(20).then(res => {
            this.setState({ artists: res.body });
        }).catch(() => this.setState({ artists: [] }));
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
                {!!this.state.favorites.length && <Section title="Любимые исполнители" horizontal all_link="/all/artists/favorite">
                    {this.state.favorites.map((artist, index) => (
                        <ArtistCard key={artist.id} artist={artist}/>
                    ))}
                </Section>}
                <Section title="Рекомендации" horizontal wrap all_link="/all/artists/top">
                    {this.state.artists.map((artist, index) => (
                        <ArtistCard key={artist.id} artist={artist}/>
                    ))}
                </Section>
            </div>
        ]
    }
}
