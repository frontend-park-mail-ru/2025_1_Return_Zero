import Dispatcher from "libs/flux/Dispatcher";
import { Storage } from "libs/flux/Storage";
import { Action } from "libs/flux/Action";

import { ACTIONS } from "./actions";

import { API } from "utils/api";

type ContentStorageStore = {
    playlists: AppTypes.Playlist[];
    playlistsError: any;
}

class ContentStorage extends Storage<ContentStorageStore> {
    constructor() {
        super();
        
        this.stor.playlists = [];
        this.stor.playlistsError = null;
        
        Dispatcher.register(this.handleAction.bind(this));
    }

    protected async handleAction(action: Action) {
        switch (true) {
            case action instanceof ACTIONS.USER_LOGIN:
            case action instanceof ACTIONS.USER_CHANGE:
                await this.loadPlaylists();
                this.callSubs(new ACTIONS.CONTENT_PLAYLISTS_CHANGED(null));
                break;
            case action instanceof ACTIONS.USER_LOGOUT:
                this.stor.playlists = [];
                this.callSubs(new ACTIONS.CONTENT_PLAYLISTS_CHANGED(null));
                break;

            case action instanceof ACTIONS.LOAD_PLAYLISTS:
                await this.loadPlaylists();
                this.callSubs(new ACTIONS.CONTENT_PLAYLISTS_CHANGED(null));
                break;
            case action instanceof ACTIONS.CREATE_PLAYLIST:
                this.stor.playlists.unshift(action.payload);
                this.callSubs(new ACTIONS.CONTENT_PLAYLISTS_CHANGED(null));
                break;
            case action instanceof ACTIONS.DELETE_PLAYLIST:
                this.stor.playlists = this.stor.playlists.filter(pl => pl.id !== action.payload.id);
                this.callSubs(new ACTIONS.CONTENT_PLAYLISTS_CHANGED(null));
                break;
        }
    }

    protected async loadPlaylists() {
        try {
            const playlists = (await API.getPlaylists()).body;
            this.stor.playlists = playlists;
            this.stor.playlistsError = null;
        } catch (error) {
            console.error('Content storage - loadPlaylists:', error.message);
            this.stor.playlists = [];
            this.stor.playlistsError = error;
        }
    }

    get playlists(): Readonly<AppTypes.Playlist[]> { return this.stor.playlists; }
}

export default new ContentStorage();
