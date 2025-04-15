export class Player {
    static instance: Player;
    audio: HTMLAudioElement;

    audioLevel: number;
    prevAudioLevel: number;
    currentTime: number;
    duration: number;
    private playPromise: Promise<void> | null = null;

    constructor() {
        if (Player.instance) {
            return Player.instance;
        }
        Player.instance = this;

        this.audio = document.createElement('audio');
        this.initStates();
        this.setVolume(this.audioLevel);
        this.setCurrentTime(this.currentTime);
    }

    private initStates() {
        try {
            this.audioLevel = Number(localStorage.getItem('audio-level'));
            this.prevAudioLevel = this.audioLevel;
            this.audio.currentTime = Number(
                localStorage.getItem('audio-current-time')
            );
        } catch (error) {
            console.error('Failed to get states for audio:', error);
            this.audioLevel = 0.5;
            this.prevAudioLevel = 0.5;
            try {
                localStorage.setItem('audio-level', String(this.audioLevel));
            } catch (error) {
                console.error('Failed to save audio level:', error);
            }
        }

        this.duration = 0;
    }

    async togglePlay(): Promise<void> {
        try {
            if (this.audio.paused) {
                await this.play();
            } else {
                this.pause();
            }
        } catch (error) {
            console.error('Playback error:', error);
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
        }
    }

    pause(): void {
        if (this.playPromise) {
            this.playPromise.catch(() => {
                // Ignore
            });
        }
        this.audio.pause();
    }

    setTrack(src: string) {
        this.audio.src = src;
    }

    setVolume(volume: number) {
        this.audioLevel = volume;
        this.audio.volume = this.audioLevel;

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
        this.SaveCurrentTime();
    }

    getCurrentTime() {
        return this.currentTime;
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
    }
}

export default new Player();
