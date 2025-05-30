import { Component } from "libs/rzf/Component";

import { Section } from "components/elements/Section";
import { TrackLine } from "components/track/Track";
import { ArtistCard } from "components/artist/Artist";
import { PlaylistCard } from "components/playlist/PlaylistCard";
import { ActionsProfile } from "components/elements/Actions/ActionsProfile";

import { API } from "utils/api";

import './pages.scss';

export class ProfilePage extends Component {
    username: '';
    state = {
        username: '',
        user: {} as AppTypes.User,
        playlists: [] as AppTypes.Playlist[],
        tracks: [] as AppTypes.Track[],
        artists: [] as AppTypes.Artist[],
        actions_opened: false
    }

    fetchData() {
        this.username = this.props.username;
        API.getUserSettings(this.username).then(user => {
            this.setState({user: user.body});
            API.getUserPlaylists(this.username).then(playlists => {
                this.setState({playlists: playlists.body})
            }).catch((reason: Error) => this.setState({playlists: []}));
            API.getFavoriteTracks(this.username).then(tracks => {
                this.setState({tracks: tracks.body});
            }).catch((reason: Error) => this.setState({tracks: []}))
            API.getFavoriteArtists(this.username).then(artists => {
                this.setState({artists: artists.body});
            }).catch((reason: Error) => this.setState({artists: []}));
        }).catch((reason: Error) => this.setState({user: {}}));
    }

    render() {
        if (this.props.username !== this.username) this.fetchData();

        const {user, playlists, tracks, artists} = this.state;
        if (!user.username) {
            return [<div className="page page--404">Пользователь не найден{'('}</div>]
        }
        return [
            <div className="page page--profile">
                <div className="page--profile__info">
                    <img className="page--profile__info__avatar" src={ user.avatar_url } alt="avatar" />
                    <div>
                        <div className="page--profile__info__header">
                            <h2 className="page--profile__info__username">{user.username}</h2>
                            <ActionsProfile user={user}/>
                        </div>
                        <div className="page--profile__info__stats">
                            <span className="item">{user.statistics.minutes_listened === -1 ? '?' : user.statistics.minutes_listened} минут прослушано</span>
                            <span className="item">{user.statistics.tracks_listened === -1 ? '?' : user.statistics.tracks_listened} треков услышано</span>
                            <span className="item">{user.statistics.artists_listened === -1 ? '?' : user.statistics.artists_listened} артистов изучено</span>
                        </div>
                    </div>
                </div>
                { playlists.length > 0 && <Section title="Плейлисты" horizontal all_link={`/all/profile/${this.username}/playlists`}>
                    {playlists.map((playlist, index) => (
                        <PlaylistCard key={playlist.id} ind={index} playlist={playlist} />
                    ))}
                </Section>}
                { tracks.length > 0 && <Section title="Любимые треки" all_link={`/all/profile/${this.username}/tracks`}>
                    {tracks.map((track, index) => (
                        <TrackLine key={track.id} ind={index} track={track}/>
                    ))}
                </Section>}
                { artists.length > 0 && <Section title="Любимые исполнители" horizontal all_link={`/all/profile/${this.username}/artists`}>
                    {artists.map((artist, index) => (
                        <ArtistCard key={artist.id} artist={artist}/>
                    ))}
                </Section>}
                { !playlists.length && !tracks.length && !artists.length &&
                    <div className="page__empty">
                        <img src="/static/img/45-Smile.svg" alt="" />
                        <h1>Пользователь не проявлял активности</h1>
                    </div>
                }
            </div>
        ]
    }
}
