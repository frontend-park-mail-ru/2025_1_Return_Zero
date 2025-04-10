export class Player {
    static instance: Player;
    audio: HTMLAudioElement;

    audioLevel: number;
    isPlaying: boolean;
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
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
    }

    async togglePlay(): Promise<void> {
        try {
            if (this.audio.paused) {
                await this.play();
                this.isPlaying = true;
            } else {
                this.pause();
                this.isPlaying = false;
            }
        } catch (error) {
            console.error('Playback error:', error);
            this.isPlaying = false;
        }
    }

    play(): Promise<void> {
        this.playPromise = this.audio.play();
        return this.playPromise
            .then(() => {
                this.isPlaying = true;
            })
            .catch((error) => {
                this.isPlaying = false;
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
        this.isPlaying = false;
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
