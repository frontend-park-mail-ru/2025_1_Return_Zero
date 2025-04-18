import player, { Player } from 'components/player/player';
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
    playerCallback: (track: MusicUnit, play: boolean) => void;

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
        this.playerCallback = () => {};

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

    setPlayerCallback(callback: (track: MusicUnit) => void) {
        this.playerCallback = callback;
    }

    private callPlayerCallback(track: MusicUnit, play: boolean = true) {
        if (typeof this.playerCallback === 'function') {
            try {
                this.playerCallback(track, play);
            } catch (e) {
                console.error('Error in player callback:', e);
            }
        } else {
            console.error('Player callback is not a function');
        }
    }

    addTrack(tracks: string | string[], start?: number) {
        if (Array.isArray(tracks)) {
            for (const track of tracks) {
                this.queue.push(track);
            }
        } else {
            this.queue.push(tracks);
        }

        if (this.idx === -1) {
            if (start) {
                this.idx = start - 1;
            }

            if (this.repeated) {
                this.nextTrack('start');
                return;
            }

            this.nextTrack();
        }
    }

    switchToTrack(trackIdx: string) { 
        let i = 0;
        for (const idx of this.queue) {
            if (idx == trackIdx) {
                this.idx = i - 1;
                this.nextTrack();
                return;
            }
            i++;
        }
    }

    async saveQueue() {
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

    async saveRepated() {
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

        this.callPlayerCallback(track, play);
        this.saveQueue();
    }

    nextTrack(source?: string) {
        if (source || !this.repeated) {
            this.idx = (this.idx + 1) % this.queue.length;
            this.setTrack();
            return;
        }

        this.setTrack();
    }

    previousTrack() {
        this.idx = Math.max(this.idx - 1, 0);
        this.setTrack();
    }

    repeat() {
        this.repeated = true;
        this.saveRepated();
    }

    unrepeat() {
        this.repeated = false;
        this.saveRepated();
    }

    shuffle() {
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

    unshuffle() {
        if (!this.shuffled) return;

        const currentTrack = this.queue[this.idx];
        for (let i = 0; i < this.queue.length; i++) {
            this.queue[i] = this.savedQueue[i];
        }

        this.idx = this.queue.indexOf(currentTrack);
        this.shuffled = false;

        this.saveQueue();
    }

    getCurrentTrackId(): string | null {
        if (this.idx == -1) {
            return null;
        }

        return this.queue[this.idx];
    }

    getCurrentTrack(): MusicUnit | null {
        return this.currentTrack;
    }

    clearQueue() {
        this.queue = [];
        this.savedQueue = [];
        this.idx = -1;
        this.shuffled = false;
        // this.repeated = false;
    }
}

export default new TracksQueue();
