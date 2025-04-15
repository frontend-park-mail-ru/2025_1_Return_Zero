import { Player } from 'components/player/player';

class DragProgressBar {
    player: Player;
    fullProgress: HTMLElement;
    progress: HTMLElement;
    circle: HTMLElement;
    isDragging: boolean;
    type: string;

    constructor(
        player: Player,
        fullProgress: HTMLElement,
        progress: HTMLElement,
        circle: HTMLElement,
        type: string
    ) {
        this.player = player;
        this.fullProgress = fullProgress;
        this.progress = progress;
        this.circle = circle;
        this.isDragging = false;
        this.type = type;

        if (this.type == 'volume') {
            this.updateProgress();
        }
    }

    stopDragging(e: MouseEvent) {
        if (this.isDragging) {
            this.isDragging = false;
            this.fullProgress.classList.remove('dragging');
            const rect = this.fullProgress.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;

            if (this.type == 'play') {
                this.player.audio.currentTime =
                    pos * this.player.audio.duration;
            }
            if (this.type == 'volume') {
                this.player.setVolume(Math.max(0, Math.min(1, pos)));
            }
        }
    }

    handleDrag(e: MouseEvent) {
        if (this.isDragging) {
            const rect = this.fullProgress.getBoundingClientRect();
            let pos = (e.clientX - rect.left) / rect.width;
            pos = Math.max(0, Math.min(1, pos));
            this.progress.style.width = `${pos * 100}%`;
            this.circle.style.left = `${pos * 100 - 1}%`;

            if (this.type == 'volume') {
                this.player.setVolume(Math.max(0, Math.min(1, pos)));
            }
        }
    }

    startDragging(e: MouseEvent) {
        this.isDragging = true;
        this.fullProgress.classList.add('dragging');
    }

    handleProgressClick(e: MouseEvent) {
        if (!this.isDragging) {
            const rect = this.fullProgress.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;

            if (this.type == 'play') {
                this.player.audio.currentTime =
                    pos * this.player.audio.duration;
            }
            if (this.type == 'volume') {
                this.player.setVolume(Math.max(0, Math.min(1, pos)));
            }
        }
    }

    updateProgress() {
        if (!this.isDragging && this.type == 'play' && this.player.duration) {
            const progress =
                (this.player.audio.currentTime / this.player.duration) * 100;
            this.progress.style.width = `${progress}%`;
            this.circle.style.left = `${progress - 1}%`;

            this.player.setCurrentTime(this.player.audio.currentTime);
        }
        if (!this.isDragging && this.type == 'volume') {
            const volume = this.player.audio.volume * 100;
            this.progress.style.width = `${volume}%`;
            this.circle.style.left = `${volume - 1}%`;

            this.player.setVolume(volume / 100);
        }
    }
}

export default DragProgressBar;
