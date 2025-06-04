import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import { ArtistEdit } from "components/forms/ArtistEdit";

import "./Artist.scss";

export class ArtistCard extends Component {
    props: {
        artist: AppTypes.Artist,
        onEdit?: (artist: AppTypes.Artist) => void
        [k: string]: any
    }

    onEditClick = (e: PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ artistEditOpen: true });
    }

    artistEdited = (artist: AppTypes.Artist) => {
        this.setState({ artistEditOpen: false });
        this.props.onEdit?.(artist);
    }

    render() {
        const artist: AppTypes.Artist = this.props.artist;
        return [
            <div className="artist-card">
                <Link to={artist.artist_page}>
                    <img className="artist-card__img" src={ artist.thumbnail_url } alt="error"/>
                    {this.props.onEdit && <img className="artist-card__edit" src="/static/img/pencil.svg" alt="ed" onClick={this.onEditClick} />}
                    <div className="artist-card__info">
                        <span className="artist-card__info__title">{artist.title}</span>
                    </div>
                </Link>
                {this.state.artistEditOpen && <ArtistEdit
                    artist={artist}
                    onClose={() => this.setState({ artistEditOpen: false })}
                    onEdit={this.artistEdited}
                />}
            </div>
        ]
    }
}
