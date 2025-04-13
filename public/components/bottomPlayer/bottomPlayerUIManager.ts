import { Player } from 'components/player/player';
import DragProgressBar from 'components/player/draggProgress';
import { convertDuration } from 'utils/durationConverter';
import tracksQueue, { TracksQueue } from 'components/player/tracksQueue';

export class DomManager {
    playBtn: HTMLImageElement;
    nextBtn: HTMLImageElement;
    prevBtn: HTMLImageElement;
    shuffleBtn: HTMLImageElement;
    repeatBtn: HTMLImageElement;
    songImg: HTMLImageElement;
    songName: HTMLElement;
    songArtist: HTMLElement;
    playProgress: HTMLElement;
    progressBar: HTMLElement;
    progressCircle: HTMLElement;
    volumeProgress: HTMLElement;
    volumeBar: HTMLElement;
    volumeCircle: HTMLElement;
    currentSpan: HTMLElement;
    endSpan: HTMLElement;

    constructor(private root: HTMLElement) {
        this.initElements();
    }

    private initElements() {
        this.playBtn = this.getElement('#play');
        this.nextBtn = this.getElement('#next');
        this.prevBtn = this.getElement('#prev');
        this.shuffleBtn = this.getElement('#shuffle');
        this.repeatBtn = this.getElement('#repeat');
        this.songImg = this.getElement('#song-img');
        this.songName = this.getElement('#song-name');
        this.songArtist = this.getElement('#artist-name');
        this.playProgress = this.getElement('#play-progress');
        this.progressBar = this.playProgress.querySelector('.rectangle-prev')!;
        this.progressCircle = this.playProgress.querySelector('.circle')!;
        this.volumeProgress = this.getElement('#volume-progress');
        this.volumeBar = this.volumeProgress.querySelector('.rectangle-prev')!;
        this.volumeCircle = this.volumeProgress.querySelector('.circle')!;
        this.currentSpan = this.getElement('#current-span');
        this.endSpan = this.getElement('#end-span');
    }

    private getElement<T extends HTMLElement>(selector: string): T {
        return this.root.querySelector<T>(selector)!;
    }
}

export class DragHandler {
    playDragging: DragProgressBar;
    volumeDragging: DragProgressBar;

    constructor(
        private player: Player,
        private dom: DomManager
    ) {
        this.playDragging = new DragProgressBar(
            player,
            dom.playProgress,
            dom.progressBar,
            dom.progressCircle,
            'play'
        );

        this.volumeDragging = new DragProgressBar(
            player,
            dom.volumeProgress,
            dom.volumeBar,
            dom.volumeCircle,
            'volume'
        );
    }

    initPlayDrag() {
        this.initDragHandlers(this.dom.playProgress, this.playDragging);
    }

    initVolumeDrag() {
        this.initDragHandlers(this.dom.volumeProgress, this.volumeDragging);
    }

    private initDragHandlers(progress: HTMLElement, dragging: DragProgressBar) {
        progress.addEventListener('click', (e) =>
            dragging.handleProgressClick(e)
        );
        progress.addEventListener('mousedown', (e) =>
            dragging.startDragging(e)
        );
        document.addEventListener('mousemove', (e) => dragging.handleDrag(e));
        document.addEventListener('mouseup', (e) => dragging.stopDragging(e));
    }
}

export class ButtonStateHandler {
    constructor(
        private dom: DomManager,
        private tracksQueue: TracksQueue
    ) {}

    initHoverEffects() {
        this.initButtonHover(this.dom.nextBtn, 'player-next');
        this.initButtonHover(this.dom.prevBtn, 'player-prev');
    }

    private initButtonHover(btn: HTMLImageElement, baseName: string) {
        btn.addEventListener(
            'mouseover',
            () => (btn.src = `/static/img/${baseName}-hover.svg`)
        );
        btn.addEventListener(
            'mouseout',
            () => (btn.src = `/static/img/${baseName}.svg`)
        );
    }

    initShuffleHandler() {
        this.dom.shuffleBtn.addEventListener('mouseover', () =>
            this.handleShuffleHover()
        );
        this.dom.shuffleBtn.addEventListener('mouseout', () =>
            this.handleShuffleHoverOut()
        );
        this.dom.shuffleBtn.addEventListener('click', () =>
            this.toggleShuffle()
        );
    }

    private handleShuffleHover() {
        if (!this.tracksQueue.shuffled) {
            this.dom.shuffleBtn.src = '/static/img/player-shuffle-hover.svg';
        }
    }

    private handleShuffleHoverOut() {
        if (!this.tracksQueue.shuffled) {
            this.dom.shuffleBtn.src = '/static/img/player-shuffle.svg';
        }
    }

    private toggleShuffle() {
        if (this.tracksQueue.shuffled) {
            this.tracksQueue.unshuffle();
        } else {
            this.tracksQueue.shuffle();
        }

        this.checkShuffle();
    }

    checkShuffle() {
        this.dom.shuffleBtn.src = this.tracksQueue.shuffled
            ? '/static/img/player-shuffle-active.svg'
            : '/static/img/player-shuffle.svg';
    }

    initRepeatHandler() {
        this.dom.repeatBtn.addEventListener('mouseover', () =>
            this.handleRepeatHover()
        );
        this.dom.repeatBtn.addEventListener('mouseout', () =>
            this.handleRepeatHoverOut()
        );
        this.dom.repeatBtn.addEventListener('click', () => this.toggleRepeat());
    }

    private handleRepeatHover() {
        if (!this.tracksQueue.repeated) {
            this.dom.repeatBtn.src = '/static/img/player-repeat-hover.svg';
        }
    }

    private handleRepeatHoverOut() {
        if (!this.tracksQueue.repeated) {
            this.dom.repeatBtn.src = '/static/img/player-repeat.svg';
        }
    }

    private toggleRepeat() {
        if (this.tracksQueue.repeated) {
            this.tracksQueue.unrepeat();
        } else {
            this.tracksQueue.repeat();
        }

        this.checkRepeat();
    }

    checkRepeat() {
        this.dom.repeatBtn.src = this.tracksQueue.repeated
            ? '/static/img/player-repeat-active.svg'
            : '/static/img/player-repeat.svg';
    }
}
