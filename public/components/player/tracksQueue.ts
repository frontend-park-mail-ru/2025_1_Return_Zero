import player, { Player } from "components/player/player";

export type MusicUnit = {
    name: string;
    artist: string;
    duration: number;
    image: string;
    src: string;
}

export class TracksQueue {
    static instance: TracksQueue;
    playerCallback: (track: MusicUnit) => void;

    private queue: MusicUnit[];
    private savedQueue: MusicUnit[];
    private idx: number;
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
    }

    setPlayerCallback(callback: (track: MusicUnit) => void) {
        this.playerCallback = callback;
    }

    private callPlayerCallback(track: MusicUnit) {
        if (typeof this.playerCallback === 'function') {
            try {
                this.playerCallback(track);
            } catch (e) {
                console.error('Error in player callback:', e);
            }
        } else {
            console.error('Player callback is not a function');
        }
    }

    addTrack(tracks: MusicUnit | MusicUnit[]) {
        if (Array.isArray(tracks)) {
            for (const track of tracks) {
                this.queue.push(track);
            }
        } else {
            this.queue.push(tracks);
        }

        if (this.idx === -1) {
            this.nextTrack();
        }
    }

    private setTrack() {
        const currentTrack = this.queue[this.idx];

        console.error(currentTrack.name);
        player.setTrack(currentTrack.src);
        player.setDuration(currentTrack.duration);

        this.callPlayerCallback(currentTrack);
    }

    nextTrack(source?: string) {
        if (source) {
            this.idx = (this.idx + 1) % this.queue.length;
            this.setTrack();
            return;
        }

        if (this.repeated) {
            this.setTrack();
            return;
        }

        this.idx = (this.idx + 1) % this.queue.length;
        this.setTrack();
    }

    previousTrack() {
        this.idx = Math.max(this.idx - 1, 0);
        this.setTrack();
    }


    repeat() {
        this.repeated = true;
    }

    unrepeat() {
        this.repeated = false;
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
    }

    unshuffle() {
        if (!this.shuffled) return;

        const currentTrack = this.queue[this.idx];
        for (let i = 0; i < this.queue.length; i++) {
            this.queue[i] = this.savedQueue[i];
        }

        this.idx = this.queue.indexOf(currentTrack);
        this.shuffled = false;
    }

    getCurrentTrack() {
        if (this.idx == -1) {
            return null;
        }

        return this.queue[this.idx];
    }


    clearQueue() {
        this.queue = [];
        this.idx = -1;
        this.shuffled = false;
        this.repeated = false;
    }
}

export default new TracksQueue();
