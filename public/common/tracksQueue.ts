import player from './player';
import { API } from 'utils/api';
import Dispatcher from 'libs/flux/Dispatcher';
import { ACTIONS } from 'utils/flux/actions';
import { TRACKS_STORAGE } from 'utils/flux/storages';

export class TracksQueue {
    static instance: TracksQueue;

    private queue: string[];
    private savedQueue: string[];
    private addedQueue: string[];
    private idx: number;
    private currentTrack: AppTypes.Track;
    shuffled: boolean;
    repeated: boolean;

    constructor() {
        if (TracksQueue.instance) {
            return TracksQueue.instance;
        }
        TracksQueue.instance = this;
        player.audio.addEventListener('ended', () => {
            if (this.repeated) {
                player.audio.currentTime = 0;
                if (player.audio.paused) {
                    player.togglePlay();
                }
                return;
            }
            this.nextTrack();
        });
        TRACKS_STORAGE.subscribe(this.onAction);

        this.queue = [];
        this.savedQueue = [];
        this.addedQueue = [];
        
        this.idx = -1;
        this.shuffled = false;
        this.repeated = false;

        try {
            if (localStorage.getItem('queue')) {
                this.queue = JSON.parse(localStorage.getItem('queue'));
                this.savedQueue = JSON.parse(
                    localStorage.getItem('saved-queue')
                );
                this.idx = Number(localStorage.getItem('queue-idx'));
                this.shuffled = JSON.parse(
                    localStorage.getItem('queue-shuffled')
                );
                this.repeated = JSON.parse(
                    localStorage.getItem('queue-repeated')
                );

                this.setTrack(false);
            } else {
                this.saveQueue();
                this.saveRepated();
            }
        } catch (error) {
            console.error('Failed to get queue:', error);
        }
    }

    onAction = (action: any): void => {
        switch (true) {
            case action instanceof ACTIONS.TRACK_PLAY:
                const currentTrack = TRACKS_STORAGE.getPlaying();

                if (!this.getCurrentTrack() || currentTrack.id != this.getCurrentTrack().id) {
                    const args = Object.keys(currentTrack.retriever_args).map(
                        key => key === 'limit' ? 1000 : currentTrack.retriever_args[key]
                    );
                    
                    currentTrack.retriever_func(...args).then((res: any) => {
                        const tracks = res.body;
                        this.clearQueue();
                        
                        const tracksIds = [];
                        let trackIdx = 0;
                        for (let i = 0; i < tracks.length; i++) {
                            const track = tracks[i];
                            if (track.id === currentTrack.id) {
                                trackIdx = i;
                            }
                            tracksIds.push(track.id.toString());
                        }

                        this.addTrack(tracksIds, trackIdx);
                    });
                }
                break;
            case action instanceof ACTIONS.TRACK_STATE_CHANGE:
                const state = TRACKS_STORAGE.getPlayingState();
                if (state && player.audio.paused) {
                    player.togglePlay();
                    return;
                }
                if (!state && !player.audio.paused) {
                    player.togglePlay();
                    return;
                }
                break;
        }
    }

    public addTrack(tracksId: string | string[], startIdx?: number) {
        if (Array.isArray(tracksId)) {
            for (const track of tracksId) {
                this.queue.push(track);
            }
        } else {
            this.queue.push(tracksId);
        }

        if (this.idx === -1) {
            if (startIdx) {
                this.idx = startIdx - 1;
            }

            if (this.repeated) {
                this.nextTrack('start');
                return;
            }

            this.nextTrack();
        }
    }

    public manualAddTrack(trackId: string) {
        this.addedQueue.push(trackId);
        this.saveAddedQueue();
    }

    private async saveQueue() {
        try {
            localStorage.setItem('queue', JSON.stringify(this.queue));
            localStorage.setItem(
                'saved-queue',
                JSON.stringify(this.savedQueue)
            );
            localStorage.setItem('queue-idx', String(this.idx));
            localStorage.setItem('queue-shuffled', String(this.shuffled));
        } catch (error) {
            console.error('Failed to save queue:', error);
        }
    }

    private async saveAddedQueue() {
        try {
            localStorage.setItem('added-queue', JSON.stringify(this.addedQueue));
        } catch (error) {
            console.error('Failed to save added queue:', error);
        }
    }

    private async saveRepated() {
        try {
            localStorage.setItem('queue-repeated', String(this.repeated));
        } catch (error) {
            console.error('Failed to save queue:', error);
        }
    }

    private async setTrack(play: boolean = true, isNext?: boolean) {
        let response;
        if (isNext && this.addedQueue.length) {
            response = (await API.getTrack(Number(this.addedQueue[0])))
            .body;
            this.addedQueue.splice(0, 1);
        } else {
            response = (await API.getTrack(Number(this.queue[this.idx])))
            .body;
        }

        player.setTrack(response.file_url);
        player.setDuration(response.duration);

        const track: AppTypes.Track = response;
        this.currentTrack = track;
        
        const currentTrack = TRACKS_STORAGE.getPlaying();
        if (currentTrack && this.getCurrentTrack().id != currentTrack.id) {
            Dispatcher.dispatch(new ACTIONS.TRACK_PLAY(track));
        }
        if (!currentTrack) {
            Dispatcher.dispatch(new ACTIONS.TRACK_PLAY(track));
            Dispatcher.dispatch(new ACTIONS.TRACK_STATE_CHANGE({playing: false}));
        }

        this.saveQueue();
    }

    public async nextTrack(source?: string) {
        if (source || !this.repeated) {
            this.idx = (this.idx + 1) % this.queue.length;
            await this.setTrack(true, true);
            return;
        }

        await this.setTrack(true, true);
    }

    public previousTrack() {
        this.idx = Math.max(this.idx - 1, 0);
        this.setTrack();
    }

    public repeat() {
        this.repeated = true;
        this.saveRepated();
    }

    public unrepeat() {
        this.repeated = false;
        this.saveRepated();
    }

    public shuffle() {
        if (this.shuffled) return;

        const currentTrack = this.queue[this.idx];
        for (let i = 0; i < this.queue.length; i++) {
            this.savedQueue[i] = this.queue[i];
        }

        for (let i = 0; i < this.queue.length; i++) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }

        this.idx = this.queue.indexOf(currentTrack);
        this.shuffled = true;

        this.saveQueue();
    }

    public unshuffle() {
        if (!this.shuffled) return;

        const currentTrack = this.queue[this.idx];
        for (let i = 0; i < this.queue.length; i++) {
            this.queue[i] = this.savedQueue[i];
        }

        this.idx = this.queue.indexOf(currentTrack);
        this.shuffled = false;

        this.saveQueue();
    }

    public getCurrentTrackId(): string | null {
        if (this.idx == -1) {
            return null;
        }

        return this.queue[this.idx];
    }

    public getCurrentTrack(): AppTypes.Track | null {
        return this.currentTrack;
    }

    public getCurrentTrackName(): string {
        return this.currentTrack?.title || 'none';
    }

    public getCurrentTrackArtist(): string {
        return this.currentTrack?.artists[0].title || 'none';
    }

    public getCurrentTrackImage(): string {
        return this.currentTrack?.thumbnail_url || 'none';
    }

    public clearQueue() {
        this.queue = [];
        this.savedQueue = [];
        this.idx = -1;
        this.shuffled = false;
        // this.repeated = false;
    }
}

export default new TracksQueue();

