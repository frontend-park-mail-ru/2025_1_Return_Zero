import { Component } from "libs/rzf/Component";

import playerStorage from "utils/flux/PlayerStorage";

export class SongName extends Component {
    render() {
        return [
            <div id="song-name" className="song-name">
                <span className="marquee">{playerStorage.currentTrackName}</span>
            </div>
        ];
    }
}

