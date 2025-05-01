import player from './player';
import { API } from 'utils/api';

export type MusicUnit = {
    name: string;
    artist: string;
    duration: number;
    image: string;
    src: string;
    id: number;
};

export class TracksQueue {
    static instance: TracksQueue;

    private queue: string[];
    private savedQueue: string[];
    private idx: number;
    private currentTrack: MusicUnit;
    shuffled: boolean;
    repeated: boolean;

    constructor() {
        if (TracksQueue.instance) {
            return TracksQueue.instance;
        }
        TracksQueue.instance = this;
        player.audio.addEventListener('ended', () => this.nextTrack());

        this.queue = [];
        this.savedQueue = [];
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

    private async saveRepated() {
        try {
            localStorage.setItem('queue-repeated', String(this.repeated));
        } catch (error) {
            console.error('Failed to save queue:', error);
        }
    }

    private async setTrack(play: boolean = true) {
        const response = (await API.getTrack(Number(this.queue[this.idx])))
            .body;

        console.log(`Playing: ${response.title}`);
        player.setTrack(response.file_url);
        player.setDuration(response.duration);

        const track: MusicUnit = {
            name: response.title,
            artist: response.artists[0].title,
            duration: response.duration,
            image: response.thumbnail_url,
            src: response.file_url,
            id: response.id,
        };
        this.currentTrack = track;

        this.saveQueue();
    }

    public async nextTrack(source?: string) {
        if (source || !this.repeated) {
            this.idx = (this.idx + 1) % this.queue.length;
            this.setTrack();
            return;
        }

        await this.setTrack();
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

    public getCurrentTrack(): MusicUnit | null {
        return this.currentTrack;
    }

    public getCurrentTrackName(): string {
        return this.currentTrack?.name || 'none';
    }

    public getCurrentTrackArtist(): string {
        return this.currentTrack?.artist || 'none';
    }

    public getCurrentTrackImage(): string {
        return this.currentTrack?.image || 'none';
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

