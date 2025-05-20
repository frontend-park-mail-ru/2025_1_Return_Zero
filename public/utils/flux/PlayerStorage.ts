import Dispatcher from "libs/flux/Dispatcher";
import { Storage } from "libs/flux/Storage";
import { Action } from "libs/flux/Action";

import { ACTIONS } from "./actions";
import { API } from "utils/api";
import { Stream } from "common/stream";

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
}

class PlayerStorage extends Storage<PlayerStorageStor> {
    static instance: PlayerStorage;

    constructor() {
        super();

        if (PlayerStorage.instance) {
            return PlayerStorage.instance;
        }
        PlayerStorage.instance = this;

        this.initAudioVariables();
        this.initQueueVariables();

        this.initAudioStates();  
        this.initQueueStates();

        this.pause();

        this.stor.audio.ontimeupdate = () => {
            this.setCurrentTime(this.stor.audio.currentTime); 
            this.callSubs(new ACTIONS.AUDIO_SET_CURRENT_TIME(null));
        };

        Dispatcher.register(this.handleAction.bind(this));
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

    protected handleAction(action: Action) {
        switch (true) {
            case action instanceof ACTIONS.AUDIO_TOGGLE_PLAY:
                this.togglePlay();
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.AUDIO_TOGGLE_MUTE:
                this.toggleMute();
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.AUDIO_SET_TRACK:
                this.loadTrack(action.payload);
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.AUDIO_SET_VOLUME:
                this.setVolume(action.payload);
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.AUDIO_SET_CURRENT_TIME:
                this.setCurrentTime(action.payload);
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.AUDIO_SET_DURATION:
                this.setDuration(action.payload);
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.QUEUE_REPEAT:
                this.repeat();
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.QUEUE_UNREPEAT:
                this.unrepeat();
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.QUEUE_SHUFFLE:
                this.shuffle();
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.QUEUE_UNSHUFFLE:
                this.unshuffle();
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.QUEUE_NEXT:
                this.nextTrack();
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.QUEUE_PREV:
                this.previousTrack();
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.QUEUE_ADD_SECTION:
                this.addSection(action.payload);
                this.callSubs(action);
                break;
            case action instanceof ACTIONS.QUEUE_ADD_MANUAL:
                this.manualAddTrack(action.payload);
                this.callSubs(action);
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
        this.setCurrentTime(this.stor.currentTime);
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

    loadTrack(src: string) {
        this.stor.audio.src = src;

        if (this.stor.audio.paused) {
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

    private addSection(currentTrack: AppTypes.Track): void {
        const args = Object.keys(currentTrack.retriever_args).map(key => 
            key === 'limit' ? 1000 : currentTrack.retriever_args[key]
        );

        currentTrack.retriever_func(...args)
            .then((res: any) => {
                this.processNewTracks(currentTrack, res.body);
            });
    }

    private processNewTracks(currentTrack: AppTypes.Track, tracks: AppTypes.Track[]): void {
        const tracksIds = tracks.map(t => t.id.toString());
        const trackIdx = tracks.findIndex(t => t.id === currentTrack.id);
        
        this.clearQueue();
        this.addTrack(tracksIds, trackIdx);
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

    private saveCurrentTrack(): void {
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

    public setLiked(is_liked: boolean) {
        this.stor.currentTrack.is_liked = is_liked;
    }

    private async setTrack(play: boolean = true, isNext?: boolean): Promise<void> {
        let trackId: string | null = null;
        
        if (isNext && this.stor.addedQueue.length) {
            trackId = this.stor.addedQueue.shift()!;
            this.saveAddedQueue();

            await this.stor.stream.updateStream();
            await this.stor.stream.createStream();
        } else {
            trackId = this.stor.queue[this.stor.idx];
        }

        if (!trackId) return;

        const response = await API.getTrack(Number(trackId));
        const track = response.body;
        
        this.loadTrack(track.file_url);
        this.setDuration(track.duration);
        this.stor.currentTrack = track;
        this.saveCurrentTrack();

        this.saveQueue();

        await this.stor.stream.updateStream();
        await this.stor.stream.createStream();
    }

    // GETTERS

    get audio() {
        return this.stor.audio;
    }

    get audioLevel() {
        return this.stor.audioLevel;
    }

    get currentTime() {
        return this.stor.currentTime;
    }

    get duration() {
        return this.stor.duration;
    }

    get currentTrack() {
        return this.stor.currentTrack;
    }

    get currentTrackId() {
        return this.stor.idx === -1 ? null : this.stor.queue[this.stor.idx];
    }

    get currentTrackName() {
        return this.stor.currentTrack?.title || 'none';
    }

    get currentTrackArtist() {
        return this.stor.currentTrack?.artists[0]?.title || 'none';
    }

    get currentTrackImage() {
        return this.stor.currentTrack?.thumbnail_url || 'none';
    }

    get currentTrackAristURL() {
        return this.stor.currentTrack?.artists[0]?.artist_page;
    }

    get shuffled() {
        return this.stor.shuffled;
    }

    get repeated() {
        return this.stor.repeated;
    }

    get playedOnce() {
        return this.stor.playedOnce;
    }
}

export default new PlayerStorage();


