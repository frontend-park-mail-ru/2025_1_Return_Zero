import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import "./Artist.scss";

export class ArtistCard extends Component {
    render() {
        const artist: AppTypes.Artist = this.props.artist;

        return [
            <div className="artist-card">
                <Link to={artist.artist_page}>
                    <img className="artist-card__img" src={artist.thumbnail_url} alt="error"/>
                    <div className="artist-card__info">
                        <span className="artist-card__info__title">{artist.title}</span>
                    </div>
                </Link>
            </div>
        ]
    }
}

