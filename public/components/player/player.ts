export class Player {
    static instance: Player;
    audio: HTMLAudioElement;

    audioLevel: number;
    currentTime: number;
    duration: number;
    private playPromise: Promise<void> | null = null;

    constructor() {
        if (Player.instance) {
            return Player.instance;
        }
        Player.instance = this;

        this.audio = document.createElement('audio');
        this.audio.autoplay = true;
        this.initStates();
        this.setVolume(this.audioLevel);
    }
    
    private initStates() {
        try {
            this.audioLevel = Number(localStorage.getItem('audio-level'));
        } catch (error) {
            console.error('Failed to get audio level:', error);
            this.audioLevel = 0.5;
            try {
                localStorage.setItem('audio-level', String(this.audioLevel));
            } catch (error) {
                console.error('Failed to save audio level:', error);
            }
        }

        this.currentTime = 0;
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
            .then(() => {
            })
            .catch((error) => {
                throw error; // Rethrow the error
            });
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
        this.audio.volume = volume;

        try {
            localStorage.setItem('audio-level', String(this.audioLevel));
        } catch (error) {
            console.error('Failed to save audio level:', error);
        }
    }

    setCurrentTime(time: number) {
        this.currentTime = time;
    }

    setDuration(duration: number) {
        this.duration = duration;
    }
}

export default new Player();
