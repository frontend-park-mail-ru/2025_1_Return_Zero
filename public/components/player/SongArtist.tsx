import { Component } from "libs/rzf/Component";
import tracksQueue from "common/tracksQueue";
import Router from "libs/rzf/Router";


export class SongArtist extends Component {
    render() {
        const onResize = this.props.onResize;

        return [
            <div id="artist-name" className="artist-name" 
                onClick={() => {Router.push(tracksQueue.getAristURL(), {}); onResize()}}
            >
                <span className="marquee">{tracksQueue.getCurrentTrackArtist()}</span>
            </div>
        ];
    }
}

