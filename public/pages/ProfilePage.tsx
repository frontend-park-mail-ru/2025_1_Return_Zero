import { Component } from "libs/rzf/Component";

import { Section } from "components/elements/Section";
import { ActionsProfile } from "components/elements/Actions/ActionsProfile";
import { TrackLine } from "components/track/Track";
import { ArtistCard } from "components/artist/Artist";
import { PlaylistCard } from "components/playlist/PlaylistCard";
import { Preloader } from "components/preloader/Preloader";

import { API } from "utils/api";

import './pages.scss';

export class ProfilePage extends Component {
    username: '';
    state = {
        username: '',
        user: {} as AppTypes.User,
        user_loading: true,
        playlists: [] as AppTypes.Playlist[],
        playlists_loading: true,
        tracks: [] as AppTypes.Track[],
        tracks_loading: true,
        artists: [] as AppTypes.Artist[],
        artists_loading: true
    }

    fetchData() {
        this.username = this.props.username;
        this.setState({user_loading: true, playlists_loading: true, artists_loading: true, tracks_loading: true});
        API.getUserSettings(this.username).then(user => this.setState({user: user.body}))
            .catch((reason: Error) => this.setState({user: {}}))
            .finally(() => this.setState({user_loading: false}));
        API.getUserPlaylists(this.username).then(playlists => this.setState({playlists: playlists.body}))
            .catch((reason: Error) => this.setState({playlists: []}))
            .finally(() => this.setState({ playlists_loading: false}));
        API.getFavoriteTracks(this.username).then(tracks => this.setState({tracks: tracks.body}))
            .catch((reason: Error) => this.setState({tracks: []}))
            .finally(() => this.setState({ tracks_loading: false}));
        API.getFavoriteArtists(this.username).then(artists => this.setState({artists: artists.body}))
            .catch((reason: Error) => this.setState({artists: []}))
            .finally(() => this.setState({ artists_loading: false}));
    }

    render() {
        if (this.props.username !== this.username) this.fetchData();

        const {user, playlists, tracks, artists} = this.state;
        if (this.state.user_loading) {
            return [
                <div className="page page--404 page__empty">
                    <Preloader />
                </div>
            ]
        }
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
                {!playlists.length && !tracks.length && !artists.length && 
                 !this.state.playlists_loading && !this.state.tracks_loading && !this.state.artists_loading &&
                    <div className="page page__empty">
                        <img src="/static/img/45-Smile.svg" alt="" />
                        <h1>Пользователь не проявлял активности</h1>
                    </div>
                }
                {<Section title="Плейлисты" horizontal all_link={`/all/profile/${this.username}/playlists`} is_loading={this.state.playlists_loading}>
                    {playlists.map((playlist, index) => (
                        <PlaylistCard key={playlist.id} ind={index} playlist={playlist} />
                    ))}
                </Section>}
                {<Section title="Любимые треки" all_link={`/all/profile/${this.username}/tracks`} is_loading={this.state.tracks_loading}>
                    {tracks.map((track, index) => (
                        <TrackLine key={track.id} ind={index} track={track}/>
                    ))}
                </Section>}
                {<Section title="Любимые исполнители" horizontal all_link={`/all/profile/${this.username}/artists`} is_loading={this.state.artists_loading}>
                    {artists.map((artist, index) => (
                        <ArtistCard key={artist.id} artist={artist}/>
                    ))}
                </Section>}
            </div>
        ]
    }
}
