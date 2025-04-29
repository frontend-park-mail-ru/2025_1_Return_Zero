import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import './Playlist.scss'

export class PlaylistCard extends Component {
    render() {
        const playlist: AppTypes.Playlist = this.props.playlist;
        return [
            <div className={this.state.playing || this.state.hover ? "playlist-card active" : "playlist-card"}>
                <div className="playlist-card__img">
                    <img className="content" src={playlist.thumbnail_url} alt="error"/>
                    {
                        this.state.playing ? <img className="state" src={`/static/img/${this.state.playing}.svg`} />
                        : this.state.hover && <img className="state" src="/static/img/play.svg" />
                    }
                </div>
                <div className="playlist-card__info">
                    <span className="playlist-card__info__title">{playlist.title}</span>
                    <span className="playlist-card__info__user">
                        <Link to={playlist.user.user_page}>{playlist.user.username}</Link>
                    </span>
                </div>
            </div>
        ]
    }
}