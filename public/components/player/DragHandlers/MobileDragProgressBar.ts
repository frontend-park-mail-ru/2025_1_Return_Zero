import PLAYER_STORAGE from "utils/flux/PlayerStorage";

import { ACTIONS } from "utils/flux/actions";
import Dispatcher from "libs/flux/Dispatcher";
import playerStorage from "utils/flux/PlayerStorage";
import { JAM_STORAGE } from "utils/flux/storages";
import { JamToggleError } from "common/errors";

type TouchEventLike = TouchEvent;

class MobileDragProgressBar {
    private fullProgress: HTMLElement;
    private progress: HTMLElement;
    private circle: HTMLElement;
    private isDragging: boolean = false;
    private type: 'play' | 'volume';

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
                this.setVisualPosition(playerStorage.currentTime / playerStorage.duration);
                break;
            case 'volume':
                this.setVisualPosition(playerStorage.audioLevel);
                break;
        }

        PLAYER_STORAGE.subscribe(this.onAction);

        this.initTouchEvents();
    }

    onAction = () => {
        requestAnimationFrame(() => this.updateVisuals());
    }

    onSetVolume = (volume: number) => {
        Dispatcher.dispatch(new ACTIONS.AUDIO_SET_VOLUME(volume));
    }

    onSetCurrentTime = (time: number) => {
        if (JAM_STORAGE.roomId && !JAM_STORAGE.isLeader) {
            Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
                message: JamToggleError,
                type: 'error'
            }));
            return;
        }

        Dispatcher.dispatch(new ACTIONS.AUDIO_SET_CURRENT_TIME(time));
        Dispatcher.dispatch(new ACTIONS.JAM_SEEK(time));
    }

    private initTouchEvents() {
        this.fullProgress.addEventListener('touchstart', this.startDragging, { passive: false });
        document.addEventListener('touchmove', this.handleDrag, { passive: false });
        document.addEventListener('touchend', this.stopDragging);
    }

    private updateVisuals() {
        if (this.isDragging) {
            this.circle.style.transform = 'scale(1.25)';
            this.circle.style.transition = 'transform 0.3s ease';
            return;
        }

        this.circle.style.transform = '';
        this.circle.style.transition = '';

        let position = 0;
        if (this.type === 'play') {
            position = playerStorage.duration > 0
                ? playerStorage.currentTime / playerStorage.duration
                : 0;
        } else {
            position = playerStorage.audioLevel;
        }

        this.setVisualPosition(position);
    }

    private setVisualPosition(pos: number) {
        const safePos = Math.max(0, Math.min(1, pos));
        this.progress.style.width = `${safePos * 100}%`;

        const offset = this.type === 'play' ? -1 : -3;
        this.circle.style.left = `${safePos * 100 + offset}%`;
    }

    private startDragging = (e: TouchEventLike) => {
        e.preventDefault();
        this.isDragging = true;
        this.fullProgress.classList.add('dragging');

        this.handleDrag(e);
    };

    private handleDrag = (e: TouchEventLike) => {
        if (!this.isDragging) return;
        e.preventDefault();

        const touch = e.touches[0];
        if (!touch) return;
        const clientX = touch.clientX;

        const rect = this.fullProgress.getBoundingClientRect();
        const pos = (clientX - rect.left) / rect.width;

        if (this.type === 'volume') {
            this.onSetVolume(Math.max(0, Math.min(1, pos)));
        }
        this.setVisualPosition(pos);
    };

    private stopDragging = (e: TouchEventLike) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.fullProgress.classList.remove('dragging');

        const touch = e.changedTouches[0];
        if (!touch) return;
        const clientX = touch.clientX;

        const rect = this.fullProgress.getBoundingClientRect();
        const pos = (clientX - rect.left) / rect.width;
        const safePos = Math.max(0, Math.min(1, pos));

        if (this.type === 'play') {
            const newTime = Math.floor(safePos * playerStorage.duration);
            if (!isNaN(newTime) && playerStorage.playedOnce) {
                this.onSetCurrentTime(newTime);
            }
        } else {
            this.onSetVolume(safePos);
        }
    };

    destroy() {
        this.fullProgress.removeEventListener('touchstart', this.startDragging);
        document.removeEventListener('touchmove', this.handleDrag);
        document.removeEventListener('touchend', this.stopDragging);
    }
}

export default MobileDragProgressBar;


