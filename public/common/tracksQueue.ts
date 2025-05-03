import player from './player';
import { API } from 'utils/api';
import Dispatcher from 'libs/flux/Dispatcher';
import { ACTIONS } from 'utils/flux/actions';
import { TRACKS_STORAGE } from 'utils/flux/storages';

export class TracksQueue {
    static instance: TracksQueue;

    private queue: string[] = [];
    private savedQueue: string[] = [];
    private addedQueue: string[] = [];
    private idx: number = -1;
    private currentTrack: AppTypes.Track | null = null;
    
    shuffled: boolean = false;
    repeated: boolean = false;

    constructor() {
        if (TracksQueue.instance) {
            return TracksQueue.instance;
        }
        TracksQueue.instance = this;
        this.init();
    }

    private init(): void {
        player.audio.addEventListener('ended', this.handleTrackEnd);
        TRACKS_STORAGE.subscribe(this.handleStorageAction);
        this.loadInitialState();
    }

    private loadInitialState(): void {
        try {
            const savedQueue = localStorage.getItem('queue');
            if (savedQueue) {
                this.queue = JSON.parse(savedQueue);
                this.savedQueue = JSON.parse(localStorage.getItem('saved-queue') || '[]');
                this.idx = Number(localStorage.getItem('queue-idx')) || -1;
                this.shuffled = JSON.parse(localStorage.getItem('queue-shuffled') || 'false');
                this.repeated = JSON.parse(localStorage.getItem('queue-repeated') || 'false');
                this.currentTrack = JSON.parse(localStorage.getItem('current-track') || 'undefined');
                this.addedQueue = JSON.parse(localStorage.getItem('added-queue') || '[]');

                if (this.queue.length) {
                    this.setTrack(false);
                }
            }
        } catch (error) {
            console.error('Error loading queue state:', error);
        }
    }

    private handleTrackEnd = (): void => {
        if (this.repeated) {
            player.audio.currentTime = 0;
            player.audio.paused && player.togglePlay();
            return;
        }
        this.nextTrack();
    };

    private handleStorageAction = (action: any): void => {
        if (action instanceof ACTIONS.TRACK_PLAY) {
            this.handleTrackPlayAction();
        }
        
        if (action instanceof ACTIONS.TRACK_STATE_CHANGE) {
            this.handlePlayerStateChange();
        }
    };

    private handleTrackPlayAction(): void {
        const currentTrack = TRACKS_STORAGE.getPlaying();
        if (!currentTrack || currentTrack.id === this.currentTrack?.id) return;

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

    private handlePlayerStateChange(): void {
        const state = TRACKS_STORAGE.getPlayingState();
        if (state !== !player.audio.paused) {
            player.togglePlay();
        }
    }

    private saveQueue(): void {
        try {
            localStorage.setItem('queue', JSON.stringify(this.queue));
            localStorage.setItem('saved-queue', JSON.stringify(this.savedQueue));
            localStorage.setItem('queue-idx', String(this.idx));
            localStorage.setItem('queue-shuffled', String(this.shuffled));
        } catch (error) {
            console.error('Error saving queue:', error);
        }
    }

    private saveCurrentTrack(): void {
        try {
            localStorage.setItem('current-track', JSON.stringify(this.currentTrack));
        } catch (error) {
            console.error('Error saving current track:', error);
        }
    }

    private saveAddedQueue(): void {
        try {
            localStorage.setItem('added-queue', JSON.stringify(this.addedQueue));
        } catch (error) {
            console.error('Error saving added queue:', error);
        }
    }

    private saveRepated(): void {
        try {
            localStorage.setItem('queue-repeated', String(this.repeated));
        } catch (error) {
            console.error('Error saving repeat state:', error);
        }
    }

    public addTrack(tracksId: string | string[], startIdx?: number): void {
        if (Array.isArray(tracksId)) {
            this.queue.push(...tracksId);
        } else {
            this.queue.push(tracksId);
        }

        if (this.idx === -1) {
            this.idx = startIdx ? startIdx - 1 : -1;
            this.nextTrack();
        }
    }

    public manualAddTrack(trackId: string): void {
        this.addedQueue.push(trackId);
        this.saveAddedQueue();
    }

    public async nextTrack(): Promise<void> {
        this.idx = (this.idx + 1) % this.queue.length;
        await this.setTrack(true, true);
    }

    public previousTrack(): void {
        this.idx = Math.max(this.idx - 1, 0);
        this.setTrack();
    }

    public repeat(): void {
        this.repeated = true;
        this.saveRepated();
    }

    public unrepeat(): void {
        this.repeated = false;
        this.saveRepated();
    }

    public shuffle(): void {
        if (this.shuffled) return;

        const currentId = this.queue[this.idx];
        this.savedQueue = [...this.queue];
        
        for (let i = this.queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }
        
        this.idx = this.queue.indexOf(currentId);
        this.shuffled = true;
        this.saveQueue();
    }

    public unshuffle(): void {
        if (!this.shuffled) return;

        const currentId = this.queue[this.idx];
        this.queue = [...this.savedQueue];
        this.idx = this.queue.indexOf(currentId);
        this.shuffled = false;
        this.saveQueue();
    }

    public clearQueue(): void {
        this.queue = [];
        this.savedQueue = [];
        this.idx = -1;
        this.shuffled = false;
    }

    private async setTrack(play: boolean = true, isNext?: boolean): Promise<void> {
        let trackId: string | null = null;
        
        if (isNext && this.addedQueue.length) {
            trackId = this.addedQueue.shift()!;
            this.saveAddedQueue();
        } else {
            trackId = this.queue[this.idx];
        }

        if (!trackId) return;

        const response = await API.getTrack(Number(trackId));
        const track = response.body;
        
        player.setTrack(track.file_url);
        player.setDuration(track.duration);
        this.currentTrack = track;
        this.saveCurrentTrack();

        if (TRACKS_STORAGE.getPlaying()?.id !== track.id) {
            Dispatcher.dispatch(new ACTIONS.TRACK_PLAY(track));
        }

        this.saveQueue();
    }

    public getCurrentTrackId(): string | null {
        return this.idx === -1 ? null : this.queue[this.idx];
    }

    public getCurrentTrack(): AppTypes.Track | null {
        return this.currentTrack;
    }

    public getCurrentTrackName(): string {
        return this.currentTrack?.title || 'none';
    }

    public getCurrentTrackArtist(): string {
        return this.currentTrack?.artists[0]?.title || 'none';
    }

    public getCurrentTrackImage(): string {
        return this.currentTrack?.thumbnail_url || 'none';
    }

    public getAristURL(): string {
        return this.currentTrack?.artists[0]?.artist_page;
    }
}

export default new TracksQueue();

