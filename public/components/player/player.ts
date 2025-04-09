export class Player {
    static instance: Player;
    audio: HTMLAudioElement;

    audioLevel: number;
    isPlaying: boolean;
    currentTime: number;
    duration: number;

    constructor() {
        if (Player.instance) {
            return Player.instance;
        }
        Player.instance = this;

        this.audio = document.createElement('audio');
        this.initStates();
        this.setVolume(this.audioLevel);
    }
    
    initStates() {
        this.audioLevel = 0.5;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
    }

    togglePlay() {
        if (this.audio.paused) {
            this.play()
        } else {
            this.pause();
        }
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    setTrack(src: string) {
        this.audio.src = src;
    }

    setVolume(volume: number) {
        this.audioLevel = volume;
        this.audio.volume = volume;
    }

    setCurrentTime(time: number) {
        this.currentTime = time;
    }

    setDuration(duration: number) {
        this.duration = duration;
    }
}

export default new Player();
