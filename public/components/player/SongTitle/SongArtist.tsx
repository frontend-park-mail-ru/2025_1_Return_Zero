import { Component } from "libs/rzf/Component";
import Router from "libs/rzf/Router";

import playerStorage from "utils/flux/PlayerStorage";

export class SongArtist extends Component {
    render() {
        const onResize = this.props.onResize;

        return [
            <div id="artist-name" className="artist-name" 
                onClick={() => {Router.push(playerStorage.currentTrackAristURL, {}); onResize()}}
            >
                <span className="marquee">{playerStorage.currentTrackArtist}</span>
            </div>
        ];
    }
}

