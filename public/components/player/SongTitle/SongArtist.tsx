import { Component } from "libs/rzf/Component";
import Router, { Link } from "libs/rzf/Router";

import playerStorage from "utils/flux/PlayerStorage";

export class SongArtist extends Component {
    render() {
        const onResize = this.props.onResize;

        return [
            <div id="artist-name" className="artist-name" >
                    {playerStorage.currentTrack && playerStorage.currentTrack.artists.map((artist: any, index: any) => (
                        <span className="marquee">
                            <Link to={artist.artist_page}>{artist.title}</Link>
                            {index < playerStorage.currentTrack.artists.length - 1 ? ', ' : ''}
                        </span>
                    ))}
            </div>
        ];
    }
}

