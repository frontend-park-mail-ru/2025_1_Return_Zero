import { Component } from "libs/rzf/Component"
import { Link, Route } from "libs/rzf/Router"

import { Button } from "components/elements/Button"
import { Section } from "components/elements/Section"

import { TrackCard, TrackLine } from "components/track/Track"
import { AlbumCard, AlbumLine } from "components/album/Album"
import { ArtistCard } from "components/artist/Artist"
import { PlaylistCard } from "components/playlist/PlaylistCard"

import { API } from "utils/api"
import { debounce, one_alive_async } from "utils/funcs"

import './pages.scss'

export class SearchPage extends Component {
    query = ''
    state = {
        tracks: [] as AppTypes.Track[],
        artists: [] as AppTypes.Artist[],
        albums: [] as AppTypes.Album[],
        playlists: [] as AppTypes.Playlist[],
    }

    fetchData = debounce(() => {
        this.query = location.search;
        const searchParams = Object.fromEntries(new URLSearchParams(location.search)) as {
            query: string
        };

        if (!searchParams.query) {
            console.warn('Empty query');
            return;
        }

        API.searchTracks(searchParams.query).then(tracks => this.setState({ tracks: tracks.body }))
            .catch(err => this.setState({ tracks: [] }));
        API.searchArtists(searchParams.query).then(artists => this.setState({ artists: artists.body }))
            .catch(err => this.setState({ artists: [] }));
        API.searchAlbums(searchParams.query).then(albums => this.setState({ albums: albums.body }))
            .catch(err => this.setState({ albums: [] }));
        API.searchPlaylists(searchParams.query).then(playlists => this.setState({ playlists: playlists.body }))
            .catch(err => this.setState({ playlists: [] }));
    }, 500)

    render() {
        if (this.query !== location.search) { this.fetchData(); }
        return [
            <div className="page page--search">
                <Section title="" horizontal>
                    {[{
                        text: 'Все',
                        to: '/search/all',
                    }, {
                        text: 'Треки',
                        to: '/search/tracks/',
                    }, {
                        text: 'Артисты',
                        to: '/search/artists',
                    }, {
                        text: 'Альбомы',
                        to: '/search/albums',
                    }, {
                        text: 'Плейлисты',
                        to: '/search/playlists',
                    }].map(({text, to}: any) => 
                        <Route path={`^${to}/`} exact component={SearchLink} to={to} text={text} elseComponent={SearchLink} />
                    )}
                </Section>
                <Route path="^/search/all/" exact component={SearchAll} {...this.state} />
                <Route path="^/search/tracks/" exact component={SearchTracks} {...this.state} />
                <Route path="^/search/artists/" exact component={SearchArtists} {...this.state} />
                <Route path="^/search/albums/" exact component={SearchAlbums} {...this.state} />
                <Route path="^/search/playlists/" exact component={SearchPlaylists} {...this.state} />
            </div>
        ]
    }
}

class SearchLink extends Component {
    props: {
        to: string,
        text: string
    }

    render() {
        const active = this.props.to === location.pathname;
        return [
            <Link to={this.props.to + location.search}>
                <Button active={active}>{this.props.text}</Button>
            </Link>
        ]
    }
}

class SearchAll extends Component {
    props: {
        tracks: AppTypes.Track[],
        artists: AppTypes.Artist[],
        albums: AppTypes.Album[],
        playlists: AppTypes.Playlist[],
    }

    render() {
        const { tracks, artists, albums, playlists } = this.props
        if (!tracks.length && !artists.length && !albums.length && !playlists.length) {
            return [
                <div className="page__empty">
                    <img src="/static/img/icon-search.svg" />
                    <h2>НИЧЕГО НЕ НАШЛИ</h2>
                    <span>попробуйте написать по-другому</span>
                </div>
            ]
        }
        return [
            tracks.length > 0 && <Section title='Треки' horizontal>
                {tracks.map(track => <TrackCard key={track.id} track={track} />)}
            </Section>,
            artists.length > 0 && <Section title='Артисты' horizontal>
                {artists.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
            </Section>,
            albums.length > 0 && <Section title='Альбомы' horizontal>
                {albums.map(album => <AlbumCard key={album.id} album={album} />)}
            </Section>,
            playlists.length > 0 && <Section title='Плейлисты' horizontal>
                {playlists.map(playlist => <PlaylistCard key={playlist.id} playlist={playlist} />)}
            </Section>
        ].filter(Boolean)
    }
}

class SearchTracks extends Component {
    props: {
        tracks: AppTypes.Track[],
    }

    render() {
        return [
            this.props.tracks.length > 0 ? <Section title='Треки'>
                {this.props.tracks.map(track => <TrackLine key={track.id} track={track} />)}
            </Section> : 
                <div className="page__empty">
                    <img src="/static/img/icon-search.svg" />
                    <h2>НИЧЕГО НЕ НАШЛИ</h2>
                    <span>попробуйте написать по-другому</span>
                </div>
        ]
    }
}

class SearchArtists extends Component {
    props: {
        artists: AppTypes.Artist[],
    }

    render() {
        return [
            this.props.artists.length > 0 ? <Section title='Артисты' horizontal wrap>
                {this.props.artists.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
            </Section> : 
                <div className="page__empty">
                    <img src="/static/img/icon-search.svg" />
                    <h2>НИЧЕГО НЕ НАШЛИ</h2>
                    <span>попробуйте написать по-другому</span>
                </div>
        ]
    }
}

class SearchAlbums extends Component {
    props: {
        albums: AppTypes.Album[],
    }

    render() {
        return [
            this.props.albums.length > 0 ? <Section title='Альбомы'>
                {this.props.albums.map(album => <AlbumLine key={album.id} album={album} />)}
            </Section> : 
                <div className="page__empty">
                    <img src="/static/img/icon-search.svg" />
                    <h2>НИЧЕГО НЕ НАШЛИ</h2>
                    <span>попробуйте написать по-другому</span>
                </div>
        ]
    }
}

class SearchPlaylists extends Component {
    props: {
        playlists: AppTypes.Playlist[],
    }

    render() {
        return [
            this.props.playlists.length > 0 ? <Section title='Плейлисты' horizontal style={{ flexWrap: 'wrap' }}>
                {this.props.playlists.map(playlist => <PlaylistCard key={playlist.id} playlist={playlist} />)}
            </Section> : 
                <div className="page__empty">
                    <img src="/static/img/icon-search.svg" />
                    <h2>НИЧЕГО НЕ НАШЛИ</h2>
                    <span>попробуйте написать по-другому</span>
                </div>
        ]
    }
}
