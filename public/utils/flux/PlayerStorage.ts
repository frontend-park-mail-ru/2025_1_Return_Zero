import Dispatcher from "libs/flux/Dispatcher";
import { Storage } from "libs/flux/Storage";
import { Action } from "libs/flux/Action";

import { ACTIONS } from "./actions";
import { API } from "utils/api";
import { Stream } from "common/stream";

import PlayerSync from "common/playerSync";
import Broadcast from "common/broadcast";
import TracksStorage from "./TracksStorage";

type PlayerStorageStor = {
    audio: HTMLAudioElement;
    stream: Stream;

    audioLevel: number;
    prevAudioLevel: number;
    currentTime: number;
    duration: number;
    playedOnce: boolean;
    playPromise: Promise<void> | null;
    queue: string[];
    savedQueue: string[];
    addedQueue: string[];
    idx: number;
    currentTrack: AppTypes.Track | null;
    
    shuffled: boolean;
    repeated: boolean;
    initialized: boolean;
}

class PlayerStorage extends Storage<PlayerStorageStor> {
    static instance: PlayerStorage;

    playerSync: PlayerSync;

    constructor() {
        super();

        if (PlayerStorage.instance) {
            return PlayerStorage.instance;
        }
        PlayerStorage.instance = this;

        this.playerSync = new PlayerSync(this.onMasterChange.bind(this));
        this.stor.initialized = false;

        Dispatcher.register(this.handleAction.bind(this));
        window.addEventListener('storage', this.onStorageEvent.bind(this));
    }

    onStorageEvent(event: StorageEvent) {
        if (event.key === 'player-action') {
            const action = JSON.parse(event.newValue);
            
            switch (action.action) {
                case 'previousTrack':
                    this.previousTrack();
                    break;
                case 'nextTrack':
                    this.nextTrack();
                    break;      
                case 'togglePlay':
                    this.togglePlay();
                    break;
                case 'toggleMute':
                    this.toggleMute();
                    break;
                case 'loadTrack':
                    this.loadTrack(action.payload);
                    break;
                case 'setVolume':
                    this.setVolume(action.payload);
                    break;
                case 'setCurrentTime':
                    this.setCurrentTime(action.payload);
                    break;
                case 'setDuration':
                    this.setDuration(action.payload);
                    break;
                case 'repeat':
                    this.repeat();
                    break;
                case 'unrepeat':
                    this.unrepeat();
                    break;
                case 'shuffle':
                    this.shuffle();
                    break;
                case 'unshuffle':
                    this.unshuffle();
                    break;
                case 'addSection':
                    const msg = action.payload;
                    console.warn('addSection', action.payload);
                    this.processNewTracks(msg.currentTrack as AppTypes.Track, msg.tracks as AppTypes.Track[], true);
                    break;
                case 'manualAddTrack':
                    this.manualAddTrack(action.payload);
                    break;
            }
        }

        // затычка
        this.callSubs(new ACTIONS.AUDIO_TOGGLE_PLAY(null));
    }

    onMasterChange() {
        if (this.stor.initialized) return;

        this.init();
        this.stor.initialized = true;
    }

    init() {
        this.initAudioVariables();
        this.initQueueVariables();

        this.initAudioStates();  
        this.initQueueStates();

        this.stor.audio.ontimeupdate = () => {
            this.stor.currentTime = this.stor.audio.currentTime;
            
            try {
                localStorage.setItem('audio-current-time', String(this.stor.currentTime));
            } catch (error) {
                console.error('Failed to save audio current time:', error);
            }
            
            this.callSubs(new ACTIONS.AUDIO_SET_CURRENT_TIME(null));
        };
    }

    private initAudioVariables() {
        this.stor.audio = document.createElement('audio');
        this.stor.audioLevel = 0.5;
        this.stor.prevAudioLevel = 0.5;
        this.stor.currentTime = 0;
        this.stor.duration = 0;
        this.stor.playedOnce = false;
        this.stor.playPromise = null;
        this.stor.stream = new Stream();
    }

    private initQueueVariables() {
        this.stor.queue = [];
        this.stor.savedQueue = [];
        this.stor.addedQueue = [];
        this.stor.idx = -1;
        this.stor.currentTrack = null;
        this.stor.shuffled = false;
        this.stor.repeated = false;    
    }

    private sendAction(action: string, arg?: any) {
        try {
            localStorage.setItem('player-action', JSON.stringify({ action: action, payload: arg, timestamp: Date.now() }));
        } catch (error) {
            console.error('Failed to send action:', error);
        }
    }

    private doAction(action: Action, funcName: string, callback: (arg?: any) => void, arg?: any) {
        if (this.playerSync.isMaster) {
            callback(arg);
        } else {
            if (funcName === 'addSection') {
                this.sendSection(arg);
            } else {
                this.sendAction(funcName, arg);
            }
        }

        this.callSubs(action);
    }

    protected handleAction(action: Action) {
        switch (true) {
            case action instanceof ACTIONS.AUDIO_TOGGLE_PLAY:
                this.doAction(action, 'togglePlay', () => this.togglePlay(), null);
                break;
            case action instanceof ACTIONS.AUDIO_TOGGLE_MUTE:
                this.doAction(action, 'toggleMute', () => this.toggleMute(), null);
                break;
            case action instanceof ACTIONS.AUDIO_SET_TRACK:
                this.doAction(action, 'loadTrack', () => this.loadTrack(action.payload), action.payload);
                break;
            case action instanceof ACTIONS.AUDIO_SET_VOLUME:
                this.doAction(action, 'setVolume', () => this.setVolume(action.payload), action.payload);
                break;
            case action instanceof ACTIONS.AUDIO_SET_CURRENT_TIME:
                this.doAction(action, 'setCurrentTime', () => this.setCurrentTime(action.payload), action.payload);
                break;
            case action instanceof ACTIONS.AUDIO_SET_DURATION:
                this.doAction(action, 'setDuration', () => this.setDuration(action.payload), action.payload);
                break;
            case action instanceof ACTIONS.QUEUE_REPEAT:
                this.doAction(action, 'repeat', () => this.repeat(), null);
                break;
            case action instanceof ACTIONS.QUEUE_UNREPEAT:
                this.doAction(action, 'unrepeat', () => this.unrepeat(), null);
                break;
            case action instanceof ACTIONS.QUEUE_SHUFFLE:
                this.doAction(action, 'shuffle', () => this.shuffle(), null);
                break;
            case action instanceof ACTIONS.QUEUE_UNSHUFFLE:
                this.doAction(action, 'unshuffle', () => this.unshuffle(), null);
                break;
            case action instanceof ACTIONS.QUEUE_NEXT:
                this.doAction(action, 'nextTrack', () => this.nextTrack(), null);
                break;
            case action instanceof ACTIONS.QUEUE_PREV:
                this.doAction(action, 'previousTrack', () => this.previousTrack(), null);
                break;
            case action instanceof ACTIONS.QUEUE_ADD_SECTION:
                this.doAction(action, 'addSection', () => this.addSection(action.payload), action.payload);
                break;
            case action instanceof ACTIONS.QUEUE_ADD_MANUAL:
                this.doAction(action, 'manualAddTrack', () => this.manualAddTrack(action.payload), action.payload);
                break;
        }
    }

    // AUDIO

    async initAudioStates() {
        try {
            this.stor.audioLevel = Number(localStorage.getItem('audio-level'));
            this.stor.prevAudioLevel = this.stor.audioLevel;
            this.stor.audio.currentTime = Number(
                localStorage.getItem('audio-current-time')
            );

            if (!('audio-level' in localStorage)) {
                this.stor.audioLevel = 0.5;
                this.stor.prevAudioLevel = 0.5;
            }

        } catch (error) {
            console.error('Failed to get states for audio:', error);
            try {
                localStorage.setItem('audio-level', String(this.audioLevel));
            } catch (error) {
                console.error('Failed to save audio level:', error);
            }
        }

        this.setVolume(this.stor.audioLevel);
        this.stor.playedOnce = false;
    }
    
    async togglePlay(): Promise<void> {
        try {
            if (this.stor.audio.paused) {
                await this.play();
            } else {
                this.pause();
            }

            this.stor.playedOnce = true;
            localStorage.setItem('is-playing', String(!this.stor.audio.paused));
            localStorage.setItem('played-once', String(this.stor.playedOnce));
        } catch (error) {
            // console.error('Playback error:', error);
            // this.pause();
        }
    }

    async play(): Promise<void> {
        this.stor.playPromise = this.stor.audio.play();
        return this.stor.playPromise
            .then(() => {})
            .catch((error) => {
                throw error; // Rethrow the error
            });
    }

    toggleMute() {
        if (this.stor.audioLevel > 0.00001) {
            this.stor.prevAudioLevel = this.stor.audioLevel;
            this.setVolume(0);
            return;
        } 
        if (this.stor.prevAudioLevel) {
            this.setVolume(this.stor.prevAudioLevel);
        } else {
            this.setVolume(0.1);
        }
    }

    pause(): void {
        if (this.stor.playPromise) {
            this.stor.playPromise.catch(() => {
                // Ignore
            });
        }
        this.stor.audio.pause();
    }

    private onMeta = () => {
        this.callSubs(new ACTIONS.AUDIO_RETURN_METADATA(null));
    };

    loadTrack(src: string, play: boolean = true) {
        this.stor.audio.src = src;

        this.stor.audio.removeEventListener('canplaythrough', this.onMeta);
        this.stor.audio.addEventListener('canplaythrough', this.onMeta, { once: true });

        this.callSubs(new ACTIONS.AUDIO_SET_TRACK(null));
        if (this.stor.currentTrack) {
            Broadcast.send('trackLike', { trackId: this.stor.currentTrack.id, is_liked: this.stor.currentTrack.is_liked });
            TracksStorage.addTrack(this.stor.currentTrack);
        }

        if (this.stor.audio.paused && play) {
            this.togglePlay();
        }

        this.callSubs(new ACTIONS.AUDIO_SET_TRACK(null));
    }

    setVolume(volume: number) {
        this.stor.audioLevel = volume;
        this.stor.audio.volume = this.stor.audioLevel;

        this.SaveVolume();
    }

    async SaveVolume() {
        try {
            localStorage.setItem('audio-level', String(this.audioLevel));
        } catch (error) {
            console.error('Failed to save audio level:', error);
        }
    }

    setCurrentTime(time: number) {
        this.stor.currentTime = time;
        this.stor.audio.currentTime = time;

        if (this.stor.playedOnce) {
            this.SaveCurrentTime();
        }
    }

    async SaveCurrentTime() {
        try {
            localStorage.setItem(
                'audio-current-time',
                String(this.stor.currentTime)
            );
        } catch (error) {
            console.error('Failed to save audio current time:', error);
        }
    }

    setDuration(duration: number) {
        this.stor.duration = duration;

        try {
            localStorage.setItem('audio-duration', String(this.stor.duration));
        } catch (error) {
            console.error('Failed to save audio duration:', error);
        }

        this.callSubs(new ACTIONS.AUDIO_SET_DURATION(null));
    }

    // QUEUE

    private initQueueStates(): void {
        this.stor.audio.addEventListener('ended', this.handleTrackEnd);
        this.loadInitialState();
    }

    private loadInitialState(): void {
        try {
            const savedQueue = localStorage.getItem('queue');
            if (savedQueue) {
                this.stor.queue = JSON.parse(savedQueue);
                this.stor.savedQueue = JSON.parse(localStorage.getItem('saved-queue') || '[]');
                this.stor.idx = Number(localStorage.getItem('queue-idx')) || -1;
                this.stor.shuffled = JSON.parse(localStorage.getItem('queue-shuffled') || 'false');
                this.stor.repeated = JSON.parse(localStorage.getItem('queue-repeated') || 'false');
                this.stor.currentTrack = JSON.parse(localStorage.getItem('current-track') || 'undefined');
                this.stor.addedQueue = JSON.parse(localStorage.getItem('added-queue') || '[]');

                if (this.stor.queue.length) {
                    this.setTrack(false);
                }
            }
        } catch (error) {
            console.error('Error loading queue state:', error);
        }
    }

    private handleTrackEnd = (): void => {
        if (this.stor.repeated) {
            this.stor.audio.currentTime = 0;
            this.stor.audio.paused && this.togglePlay();
            return;
        }
        this.nextTrack();
    };

    private sendSection(currentTrack: AppTypes.Track): void {
        const args = Object.keys(currentTrack.retriever_args).map(key => 
            key === 'limit' ? 1000 : currentTrack.retriever_args[key]
        );

        currentTrack.retriever_func(...args)
            .then((res: any) => {
                this.sendAction(
                    'addSection',
                    {
                        currentTrack,
                        tracks: res.body
                    }
                );
            });
    }

    private addSection(currentTrack: AppTypes.Track): void {
        const args = Object.keys(currentTrack.retriever_args).map(key => 
            key === 'limit' ? 1000 : currentTrack.retriever_args[key]
        );

        currentTrack.retriever_func(...args)
            .then((res: any) => {
                this.processNewTracks(currentTrack, res.body);
            });
    }

    processNewTracks(currentTrack: AppTypes.Track, tracks: AppTypes.Track[], onPause: boolean = false): void {
        const tracksIds = tracks.map(t => t.id.toString());
        const trackIdx = tracks.findIndex(t => t.id === currentTrack.id);

        this.clearQueue();
        this.addTrack(tracksIds, trackIdx);

        if (onPause) {
            this.pause();
        }
    }

    private saveQueue(): void {
        try {
            localStorage.setItem('queue', JSON.stringify(this.stor.queue));
            localStorage.setItem('saved-queue', JSON.stringify(this.stor.savedQueue));
            localStorage.setItem('queue-idx', String(this.stor.idx));
            localStorage.setItem('queue-shuffled', String(this.stor.shuffled));
        } catch (error) {
            console.error('Error saving queue:', error);
        }
    }

    private async saveCurrentTrack() {
        console.log('Triggered!');
        try {
            localStorage.setItem('current-track', JSON.stringify(this.stor.currentTrack));
        } catch (error) {
            console.error('Error saving current track:', error);
        }
    }

    private saveAddedQueue(): void {
        try {
            localStorage.setItem('added-queue', JSON.stringify(this.stor.addedQueue));
        } catch (error) {
            console.error('Error saving added queue:', error);
        }
    }

    private saveRepated(): void {
        try {
            localStorage.setItem('queue-repeated', String(this.stor.repeated));
        } catch (error) {
            console.error('Error saving repeat state:', error);
        }
    }

    public addTrack(tracksId: string | string[], startIdx?: number): void {
        if (Array.isArray(tracksId)) {
            this.stor.queue.push(...tracksId);
        } else {
            this.stor.queue.push(tracksId);
        }

        if (this.stor.idx === -1) {
            this.stor.idx = startIdx ? startIdx - 1 : -1;
            this.nextTrack();
        }
    }

    public manualAddTrack(track: AppTypes.Track): void {
        this.stor.addedQueue.push(track.id.toString());
        this.saveAddedQueue();
    }

    public async nextTrack(): Promise<void> {
        this.stor.idx = (this.stor.idx + 1) % this.stor.queue.length;
        await this.setTrack(true, true);
    }

    public previousTrack(): void {
        this.stor.idx = Math.max(this.stor.idx - 1, 0);
        this.setTrack();
    }

    public repeat(): void {
        this.stor.repeated = true;
        this.saveRepated();
    }

    public unrepeat(): void {
        this.stor.repeated = false;
        this.saveRepated();
    }

    public shuffle(): void {
        if (this.stor.shuffled) return;

        const currentId = this.stor.queue[this.stor.idx];
        this.stor.savedQueue = [...this.stor.queue];
        
        for (let i = this.stor.queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.stor.queue[i], this.stor.queue[j]] = [this.stor.queue[j], this.stor.queue[i]];
        }
        
        this.stor.idx = this.stor.queue.indexOf(currentId);
        this.stor.shuffled = true;
        this.saveQueue();
    }

    public unshuffle(): void {
        if (!this.stor.shuffled) return;

        const currentId = this.stor.queue[this.stor.idx];
        this.stor.queue = [...this.stor.savedQueue];
        this.stor.idx = this.stor.queue.indexOf(currentId);
        this.stor.shuffled = false;
        this.saveQueue();
    }

    public clearQueue(): void {
        this.stor.queue = [];
        this.stor.savedQueue = [];
        this.stor.idx = -1;
        this.stor.shuffled = false;
    }

    private async setTrack(play: boolean = true, isNext?: boolean): Promise<void> {
        let trackId: string | null = null;
        
        if (isNext && this.stor.addedQueue && this.stor.addedQueue.length) {
            trackId = this.stor.addedQueue.shift()!;
            this.saveAddedQueue();
            this.saveCurrentTrack();

            await this.stor.stream.updateStream();
            await this.stor.stream.createStream();
        } else {
            trackId = this.stor.queue[this.stor.idx];
        }

        if (!trackId) return;

        const response = await API.getTrack(Number(trackId));
        const track = response.body;
        
        this.loadTrack(track.file_url, play);
        this.setDuration(track.duration);
        this.stor.currentTrack = track;
        this.saveCurrentTrack();

        this.saveQueue();

        await this.stor.stream.updateStream();
        await this.stor.stream.createStream();
    }

    // GETTERS

    get isPlaying() {
        try {
            if (!this.playerSync.isMaster) {
                return JSON.parse(localStorage.getItem('is-playing') || 'true');
            }
        } catch (error) {
            return true;
        }

        return !this.stor.audio.paused;
    }

    get audioLevel() {
        try {
            if (!this.playerSync.isMaster) {
                return Number(localStorage.getItem('audio-level'));
            }
        } catch (error) {
            return 0.5;
        }

        return this.stor.audioLevel;
    }

    get currentTime() {
        try {
            if (!this.playerSync.isMaster) {
                return Number(localStorage.getItem('audio-current-time'));
            }
        } catch (error) {
            return 0;
        }

        return this.stor.currentTime;
    }

    get duration() {
        try {
            if (!this.playerSync.isMaster) {
                return Number(localStorage.getItem('audio-duration'));
            }
        } catch (error) {
            return 0;
        }

        return this.stor.duration;
    }

    get currentTrack() {
        try {
            if (!this.playerSync.isMaster) {
                return JSON.parse(localStorage.getItem('current-track') || 'undefined');
            }
        } catch (error) {
            return null;
        }

        return this.stor.currentTrack;
    }

    get currentTrackName() {
        try {
            if (!this.playerSync.isMaster) {
                return JSON.parse(localStorage.getItem('current-track') || 'undefined')?.title;
            }
        } catch (error) {
            return 'none';
        }

        return this.stor.currentTrack?.title || 'none';
    }

    get currentTrackArtist() {
        try {
            if (!this.playerSync.isMaster) {
                return JSON.parse(localStorage.getItem('current-track') || 'undefined')?.artists[0]?.title;
            }
        } catch (error) {
            return 'none';
        }

        return this.stor.currentTrack?.artists[0]?.title || 'none';
    }

    get currentTrackImage() {
        try {
            if (!this.playerSync.isMaster) {
                return JSON.parse(localStorage.getItem('current-track') || 'undefined')?.thumbnail_url;
            }
        } catch (error) {
            return 'none';
        }

        return this.stor.currentTrack?.thumbnail_url || 'none';
    }

    get currentTrackAristURL() {
        try {
            if (!this.playerSync.isMaster) {
                return JSON.parse(localStorage.getItem('current-track') || 'undefined')?.artists[0]?.artist_page;
            }
        } catch (error) {
            return 'none';
        }

        return this.stor.currentTrack?.artists[0]?.artist_page;
    }

    get shuffled() {
        try {
            if (!this.playerSync.isMaster) {
                return JSON.parse(localStorage.getItem('queue-shuffled') || 'false');
            }
        } catch (error) {
            return false;
        }

        return this.stor.shuffled;
    }

    get repeated() {
        try {
            if (!this.playerSync.isMaster) {
                return JSON.parse(localStorage.getItem('queue-repeated') || 'false');
            }
        } catch (error) {
            return false;
        }

        return this.stor.repeated;
    }

    get playedOnce() {
        try {
            if (!this.playerSync.isMaster) {
                return JSON.parse(localStorage.getItem('played-once') || 'false');
            }
        } catch (error) {
            return false;
        }

        return this.stor.playedOnce;
    }
}

export default new PlayerStorage();

