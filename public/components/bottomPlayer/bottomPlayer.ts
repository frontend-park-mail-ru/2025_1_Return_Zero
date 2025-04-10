import '../../../public/audio/audio.mp3';
import '../../../public/audio/audio2.mp3';
import '../../../public/audio/audio3.mp3';
import '../../../public/audio/audio4.mp3';

import './bottomPlayer.precompiled.js';
import './bottomPlayer.scss';

import player, { Player } from "components/player/player";
import tracksQueue, { TracksQueue } from 'components/player/tracksQueue';
import { MusicUnit } from 'components/player/tracksQueue';
import { convertDuration } from "utils/durationConverter";
import { ButtonStateHandler, DomManager, DragHandler } from './bottomPlayerUIManager';

import { Component } from '../../libs/Component.ts';

export class BottomPlayer extends Component {
    player: Player;
    tracksQueue: TracksQueue;
    
    protected static BASE_ELEMENT = 'div';
    // @ts-ignore
    static template = Handlebars.templates['bottomPlayer.hbs'];

    private domManager: DomManager;
    private eventManager: EventManager;
    private buttonStateHandler: ButtonStateHandler;
    private timeManager: TimeManager;
    private dragHandler: DragHandler;

    protected init() {
        this.element.classList.add('player');
        this.element.id = 'player';
    }

    protected build() {
        this.element.innerHTML = '';
        // @ts-ignore
        this.element.insertAdjacentHTML('beforeend', BottomPlayer.template({}));

        this.player = player;
        this.tracksQueue = tracksQueue;
        this.tracksQueue.setPlayerCallback((track: MusicUnit) => this.switchingTrack(track));

        this.domManager = new DomManager(this.element);
        this.timeManager = new TimeManager(this.player, this.domManager);
        this.dragHandler = new DragHandler(this.player, this.domManager);
        this.buttonStateHandler = new ButtonStateHandler(this.domManager, this.tracksQueue);
        this.eventManager = new EventManager(
            this.player,
            this.tracksQueue,
            this.domManager, 
            this.dragHandler,
            this.buttonStateHandler,
            this
        );
    }

    setDuration(duration: number) {
        this.domManager.endSpan.innerHTML = convertDuration(duration);
    }

    setCurrentDuration() {
        const duration = this.player.audio.currentTime || 0;
        this.domManager.currentSpan.innerHTML = convertDuration(duration);
    }

    async togglePlay() {
        try {
            await this.player.togglePlay();
            await this.setPlayButtonState();
        } catch (error) {
            console.error('Ошибка воспроизведения:', error);
            this.domManager.playBtn.src = "/static/img/player-play.svg";
        }
    }
    
    async setPlayButtonState() {
        this.domManager.playBtn.src = this.player.audio.paused 
            ? "/static/img/player-play.svg" 
            : "/static/img/player-pause.svg";
    }

    switchingTrack(track: MusicUnit) {
        this.domManager.songImg.src = track.image;
        this.domManager.songName.innerHTML = track.name;
        this.domManager.songArtist.innerHTML = track.artist;
        this.setDuration(track.duration);
        this.togglePlay();
    }
}


class EventManager {
    private handlers: Array<() => void> = [];

    constructor(
        private player: Player,
        private tracksQueue: TracksQueue,
        private dom: DomManager,
        private dragHandler: DragHandler,
        private buttonStateHandler: ButtonStateHandler,
        private bottomPlayer: BottomPlayer
    ) {
        this.initPlayerEvents();
        this.initButtonEvents();
        this.initDragEvents();
        this.initImageEvents();
    }

    private initPlayerEvents() {
        const timeUpdateHandler = () => {
            this.dragHandler.playDragging.updateProgress();
            this.bottomPlayer.setCurrentDuration();
        };
        
        this.player.audio.addEventListener('timeupdate', timeUpdateHandler);
        this.handlers.push(() => {
            this.player.audio.removeEventListener('timeupdate', timeUpdateHandler);
        });

        const volumeChangeHandler = () => this.dragHandler.volumeDragging.updateProgress();
        this.player.audio.addEventListener('volumechange', volumeChangeHandler);
        this.handlers.push(() => {
            this.player.audio.removeEventListener('volumechange', volumeChangeHandler);
        });
    }

    private initButtonEvents() {
        this.dom.playBtn.addEventListener('click', () => this.bottomPlayer.togglePlay());
        this.dom.nextBtn.addEventListener('click', () => this.tracksQueue.nextTrack('nextBtn'));
        this.dom.prevBtn.addEventListener('click', () => this.tracksQueue.previousTrack());
    }

    private initDragEvents() {
        this.dragHandler.initPlayDrag();
        this.dragHandler.initVolumeDrag();
    }

    private initImageEvents() {
        this.buttonStateHandler.initHoverEffects();
        this.buttonStateHandler.initShuffleHandler();
        this.buttonStateHandler.initRepeatHandler();
    }

    destroy() {
        this.handlers.forEach(removeHandler => removeHandler());
    }
}

class TimeManager {
    constructor(
        private player: Player,
        private dom: DomManager
    ) {
        this.dom.endSpan.innerHTML = convertDuration(this.player.duration);
    }
}

export default BottomPlayer;
