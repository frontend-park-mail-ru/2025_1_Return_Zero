import { Player } from './player';
import { TracksQueue } from './tracksQueue';
import { API } from 'utils/api';

export class Stream {
    id: number;
    duration: number;
    player: Player;
    tracksQueue: TracksQueue

    constructor(player: Player, tracksQueue: TracksQueue) {
        this.duration = 0;
        setInterval(() => {
            this.setDuration();
        }, 1000);

        this.player = player;
        this.tracksQueue = tracksQueue;
    }

    setDuration() {
        if (!this.player.audio.paused) {
            this.duration += 1;
        }
    }

    async createStream() {
        const trackIdNumber = Number(this.tracksQueue.getCurrentTrackId());
        const response = await API.createStream(trackIdNumber);
        this.id = response.body.id;
        this.duration = 0;
    }

    async updateStream() {
        if (!this.id) {
            return;
        }

        const response = await API.updateStream(this.id, this.duration);
        console.warn(this.id, this.duration);
    }
}

