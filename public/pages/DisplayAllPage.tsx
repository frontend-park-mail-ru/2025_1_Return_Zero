import { Component } from "libs/rzf/Component";
import { Route } from "libs/rzf/Router";

import { Section } from "components/elements/Section";
import { TrackCard, TrackLine } from "components/track/Track";
import { AlbumLine } from "components/album/Album";
import { ArtistCard } from "components/artist/Artist";
import { PlaylistCard } from "components/playlist/PlaylistCard";

import { USER_STORAGE } from "utils/flux/storages";
import { API } from "utils/api";

import './pages.scss';

export const ALL_LIMIT = 500;

export class DisplayAllPage extends Component {
    componentDidMount(): void {
        USER_STORAGE.subscribe(this.onAction)
    }

    componentWillUnmount(): void {
        USER_STORAGE.unsubscribe(this.onAction)
    }

    onAction = (action: any) => {
        this.setState({});
    }

    render() {
        return [
            <div className="page">
                <Route path="^/all/tracks/top/" exact component={AllPage<AppTypes.Track>}
                    title="Топ треки" retriever={() => API.getTracks(ALL_LIMIT).then(resp => resp.body)}
                    displayer={(track: AppTypes.Track) => <TrackLine track={track} />} />
                <Route path="^/all/tracks/favorite/" exact component={AllPage<AppTypes.Track>} 
                    title="Любимые треки" retriever={() => API.getFavoriteTracks(USER_STORAGE.getUser()?.username, ALL_LIMIT).then(resp => resp.body)}
                    displayer={(track: AppTypes.Track) => <TrackLine track={track} />} />
                <Route path="^/all/tracks/history/" exact component={AllPage<AppTypes.Track>}
                    title="История прослушивания" retriever={() => API.getHistoryTracks(ALL_LIMIT).then(resp => resp.body)}
                    displayer={(track: AppTypes.Track) => <TrackLine track={track} />} />
                
                <Route path="^/all/albums/favorite/" exact component={AllPage<AppTypes.Artist>}
                    title="Любимые альбомы" retriever={() => API.getFavoriteAlbums(USER_STORAGE.getUser()?.username, ALL_LIMIT).then(resp => resp.body)} 
                    displayer={(album: AppTypes.Album) => <AlbumLine album={album} />} />
                <Route path="^/all/albums/top/" exact component={AllPage<AppTypes.Album>}
                    title="Топ альбомы" retriever={() => API.getAlbums(ALL_LIMIT).then(resp => resp.body)}
                    displayer={(album: AppTypes.Album) => <AlbumLine album={album} />} />

                <Route path="^/all/artists/favorite/" exact component={AllPage<AppTypes.Artist>} horizontal wrap
                    title="Любимые артисты" retriever={() => API.getFavoriteArtists(USER_STORAGE.getUser()?.username, ALL_LIMIT).then(resp => resp.body)}
                    displayer={(artist: AppTypes.Artist) => <ArtistCard artist={artist} />} />
                <Route path="^/all/artists/top/" exact component={AllPage<AppTypes.Artist>} horizontal wrap
                    title="Топ артисты" retriever={() => API.getArtists(ALL_LIMIT).then(resp => resp.body)}
                    displayer={(artist: AppTypes.Artist) => <ArtistCard artist={artist} />} />
                <Route path="^/all/playlists/" exact component={AllPage<AppTypes.Playlist>} horizontal wrap
                    title="Мои плейлисты" retriever={() => API.getUserPlaylists(USER_STORAGE.getUser()?.username, ALL_LIMIT).then(resp => resp.body)}
                    displayer={(playlist: AppTypes.Playlist) => <PlaylistCard playlist={playlist} />} />

                <Route path="^/all/artists/:artist_id<int>/tracks" component={AllPage}
                    title="Треки артиста" retriever={(args: any) => API.getArtistTracks(args.artist_id, ALL_LIMIT).then(resp => resp.body)}
                    displayer={(track: AppTypes.Track) => <TrackLine track={track} />} />
                <Route path="^/all/artists/:artist_id<int>/albums/" component={AllPage}
                    title="Альбомы артиста" retriever={(args: any) => API.getArtistAlbums(args.artist_id, ALL_LIMIT).then(resp => resp.body)}
                    displayer={(album: AppTypes.Album) => <AlbumLine album={album} />} />

                <Route path="^/all/profile/:username/tracks/" component={AllPage}
                    title="Любимые треки пользователя" retriever={(args: any) => API.getFavoriteTracks(args.username, ALL_LIMIT).then(resp => resp.body)}
                    displayer={(track: AppTypes.Track) => <TrackLine track={track} />} />
                <Route path="^/all/profile/:username/artists/" component={AllPage} horizontal wrap
                    title="Любимые артисты пользователя" retriever={(args: any) => API.getFavoriteArtists(args.username, ALL_LIMIT).then(resp => resp.body)}
                    displayer={(artist: AppTypes.Artist) => <ArtistCard artist={artist} />} />
                <Route path="^/all/profile/:username/playlists/" component={AllPage} horizontal wrap
                    title="Плейлисты пользователя" retriever={(args: any) => API.getUserPlaylists(args.username, ALL_LIMIT).then(resp => resp.body)}
                    displayer={(playlist: AppTypes.Playlist) => <PlaylistCard playlist={playlist} />} />
            </div>
        ]
    }
}

class AllPage<T> extends Component {
    props: {
        title: string,
        retriever: (args: any) => Promise<T[]>,
        displayer: (data: T) => JSX.Element,
        [key: string]: any
    }

    state: {
        data: T[]
    } = {
        data: []
    }

    componentDidMount(): void {
        this.refresh();
    }

    refresh() {
        const { retriever, displayer, ...other } = this.props;
        this.props.retriever(other).then(data => this.setState({data})).catch(err => this.setState({data: []}));
    }

    render() {
        const { retriever, displayer, ...other } = this.props;
        if (this.state.data.length === 0) {
            return [
                <div className="page page--404 page__empty">
                    <h2>Ничего не найдено</h2>
                    <span>Может ссылка указана не верно?</span>
                </div>
            ]
        }
        return [
            <Section {...other}>
                {this.state.data.map(this.props.displayer)}
            </Section>
        ]
    }
}
