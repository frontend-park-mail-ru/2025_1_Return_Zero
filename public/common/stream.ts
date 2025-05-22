import { API } from 'utils/api';
import { USER_STORAGE } from 'utils/flux/storages';

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
        if (playerStorage.isPlaying) {
            this.duration += 1;
        }
    }

    async createStream() {
        const trackIdNumber = Number(playerStorage.currentTrackId);
        if (USER_STORAGE.getUser()) {
            const response = await API.createStream(trackIdNumber);
            this.id = response.body.id;
        }
        this.duration = 0;
    }

    async updateStream() {
        if (!this.id) {
            return;
        }

        if (USER_STORAGE.getUser()) {
            const response = await API.updateStream(this.id, this.duration);
            console.warn(this.id, this.duration);
        }
    }
}

