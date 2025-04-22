import h from "libs/rzf/jsx";
import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import "./Artist.scss";

export class ArtistCard extends Component {
    render() {
        const artist: AppTypes.Artist = this.props.artist;

        return (
            <div classes={["artist-card"]}>
                <Link to={artist.artist_page}>
                    <img classes={["artist-card__img"]} src={artist.thumbnail_url} alt="error"/>
                    <div classes={["artist-card__info"]}>
                        <span classes={["artist-card__info__title"]}>{artist.title}</span>
                    </div>
                </Link>
            </div>
        )
    }
}