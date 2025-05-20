import PLAYER_STORAGE from "utils/flux/PlayerStorage";

import { ACTIONS } from "utils/flux/actions";
import Dispatcher from "libs/flux/Dispatcher";
import playerStorage from "utils/flux/PlayerStorage";

class DragProgressBar {
    private fullProgress: HTMLElement;
    private progress: HTMLElement;
    private circle: HTMLElement;
    private isDragging: boolean = false;
    private type: 'play' | 'volume';
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

        switch (this.type) {
            case 'play':
                this.setVisualPosition(playerStorage.audio.currentTime / playerStorage.audio.duration);
                break;
            case 'volume':
                this.setVisualPosition(playerStorage.audioLevel);
                break;
        }

        PLAYER_STORAGE.subscribe(this.onAction);

        this.initEvents();
    }

    onAction = () => {
        requestAnimationFrame(() => this.updateVisuals());
    }

    onSetVolume = (volume: number) => {
        Dispatcher.dispatch(new ACTIONS.AUDIO_SET_VOLUME(volume));
    }

    onSetCurrentTime = (time: number) => {
        Dispatcher.dispatch(new ACTIONS.AUDIO_SET_CURRENT_TIME(time));
    }

    private initEvents() {
        this.fullProgress.addEventListener('mousedown', this.startDragging);
        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.stopDragging);
        this.fullProgress.addEventListener('click', this.handleClick);
    }

    private updateVisuals() {
        if (this.isDragging) {
            this.circle.style.transform = 'scale(1.25)';
            this.circle.style.transition = 'transition: transform 0.3s ease';
            return;
        }

        this.circle.style.transform = '';
        this.circle.style.transition = '';

        let position = 0;
        if (this.type === 'play') {
            position = playerStorage.audio.duration > 0 
                ? playerStorage.audio.currentTime / playerStorage.audio.duration 
                : 0;
        } else {
            position = playerStorage.audioLevel;
        }

        this.setVisualPosition(position);
    }

    private setVisualPosition(pos: number) {
        const safePos = Math.max(0, Math.min(1, pos));
        this.progress.style.width = `${safePos * 100}%`;

        switch (this.type) {
            case 'play':
                this.circle.style.left = `${safePos * 100 - 1}%`;
                break;
            case 'volume':
                this.circle.style.left = `${safePos * 100 - 3}%`;
                break;
        }
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
        
        if (this.type === 'volume') {
            this.onSetVolume(Math.max(0, Math.min(1, pos)));
        }

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
            const newTime = Math.floor(safePos * playerStorage.audio.duration);
            if (!isNaN(newTime) && playerStorage.playedOnce) {
                this.onSetCurrentTime(newTime);
                playerStorage.audio.currentTime = newTime;
            }
        } else {
            const newVolume = safePos;
            this.onSetVolume(newVolume);
        }
    }

    destroy() {
        PLAYER_STORAGE.unsubscribe(this.onAction);
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.stopDragging);
        this.fullProgress.removeEventListener('mousedown', this.startDragging);
        this.fullProgress.removeEventListener('click', this.handleClick);
    }
}

export default DragProgressBar;




