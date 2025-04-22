import h from "libs/rzf/jsx";
import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import "./Track.scss";

function durationToString(duration: number) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

export class TrackLine extends Component {
    render() {
        const ind: number = this.props.ind;
        const track: AppTypes.Track = this.props.track;

        return (
            <div classes={["track-line"]}>
                <div classes={["track-line__info"]}>
                    {ind !== undefined && <span classes={["track-line__info__index"]}>{ind + 1}</span>}
                    <img classes={["track-line__info__img"]} src={track.thumbnail_url} alt="error"/>
                    <div classes={["track-line__info__text"]}>
                        <span classes={["track-line__info__text__title"]}>{track.title}</span>
                        <div classes={["track-line__info__text__artists"]}>
                            {...track.artists.map(artist => <Link to={artist.artist_page}>{artist.title}</Link>)}
                        </div>
                    </div>
                </div>

                <div classes={["track-line__album"]}>
                    <Link to="">{track.album}</Link>
                </div>

                <div classes={["track-line__controls"]}>
                    <span classes={["track-line__controls__duration"]}>{durationToString(track.duration)}</span>
                    <img src="/static/img/like-default.svg" alt="like"/>
                    <img src="/static/img/dots.svg" alt="more"/>
                </div>
            </div>
        )
    }
}

export class TrackCard extends Component {
    render() {
        const track: AppTypes.Track = this.props.track;
        return (
            <div classes={["track-card"]}>
                <img classes={["track-card__img"]} src={track.thumbnail_url} alt="error"/>
                <div classes={["track-card__info"]}>
                    <span classes={["track-card__info__title"]}>{track.title}</span>
                    <span classes={["track-card__info__artists"]}>
                        {...track.artists.map(artist => <Link to={artist.artist_page}>{artist.title}</Link>)}
                    </span>
                </div>
            </div>
        )
    }
}