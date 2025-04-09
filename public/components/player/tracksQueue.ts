import player, { Player } from "components/player/player";

export type MusicUnit = {
    name: string;
    artist: string;
    duration: number;
    src: string;
}

export class TracksQueue {
    static instance: TracksQueue;
    playerCallback: (track: MusicUnit) => void;

    queue: MusicUnit[];
    idx: number;

    constructor() {
        if (TracksQueue.instance) {
            return TracksQueue.instance;
        }
        TracksQueue.instance = this;
        player.audio.addEventListener('ended', () => this.nextTrack());

        this.queue = [];
        this.idx = -1;
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

    setTrack() {
        const currentTrack = this.queue[this.idx];

        console.error(currentTrack.name);
        player.setTrack(currentTrack.src);
        player.setDuration(currentTrack.duration);

        this.callPlayerCallback(currentTrack);
    }

    nextTrack() {
        console.error("nextTrack");
        this.idx = (this.idx + 1) % this.queue.length;
        this.setTrack();
    }

    previousTrack() {
        this.idx = Math.max(this.idx - 1, 0);
        this.setTrack();
    }

    clearQueue() {
        this.queue = [];
        this.idx = -1;
    }
}

export default new TracksQueue();
