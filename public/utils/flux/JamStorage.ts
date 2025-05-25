import Dispatcher from "libs/flux/Dispatcher";
import { Storage } from "libs/flux/Storage";
import { Action } from "libs/flux/Action";

import { ACTIONS } from "./actions";

import { API } from "utils/api";
import { USER_STORAGE } from "./storages";

import playerStorage from "./PlayerStorage";

export type Leader = {
    id: string;
    img_url: string;
    name: string;
}

export type Listener = {
    id: string;
    img_url: string;
    name: string;
    ready: boolean;
}

type JamStorageStor = {
    isLeader: boolean;
    leader: Leader;
    listeners: Listener[];
    ws: WebSocket;
    roomId: string;
    now_playing: AppTypes.Track | null;
}

const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const host = window.location.host;

class JamStorage extends Storage<JamStorageStor> {
    constructor() {
        super();
        
        this.stor.listeners = [];
        this.stor.ws = null;
        this.stor.roomId = null;

        Dispatcher.register(this.handleAction.bind(this));
    }

    protected handleAction(action: Action) {
        switch (true) {
            case action instanceof ACTIONS.JAM_OPEN:
                this.openWebSocket(action.payload);
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.JAM_CLOSE:
                this.closeWebSocket();
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.JAM_UPDATE:
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.JAM_PLAY:
                if (this.stor.isLeader) {
                    const type = playerStorage.isPlaying ? 'host:play' : 'host:pause';
                    console.warn('Sending message:', type);
                    this.stor.ws.send(JSON.stringify({ type: type }));
                }
                break;
            case action instanceof ACTIONS.JAM_PAUSE:
                if (this.stor.isLeader) {
                    this.stor.ws.send(JSON.stringify({ type: 'host:pause' }));
                }
                playerStorage.pause();
                break;
            case action instanceof ACTIONS.JAM_SEEK:
                if (this.stor.isLeader) {
                    this.stor.ws.send(JSON.stringify({ type: 'host:seek', position: action.payload }));
                }
                break;
            case action instanceof ACTIONS.JAM_READY:
                this.stor.ws.send(JSON.stringify({ type: 'client:ready' }));
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.JAM_HOST_LOAD:
                this.hostLoad(action.payload);
                break;
        }
    }

    public hostLoad(trackId: string) {
        if (this.stor.isLeader) {
            this.stor.ws.send(JSON.stringify({ type: 'host:load', track_id: trackId }));
        }

        for (const listener of this.stor.listeners) {
            listener.ready = false;
        }

        this.callSubs(new ACTIONS.JAM_UPDATE(null));
    }

    public openWebSocket(roomId: string) {
        if (this.stor.ws) {
            if (this.stor.roomId === roomId) {
                return;
            }
            this.stor.ws.close();
        }

        this.stor.ws = new WebSocket(`${protocol}://${host}/api/v1/jams/${roomId}`);
        this.stor.roomId = roomId;

        this.stor.ws.onopen = () => {
            this.onOpen();
        };

        this.stor.ws.onmessage = (event: MessageEvent) => {
            this.onMessage(event);
        };

        this.stor.isLeader = false;
    }

    private onOpen() {
        console.warn('WebSocket connection opened');
    }

    private async loadTrack(trackId: string) {
        console.log('Loading track:', trackId);

        const response = await API.getTrack(Number(trackId));
        const track = response.body;

        for (const listener of this.stor.listeners) {
            if (listener.id !== this.stor.leader.id) {
                listener.ready = false;
            }
        }

        this.callSubs(new ACTIONS.JAM_UPDATE(null));

        console.log('Loadede track:', track);
        playerStorage.processNewTracks(track, [track]);
        this.callSubs(new ACTIONS.JAM_SET_TRACK(track));

        this.stor.now_playing = track;
        this.callSubs(new ACTIONS.JAM_UPDATE(null));
    }

    private onMessage(event: MessageEvent) {
        const data = JSON.parse(event.data);
        console.warn('WebSocket message received:', data);

        switch (data.type) {
            case 'init':
                const host_id = data.host_id;
                const host_name = data.user_names[host_id];    
                
                this.stor.leader = {
                    id: host_id.toString(),
                    img_url: data.user_images[host_id.toString()],
                    name: host_name.toString(),
                }

                for (const [id, name] of Object.entries(data.user_names)) {
                    this.stor.listeners.push({
                        id: id.toString(),
                        img_url: data.user_images[id.toString()],
                        name: name.toString(),
                        ready: name === USER_STORAGE.getUser().username ? false : true,
                    });
                }

                this.loadTrack(data.track_id);

                if (host_name === USER_STORAGE.getUser().username) {
                    this.stor.isLeader = true;
                }

                break;

            case 'user:joined':
                this.stor.listeners.push({
                    id: data.user_id.toString(),
                    img_url: data.user_images[data.user_id.toString()],
                    name: data.user_names[data.user_id.toString()].toString(),
                    ready: false,
                });

                break;

            case 'user:left':
                this.stor.listeners = this.stor.listeners.filter(listener => listener.id !== data.user_id.toString());
                break;

            case 'pause': 
                if (this.stor.isLeader) {
                    return;
                }

                playerStorage.pause();
                break;

            case 'play':
                if (!playerStorage.isPlaying) {
                    playerStorage.play();
                }
                break;

            case 'seek':
                if (this.stor.isLeader) {
                    return;
                }

                playerStorage.setCurrentTime(data.position);
                break;

            case 'ready':
                this.stor.listeners = this.stor.listeners.map(listener => {
                    if (listener.id === data.user_id.toString()) {
                        return { ...listener, ready: true };
                    }
                    return listener;
                });
                break;

            case 'load':
                if (this.stor.isLeader) {
                    return;
                }

                this.loadTrack(data.track_id);
                break;
        }

        this.callSubs(new ACTIONS.JAM_UPDATE(null));
    }

    public closeWebSocket() {
        if (!this.stor.ws) {
            return;
        }

        this.stor.ws.close();
    }

    get leader() {
        return this.stor.leader;
    }

    get listeners() {
        return this.stor.listeners;
    }

    get isLeader() {
        return this.stor.isLeader;
    }

    get now_playing() {
        return this.stor.now_playing;
    }
}

export default new JamStorage();

