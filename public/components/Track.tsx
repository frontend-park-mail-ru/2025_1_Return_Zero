import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import "./Track.scss";

function durationToString(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

export class TrackLine extends Component {
    render() {
        const ind: number = this.props.ind;
        const track: AppTypes.Track = this.props.track;

        return [
            <div className="track-line">
                <div className="track-line__info">
                    {ind !== undefined && <span className="track-line__info__index">{ind + 1}</span>}
                    <img className="track-line__info__img" src={track.thumbnail_url} alt="error"/>
                    <div className="track-line__info__text">
                        <span className="track-line__info__text__title">{track.title}</span>
                        <div className="track-line__info__text__artists">
                            {track.artists.map((artist, index) => (
                                <span key={artist.id}>
                                    <Link to={artist.artist_page}>{artist.title}</Link>
                                    {index < track.artists.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="track-line__album">
                    <Link to={`/album/${track.album_id}`}>{track.album}</Link>
                </div>

                <div className="track-line__controls">
                    <div className="track-line__controls__duration-container">
                        <span className="track-line__controls__duration">{durationToString(track.duration)}</span>
                    </div>
                    <img src="/static/img/like-default.svg" alt="like"/>
                    <img src="/static/img/dots.svg" alt="more"/>
                </div>
            </div>
        ]
    }
}

export class TrackCard extends Component {
    render() {
        const track: AppTypes.Track = this.props.track;
        return [
            <div className="track-card">
                <img className="track-card__img" src={track.thumbnail_url} alt="error"/>
                <div className="track-card__info">
                    <span className="track-card__info__title">{track.title}</span>
                    <span className="track-card__info__artists">
                        {track.artists.map((artist, index) => (
                            <span key={artist.id}>
                                <Link to={artist.artist_page}>{artist.title}</Link>
                                {index < track.artists.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </span>
                </div>
            </div>
        ]
    }
}