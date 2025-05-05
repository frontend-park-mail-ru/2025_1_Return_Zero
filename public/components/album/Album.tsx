import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import "./Album.scss";

export class AlbumLine extends Component {
    render() {
        const ind: number = this.props.ind;
        const album: AppTypes.Album = this.props.album;
        return [
            <div className="album-line">
                <div className="album-line__info">
                    {ind !== undefined && <span className="album-line__info__index">{ind + 1}</span>}
                    <Link to={album.album_page}>
                        <img className="album-line__info__img" src={album.thumbnail_url} alt="error"/>
                    </Link>
                    <div className="album-line__info__text">
                        <span className="album-line__info__text__title">{album.title}</span>
                        <div className="album-line__info__text__artists">
                            {album.artists.map((artist, index) => (
                                <span key={artist.id}>
                                    <Link to={artist.artist_page}>{artist.title}</Link>
                                    {index < album.artists.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="album-line__description">
                    <span>{album.type}</span>
                </div>
                <div className="album-line__controls">
                    <img src="/static/img/play.svg" alt="play"/>
                </div>
            </div>
        ]
    }
}

export class AlbumCard extends Component {
    render() {
        const album: AppTypes.Album = this.props.album;
        return [
            <Link to={album.album_page} className="album-card">
                <img className="album-card__img" src={album.thumbnail_url} alt="error"/>
                <div className="album-card__info">
                    <span className="album-card__info__title">{album.title}</span>
                    <span className="album-card__info__artists">
                        {album.artists.map((artist, index) => (
                            <span key={artist.id}>
                                {artist.title}
                                {index < album.artists.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </span>
                </div>
            </Link>
        ]
    }
}
