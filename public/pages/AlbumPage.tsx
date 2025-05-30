import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import { Section } from "components/elements/Section";
import { Like } from "components/elements/Like";
import { ActionsAlbum } from "components/elements/Actions/ActionsAlbum";
import { TrackLine } from "components/track/Track";
import { Preloader } from "components/preloader/Preloader";

import { API } from "utils/api";
import { one_alive_async } from "utils/funcs";

import './pages.scss';

export class AlbumPage extends Component {
    state = {
        album: null as AppTypes.Album | null,
        album_loading: true,

        tracks: [] as AppTypes.Track[],
        tracks_loading: true,

        is_liked: false
    }

    props: {
        album_id: number
    }

    componentDidMount() {
        this.setState({album_loading: true, tracks_loading: true});
        API.getAlbum(this.props.album_id)
            .then(album => {this.setState({album: album.body, is_liked: album.body.is_liked})})
            .catch(e => console.error(e.message))
            .finally(() => this.setState({album_loading: false}));
        API.getAlbumTracks(this.props.album_id)
            .then(tracks => {this.setState({tracks: tracks.body})})
            .catch(e => console.error(e.message))
            .finally(() => this.setState({tracks_loading: false}));
    }

    onLike = one_alive_async(async () => {
        try {
            const resp = await API.postAlbumLike(this.state.album.id, !this.state.is_liked);
            this.setState({is_liked: !this.state.is_liked});
        } catch (e) {
            console.error(e.message);
        }
    });

    scrollToTrack() {
        const m = location.hash.match(/#track-(\d+)$/)
        if (!m) return;
        const id = parseInt(m[1]);

        const page = (this.vnode.firstDom as HTMLElement)
        const track = (page.querySelector(`.track-line[data-track="${id}"]`) as HTMLElement);
        if (!track) return;
        track.scrollIntoView({behavior: 'smooth'});
    }

    render() {
        if (this.state.album_loading) {
            return [
                <div className="page page--404 page__empty">
                    <Preloader />,
                </div>
            ]
        }
        if (!this.state.album) {
            return [
                <div className="page page--404 page__empty">
                    <img src="/static/img/icon-albums.svg" alt="" />
                    <h1>Альбом не найден</h1>
                </div>
            ]
        }
        
        queueMicrotask(this.scrollToTrack.bind(this));
        const m = location.hash.match(/#track-(\d+)$/)
        const album = this.state.album;
        return [
            <div className="page page--album">
                <div className="page__info">
                    <img className="page__info__img" src={album.thumbnail_url} alt="error" />
                    <div>
                        <span className="page__info__type" style={{textTransform: 'capitalize'}}>{album.type} {album.release_date.getFullYear()}</span>
                        <h3 className="page__info__title">{album.title}</h3>
                        <div className="page__info__artists">
                            {album.artists.map((artist, index) => [
                                <Link key={artist.id} to={artist.artist_page}>{artist.title}</Link>,
                                index < album.artists.length - 1 ? ', ' : ''
                            ])}
                        </div>
                        <div className="page__info__actions">
                            <Like className="page__info__like" active={this.state.is_liked} onClick={this.onLike}/>
                            <ActionsAlbum album={album}/>
                        </div>
                    </div>
                </div>
                <Section title="Треки в альбоме" is_loading={this.state.tracks_loading}>
                    {this.state.tracks.map((track, index) => (
                        <TrackLine key={track.id} ind={index} track={track} ping={m && track.id === parseInt(m[1])} />
                    ))}
                </Section>
            </div>
        ]
    }
}