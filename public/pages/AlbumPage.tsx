import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import { TrackLine } from "components/track/Track";
import { Section } from "components/elements/Section";
import { Like } from "components/elements/Like";

import { API } from "utils/api";

import './pages.scss';
import { one_alive_async } from "utils/funcs";

export class AlbumPage extends Component {
    state = {
        album: null as AppTypes.Album | null,
        tracks: [] as AppTypes.Track[],
        is_liked: false
    }

    props: {
        album_id: number
    }

    componentDidMount() {
        API.getAlbum(this.props.album_id)
            .then(album => {this.setState({album: album.body, is_liked: album.body.is_liked})})
            .catch(e => console.error(e.message));
        API.getAlbumTracks(this.props.album_id)
            .then(tracks => {this.setState({tracks: tracks.body})})
            .catch(e => console.error(e.message));
    }

    onLike = one_alive_async(async () => {
        try {
            const resp = await API.postAlbumLike(this.state.album.id, !this.state.is_liked);
            this.setState({is_liked: !this.state.is_liked});
        } catch (e) {
            console.error(e.message);
        }
    });

    render() {
        if (!this.state.album) {
            return [<div className="page page--404">Альбом не найден{'('}</div>]
        }
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
                            <img src="/static/img/play.svg" alt="play"/>
                            <Like className="page__info__like" active={this.state.is_liked} onClick={this.onLike}/>
                        </div>
                    </div>
                </div>
                <Section title="Треки в альбоме">
                    {this.state.tracks.map((track, index) => (
                        <TrackLine key={track.id} ind={index} track={track}/>
                    ))}
                </Section>
            </div>
        ]
    }
}