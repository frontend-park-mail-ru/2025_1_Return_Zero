import { Component } from "libs/rzf/Component";
import tracksQueue from "common/tracksQueue";

export class SongName extends Component {
    render() {
        return [
            <div id="song-name" className="song-name">
                <span className="marquee">{tracksQueue.getCurrentTrackName()}</span>
            </div>
        ];
    }
}

