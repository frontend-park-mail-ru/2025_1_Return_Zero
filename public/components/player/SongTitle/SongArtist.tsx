import { Component } from "libs/rzf/Component";
import Router from "libs/rzf/Router";

import playerStorage from "utils/flux/PlayerStorage";

export class SongArtist extends Component {
    render() {
        const onResize = this.props.onResize;

        return [
            <div id="artist-name" className="artist-name" >
                <span className="marquee"
                    onClick={() => {Router.push(playerStorage.currentTrackAristURL, {}); onResize ? onResize() : null}}
                 >
                    {playerStorage.currentTrackArtist}</span>
            </div>
        ];
    }
}

