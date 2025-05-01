import player from "common/player";

class DragProgressBar {
    private fullProgress: HTMLElement;
    private progress: HTMLElement;
    private circle: HTMLElement;
    private isDragging: boolean = false;
    private type: 'play' | 'volume';
    private unsubscribe: () => void;
    private lastPosition: number = 0;

    constructor(
        fullProgress: HTMLElement,
        progress: HTMLElement,
        circle: HTMLElement,
        type: 'play' | 'volume'
    ) {
        this.fullProgress = fullProgress;
        this.progress = progress;
        this.circle = circle;
        this.type = type;

        this.unsubscribe = player.subscribe(() => {
            requestAnimationFrame(() => this.updateVisuals());
        });

        this.initEvents();
    }

    private initEvents() {
        this.fullProgress.addEventListener('mousedown', this.startDragging);
        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.stopDragging);
        this.fullProgress.addEventListener('click', this.handleClick);
    }

    private updateVisuals() {
        if (this.isDragging) return;

        let position = 0;
        if (this.type === 'play') {
            position = player.audio.duration > 0 
                ? player.audio.currentTime / player.audio.duration 
                : 0;
        } else {
            position = player.audio.volume;
        }

        this.setVisualPosition(position);
    }

    private setVisualPosition(pos: number) {
        const safePos = Math.max(0, Math.min(1, pos));
        this.progress.style.width = `${safePos * 100}%`;
        this.circle.style.left = `${safePos * 100 - 1}%`;
    }

    private handleClick = (e: MouseEvent) => {
        if (this.isDragging) return;
        
        const rect = this.fullProgress.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.updatePlayer(pos);
    };

    private startDragging = () => {
        this.isDragging = true;
        this.fullProgress.classList.add('dragging');
    };

    private handleDrag = (e: MouseEvent) => {
        if (!this.isDragging) return;

        const rect = this.fullProgress.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.setVisualPosition(pos);
    };

    private stopDragging = (e: MouseEvent) => {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.fullProgress.classList.remove('dragging');

        const rect = this.fullProgress.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.updatePlayer(pos);
    };

    private updatePlayer(pos: number) {
        const safePos = Math.max(0, Math.min(1, pos));

        if (this.type === 'play') {
            const newTime = Math.floor(safePos * player.audio.duration);
            if (!isNaN(newTime)) {
                player.setCurrentTime(newTime);
                player.audio.currentTime = newTime
            }
        } else {
            const newVolume = safePos;
            player.setVolume(newVolume);
        }
    }

    destroy() {
        this.unsubscribe();
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.stopDragging);
        this.fullProgress.removeEventListener('mousedown', this.startDragging);
        this.fullProgress.removeEventListener('click', this.handleClick);
    }
}

export default DragProgressBar;
