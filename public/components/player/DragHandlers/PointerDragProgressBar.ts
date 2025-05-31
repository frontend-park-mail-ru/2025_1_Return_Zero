import PLAYER_STORAGE from "utils/flux/PlayerStorage";
import { ACTIONS } from "utils/flux/actions";
import Dispatcher from "libs/flux/Dispatcher";
import playerStorage from "utils/flux/PlayerStorage";
import { JAM_STORAGE } from "utils/flux/storages";
import { JamToggleError } from "common/errors";

type ProgressType = 'play' | 'volume';

class PointerDragProgressBar {
    private fullProgress: HTMLElement;
    private progress: HTMLElement;
    private circle: HTMLElement;
    private isDragging: boolean = false;
    private type: ProgressType;

    constructor(
        fullProgress: HTMLElement,
        progress: HTMLElement,
        circle: HTMLElement,
        type: ProgressType
    ) {
        this.fullProgress = fullProgress;
        this.progress = progress;
        this.circle = circle;
        this.type = type;

        // Устанавливаем начальную позицию визуально
        switch (this.type) {
            case 'play':
                this.setVisualPosition(playerStorage.currentTime / playerStorage.duration);
                break;
            case 'volume':
                this.setVisualPosition(playerStorage.audioLevel);
                break;
        }

        // Подписываемся на обновления storage
        PLAYER_STORAGE.subscribe(this.onAction);

        // Вешаем Pointer Events
        this.initPointerEvents();
    }

    private onAction = () => {
        requestAnimationFrame(() => this.updateVisuals());
    }

    private onSetVolume(volume: number) {
        Dispatcher.dispatch(new ACTIONS.AUDIO_SET_VOLUME(volume));
    }

    private onSetCurrentTime(time: number) {
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

    private initPointerEvents() {
        // pointerdown на самом прогресс-баре
        this.fullProgress.addEventListener('pointerdown', this.handlePointerDown as EventListener);
        // pointermove и pointerup (или pointercancel) вешаем на документ,
        // чтобы отловить, даже если указатель вышел за пределы элемента
        document.addEventListener('pointermove', this.handlePointerMove as EventListener);
        document.addEventListener('pointerup', this.handlePointerUp as EventListener);
        document.addEventListener('pointercancel', this.handlePointerUp as EventListener);
        
        // Для клика (без перетаскивания) тоже можем использовать pointerup,
        // но чтобы отделить клик от drag, проверяем isDragging=false.
        this.fullProgress.addEventListener('click', this.handleClick as EventListener);
    }

    private updateVisuals() {
        if (this.isDragging) {
            // Если мы тащим, чуть увеличиваем круг для фидбэка
            this.circle.style.transform = 'scale(1.25)';
            this.circle.style.transition = 'transform 0.3s ease';
            return;
        }
        // Сбрасываем трансформацию после завершения drag
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

        // Смещения для разных типов (чтобы круг центрировался правильно)
        const offset = this.type === 'play' ? -1 : -3;
        this.circle.style.left = `${safePos * 100 + offset}%`;
    }

    private getRelativePosition(clientX: number): number {
        const rect = this.fullProgress.getBoundingClientRect();
        return (clientX - rect.left) / rect.width;
    }

    private handleClick = (e: MouseEvent) => {
        // При перетаскивании клик игнорируем
        if (this.isDragging) return;

        const pos = this.getRelativePosition(e.clientX);
        this.updatePlayer(pos);
    }

    private handlePointerDown = (e: PointerEvent) => {
        // Чтобы не срабатывать и мышь, и тач, делаем preventDefault
        e.preventDefault();

        this.isDragging = true;
        this.fullProgress.classList.add('dragging');

        // Обрабатываем «первый» кадр drag сразу
        const pos = this.getRelativePosition(e.clientX);
        if (this.type === 'volume') {
            // Если это ползунок громкости, сразу меняем громкость
            this.onSetVolume(Math.max(0, Math.min(1, pos)));
        }
        this.setVisualPosition(pos);
    }

    private handlePointerMove = (e: PointerEvent) => {
        if (!this.isDragging) return;
        e.preventDefault();

        const pos = this.getRelativePosition(e.clientX);
        if (this.type === 'volume') {
            this.onSetVolume(Math.max(0, Math.min(1, pos)));
        }
        this.setVisualPosition(pos);
    }

    private handlePointerUp = (e: PointerEvent) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.fullProgress.classList.remove('dragging');

        const pos = this.getRelativePosition(e.clientX);
        this.updatePlayer(pos);
    }

    private updatePlayer(pos: number) {
        const safePos = Math.max(0, Math.min(1, pos));
        if (this.type === 'play') {
            const newTime = Math.floor(safePos * playerStorage.duration);
            if (!isNaN(newTime) && playerStorage.playedOnce) {
                this.onSetCurrentTime(newTime);
            }
        } else {
            this.onSetVolume(safePos);
        }
    }

    public destroy() {
        PLAYER_STORAGE.unsubscribe(this.onAction);

        this.fullProgress.removeEventListener('pointerdown', this.handlePointerDown as EventListener);
        document.removeEventListener('pointermove', this.handlePointerMove as EventListener);
        document.removeEventListener('pointerup', this.handlePointerUp as EventListener);
        document.removeEventListener('pointercancel', this.handlePointerUp as EventListener);
        this.fullProgress.removeEventListener('click', this.handleClick as EventListener);
    }
}

export default PointerDragProgressBar;

