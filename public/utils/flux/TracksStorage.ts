import Dispatcher from "libs/flux/Dispatcher";
import { Storage } from "libs/flux/Storage";
import { Action } from "libs/flux/Action";

import { ACTIONS } from "./actions";

type TracksStorageStor = {
    playing: AppTypes.Track,
    playingState: boolean,
}

class TracksStorage extends Storage<TracksStorageStor> {
    constructor() {
        super();
        
        this.stor.playing = null;
        this.stor.playingState = false;
        Dispatcher.register(this.handleAction.bind(this));
    }

    protected handleAction(action: Action) {
        switch (true) {
            case action instanceof ACTIONS.TRACK_PLAY:
                this.stor.playing = action.payload;
                this.stor.playingState = true;
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.TRACK_STATE_CHANGE:
                this.stor.playingState = action.payload.playing;
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.TRACK_LIKE:
                this.callSubs(action);
                break;
        }
    }
    
    getPlaying(): Readonly<AppTypes.Track> {
        return this.stor.playing;
    }

    getPlayingState(): boolean {
        return this.stor.playingState;
    }
}

export default new TracksStorage();
