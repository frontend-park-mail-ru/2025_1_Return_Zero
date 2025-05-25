import Dispatcher from "libs/flux/Dispatcher";
import { Storage } from "libs/flux/Storage";
import { Action } from "libs/flux/Action";

import { ACTIONS } from "./actions";

import { API } from "utils/api";

import Broadcast from "common/broadcast";

type TracksStorageStor = {
    tracks: Map<number, boolean>;
}

class TracksStorage extends Storage<TracksStorageStor> {
    constructor() {
        super();
        
        this.stor.tracks = new Map();
        Dispatcher.register(this.handleAction.bind(this));
    }

    protected handleAction(action: Action) {
        switch (true) {
            case action instanceof ACTIONS.TRACK_LIKE:
                this.likeTrack(action.payload)
                    .then(() => {
                        this.callSubs(action)
                        Broadcast.send('trackLike', { trackId: action.payload.id, is_liked: this.isLiked(action.payload) });
                    })
                    .catch((err) => console.error('TRACK_LIKE error:', err));
                break;
            case action instanceof ACTIONS.TRACK_ADD:
                this.addTrack(action.payload);
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.TRACK_LIKE_STATE:
                this.setLikeState(action.payload.trackId, action.payload.is_liked);
                this.callSubs(action);
                break;
        }
    }

    async likeTrack(track: AppTypes.Track) {
        const res = (await API.postTrackLike(track.id, !this.stor.tracks.get(track.id))).body;
        this.stor.tracks.set(track.id, !this.stor.tracks.get(track.id)); 
    }

    setLikeState(trackId: number, is_liked: boolean) {
        this.stor.tracks.set(trackId, is_liked);
    }

    addTrack(track: AppTypes.Track) {
        this.stor.tracks.set(track.id, track.is_liked);
    }

    isLiked(track: AppTypes.Track) {
        return this.stor.tracks.get(track.id);
    }
}

export default new TracksStorage();
