import { Component } from "libs/rzf/Component";

import { Section } from "components/Section";
import { TrackLine } from "components/Track";
import { ArtistCard } from "components/Artist";

import { API } from "utils/api";

import './pages.scss';

export class ProfilePage extends Component {
    state = {
        // playlists: [] as AppTypes.Playlist[],
        user: {} as AppTypes.User,
        tracks: [] as AppTypes.Track[],
        artists: [] as AppTypes.Artist[],
        actions_opened: false
    }

    componentDidMount(): void {
        API.getUserSettings(this.props.username).then(user => {
            this.setState({user: user.body});
        }).catch((reason: Error) => console.error(reason.message));
        API.getFavoriteTracks(this.props.username).then(tracks => {
            this.setState({tracks: tracks.body});
        }).catch((reason: Error) => console.error(reason.message))
        API.getFavoriteArtists(this.props.username).then(artists => {
            this.setState({artists: artists.body});
        }).catch((reason: Error) => console.error(reason.message));
    }

    render() {
        const {user, tracks, artists} = this.state;
        if (!user.username) {
            return [<div className="page page--404">Пользователь не найден{'('}</div>]
        }
        return [
            <div className="page page--profile">
                <div className="page--profile__info">
                    <img className="page--profile__info__avatar" src={user.avatar_url} alt="avatar" />
                    <div>
                        <div className="page--profile__info__header">
                            <h2 className="page--profile__info__username">{user.username}</h2>
                            <img src="/static/img/dots.svg" className="page--profile__info__action" alt="edit" onClick={() => this.setState({actions_opened: !this.state.actions_opened})} />
                            {/* {this.state.actions_opened && <div className="profile__info__action-items">
                                <span className="item" onClick={() => navigator.clipboard.writeText(window.location.origin + '/profile/' + user.username)}>Скопировать ссылку</span>
                            </div>} */}
                        </div>
                        <div className="page--profile__info__stats">
                            <span className="item">{user.statistics.minutes_listened === -1 ? '?' : user.statistics.minutes_listened} минут прослушано</span>
                            <span className="item">{user.statistics.tracks_listened === -1 ? '?' : user.statistics.tracks_listened} треков услышано</span>
                            <span className="item">{user.statistics.artists_listened === -1 ? '?' : user.statistics.artists_listened} артистов изучено</span>
                        </div>
                    </div>
                </div>
                <Section title="Плейлисты" horizontal>
                    
                </Section>
                <Section title="Любимые треки">
                    {tracks.map((track, index) => (
                        <TrackLine key={track.id} ind={index} track={track}/>
                    ))}
                </Section>
                <Section title="Любимые исполнители" horizontal>
                    {artists.map((artist, index) => (
                        <ArtistCard key={artist.id} artist={artist}/>
                    ))}
                </Section>
            </div>
        ]
    }
}