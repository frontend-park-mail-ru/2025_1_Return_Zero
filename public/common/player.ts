import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { TRACKS_STORAGE } from "utils/flux/storages";
import tracksQueue from "./tracksQueue";

export class Player {
    static instance: Player;
    audio: HTMLAudioElement;

    audioLevel: number;
    prevAudioLevel: number;
    currentTime: number;
    duration: number;
    playedOnce: boolean;
    private playPromise: Promise<void> | null = null;

    // Observable
    private subscribers: ((player: Player) => void)[] = [];

    subscribe(callback: (player: Player) => void) {
        this.subscribers.push(callback);
        return () => this.unsubscribe(callback);
    }

    unsubscribe(callback: (player: Player) => void) {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    private notify() {
        this.subscribers.forEach(callback => callback(this));
    }

    constructor() {
        if (Player.instance) {
            return Player.instance;
        }
        Player.instance = this;

        this.audio = document.createElement('audio');
        this.initStates();

        this.audio.ontimeupdate = () => {
            this.setCurrentTime(this.audio.currentTime); // notify
            this.changeTrackState();
        };
    }

    async initStates() {
        try {
            this.audioLevel = Number(localStorage.getItem('audio-level'));
            this.prevAudioLevel = this.audioLevel;
            this.audio.currentTime = Number(
                localStorage.getItem('audio-current-time')
            );

            if (!('audio-level' in localStorage)) {
                this.audioLevel = 0.5;
                this.prevAudioLevel = 0.5;
            }

        } catch (error) {
            console.error('Failed to get states for audio:', error);
            try {
                localStorage.setItem('audio-level', String(this.audioLevel));
            } catch (error) {
                console.error('Failed to save audio level:', error);
            }
        }

        this.setVolume(this.audioLevel);
        this.setCurrentTime(this.currentTime);
        this.playedOnce = false;
    }

    changeTrackState() {
        const state = TRACKS_STORAGE.getPlayingState();
        
        if (this.audio.paused && state) {
            Dispatcher.dispatch(new ACTIONS.TRACK_STATE_CHANGE({playing: false}));
        } 
        if (!this.audio.paused && !state) {
            Dispatcher.dispatch(new ACTIONS.TRACK_STATE_CHANGE({playing: true}));
        }
    }
    
    async togglePlay(): Promise<void> {
        try {
            if (this.audio.paused) {
                await this.play();
            } else {
                this.pause();
            }

            this.playedOnce = true;
            this.notify();
        } catch (error) {
            // console.error('Playback error:', error);
            // this.pause();
        }
    }

    async play(): Promise<void> {
        this.playPromise = this.audio.play();
        return this.playPromise
            .then(() => {})
            .catch((error) => {
                throw error; // Rethrow the error
            });
    }

    toggleMute() {
        if (this.audioLevel > 0.00001) {
            this.prevAudioLevel = this.audioLevel;
            this.setVolume(0);
            return;
        } 
        if (this.prevAudioLevel) {
            this.setVolume(this.prevAudioLevel);
        } else {
            this.setVolume(0.1);
        }
    }

    pause(): void {
        if (this.playPromise) {
            this.playPromise.catch(() => {
                // Ignore
            });
        }
        this.audio.pause();

        this.notify(); 
    }

    setTrack(src: string) {
        this.audio.src = src;

        if (this.audio.paused) {
            this.togglePlay();
        }

        this.notify(); 
    }

    setVolume(volume: number) {
        this.audioLevel = volume;
        this.audio.volume = this.audioLevel;

        this.notify(); 

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
        this.currentTime = time;

        this.notify(); 

        if (this.playedOnce) {
            this.SaveCurrentTime();
        }
    }

    getCurrentTime() {
        if (this.currentTime)
            return this.currentTime;
        return 0;
    }

    getDuration() {
        if (this.duration)
            return this.duration;
        return 0;
    }

    getVolume() {
        return this.audioLevel;
    }

    async SaveCurrentTime() {
        try {
            localStorage.setItem(
                'audio-current-time',
                String(this.currentTime)
            );
        } catch (error) {
            console.error('Failed to save audio current time:', error);
        }
    }

    setDuration(duration: number) {
        this.duration = duration;

        this.notify(); 
    }
}

export default new Player();

