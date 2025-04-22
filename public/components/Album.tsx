import h from "libs/rzf/jsx";
import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import "./Album.scss";

export class AlbumLine extends Component {
    render() {
        const ind: number = this.props.ind;
        const album: AppTypes.Album = this.props.album;

        return (
            <div classes={["album-line"]}>
                <div classes={["album-line__info"]}>
                    {ind !== undefined && <span classes={["album-line__info__index"]}>{ind + 1}</span>}
                    <Link to="">
                        <img classes={["album-line__info__img"]} src={album.thumbnail_url} alt="error"/>
                    </Link>
                    <div classes={["album-line__info__text"]}>
                        <span classes={["album-line__info__text__title"]}>{album.title}</span>
                        <div classes={["album-line__info__text__artists"]}>
                            {...album.artists.map(artist => <Link to={artist.artist_page}>{artist.title}</Link>)}
                        </div>
                    </div>
                </div>
                <div classes={["album-line__description"]}>
                    <span>{album.type}</span>
                </div>
                <div classes={["album-line__controls"]}>
                    <img src="/static/img/play.svg" alt="play"/>
                </div>
            </div>
        )
    }
}

export class AlbumCard extends Component {
    render() {
        const album: AppTypes.Album = this.props.album;
        return (
            <div classes={["album-card"]}>
                <img classes={["album-card__img"]} src={album.thumbnail_url} alt="error"/>
                <div classes={["album-card__info"]}>
                    <span classes={["album-card__info__title"]}>{album.title}</span>
                    <span classes={["album-card__info__artists"]}>
                        {...album.artists.map(artist => <Link to={artist.artist_page}>{artist.title}</Link>)}
                    </span>
                </div>
            </div>
        )
    }
}
