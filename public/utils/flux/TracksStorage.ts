import Dispatcher from "libs/flux/Dispatcher";
import { Storage } from "libs/flux/Storage";
import { Action } from "libs/flux/Action";

import { ACTIONS } from "./actions";

type TracksStorageStor = {
    playing: AppTypes.Track,
    playingState: PlayingState
}

enum PlayingState {
    PLAY = 'play',
    PAUSE = 'pause'
}

class TracksStorage extends Storage<TracksStorageStor> {
    constructor() {
        super();
        
        this.stor.playing = null;
        this.stor.playingState = PlayingState.PAUSE;
        Dispatcher.register(this.handleAction.bind(this));
    }

    protected handleAction(action: Action) {
        switch (true) {
            case action instanceof ACTIONS.TRACK_PLAY:
                this.stor.playing = action.payload;
                this.stor.playingState = PlayingState.PLAY;
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.TRACK_PAUSE:
                this.stor.playing = action.payload;
                this.stor.playingState = PlayingState.PAUSE;
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.TRACK_LIKE:
            case action instanceof ACTIONS.TRACK_UNLIKE:
                this.callSubs(action);
                break;
        }
    }
    
    getPlaying(): Readonly<AppTypes.Track> {
        return this.stor.playing;
    }

    getPlayingState(): Readonly<PlayingState> {
        return this.stor.playingState;
    }
}

export default new TracksStorage();
