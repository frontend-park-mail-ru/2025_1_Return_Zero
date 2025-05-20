import { API } from 'utils/api';

import playerStorage from "utils/flux/PlayerStorage";

export class Stream {
    id: number;
    duration: number;

    constructor() {
        this.duration = 0;
        setInterval(() => {
            this.setDuration();
        }, 1000);
    }

    setDuration() {
        if (!playerStorage.audio.paused) {
            this.duration += 1;
        }
    }

    async createStream() {
        const trackIdNumber = Number(playerStorage.currentTrackId);
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

