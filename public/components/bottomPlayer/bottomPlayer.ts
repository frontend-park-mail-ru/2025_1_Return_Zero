import './small.precompiled.js';
import './fullscreen.precompiled.js';
import './small.scss';
import './fullscreen.scss';

import player, { Player } from 'components/player/player';
import tracksQueue, { TracksQueue } from 'components/player/tracksQueue';
import { MusicUnit } from 'components/player/tracksQueue';
import { convertDuration, parseDuration } from 'utils/durationConverter';
import {
    ButtonStateHandler,
    DomManager,
    DragHandler,
} from './bottomPlayerUIManager';
import { State } from '../../libs/State.ts';

import { API } from 'utils/api';

import { Component } from '../../libs/Component.ts';

export class BottomPlayer extends Component {
    static instance: BottomPlayer;

    size: State<string>;

    player: Player;
    tracksQueue: TracksQueue;
    stream: Stream;

    protected static BASE_ELEMENT = 'div';
    // @ts-ignore
    static smallTemplate = Handlebars.templates['small.hbs'];
    // @ts-ignore
    static fullscreenTemplate = Handlebars.templates['fullscreen.hbs'];

    private domManager: DomManager;
    private eventManager: EventManager;
    private buttonStateHandler: ButtonStateHandler;
    private timeManager: TimeManager;
    private dragHandler: DragHandler;

    protected init() {
        if (BottomPlayer.instance) {
            return BottomPlayer.instance;
        }
        BottomPlayer.instance = this;

        this.element.id = 'player';

        this.size = this.createState('small');
        this.createCallback(this.size, () => this.build());
        this.stream = new Stream();
    }

    protected build() {
        this.element.innerHTML = '';

        switch (this.size.getState()) {
            case 'small':
                this.element.classList.remove(`fullscreen-player`);
                this.element.classList.add(`small-player`);
                this.element.insertAdjacentHTML(
                    'beforeend',
                    BottomPlayer.smallTemplate({})
                );
                break;
            case 'fullscreen':
                this.element.classList.remove(`small-player`);
                this.element.classList.add(`fullscreen-player`);
                this.element.insertAdjacentHTML(
                    'beforeend',
                    BottomPlayer.fullscreenTemplate({})
                );
                break;
        }

        this.player = player;
        this.tracksQueue = tracksQueue;
        this.tracksQueue.setPlayerCallback(
            (track: MusicUnit, play: boolean = true) =>
                this.switchingTrack(track, play)
        );

        this.domManager = new DomManager(this.element);
        this.timeManager = new TimeManager(this.player, this.domManager);
        this.dragHandler = new DragHandler(this.player, this.domManager);
        this.buttonStateHandler = new ButtonStateHandler(
            this.domManager,
            this.tracksQueue
        );
        this.eventManager = new EventManager(
            this.player,
            this.tracksQueue,
            this.domManager,
            this.dragHandler,
            this.buttonStateHandler,
            this
        );

        this.updateMusicDom(tracksQueue.getCurrentTrack());
    }

    toggleState() {
        if (this.size.getState() === 'small') {
            this.size.setState('fullscreen');
        } else {
            this.size.setState('small');
        }
    }

    setDuration(duration: number) {
        this.domManager.endSpan.innerHTML = convertDuration(duration);
    }

    setCurrentDuration() {
        const duration = this.player.audio.currentTime || 0;
        this.domManager.currentSpan.innerText = convertDuration(duration);
    }

    async togglePlay() {
        if (tracksQueue.getCurrentTrackId() == null) {
            return;
        }

        try {
            await this.player.togglePlay();
            await this.setPlayButtonState();
        } catch (error) {
            console.error('Ошибка воспроизведения:', error);
            this.domManager.playBtn.src = '/static/img/player-play.svg';
        }
    }

    async setPlayButtonState() {
        this.domManager.playBtn.src = this.player.audio.paused
            ? '/static/img/player-play.svg'
            : '/static/img/player-pause.svg';
    }

    switchingTrack(track: MusicUnit, play: boolean) {
        this.updateMusicDom(track);
        if (play) {
            this.togglePlay();
            this.toggleStream();
        }
    }

    toggleVolume() {
        this.player.toggleMute();
        this.updateVolume(); 
    }

    updateVolume() {
        this.domManager.volumeBtn.src = this.player.audio.volume > 0
        ? '/static/img/volume.svg'
        : '/static/img/volume-mute.svg';
    }

    async toggleStream() {
        await this.stream.updateStream();
        await this.stream.createStream();
    }

    updateMusicDom(track: MusicUnit) {
        if (!track) {
            return;
        }

        this.dragHandler.playDragging.updateProgress();
        this.domManager.songImg.src = track.image;
        this.domManager.songName.innerText = track.name;
        this.domManager.songArtist.innerText = track.artist;
        this.setDuration(track.duration);
        this.setPlayButtonState();
        this.player.getCurrentTime();
        this.setCurrentDuration();
        this.buttonStateHandler.checkShuffle();
        this.buttonStateHandler.checkRepeat();
        this.updateVolume();
    }
}

class Stream {
    id: number;
    duration: number;

    constructor() {
        this.duration = 0;
        setInterval(() => {
            this.setDuration();
        }, 1000);
    }

    setDuration() {
        if (!player.audio.paused) {
            this.duration += 1;
        }
    }

    async createStream() {
        const trackIdNumber = Number(tracksQueue.getCurrentTrackId());
        const response = await API.createStream(trackIdNumber);
        this.id = response.body.id;
        this.duration = 0;
    }

    async updateStream() {
        if (!this.id) {
            return;
        }

        const response = await API.updateStream(this.id, this.duration);
        console.warn(this.id, this.duration);
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
            this.player.audio.removeEventListener(
                'timeupdate',
                timeUpdateHandler
            );
        });

        const volumeChangeHandler = () => {
            this.dragHandler.volumeDragging.updateProgress();
            this.bottomPlayer.updateVolume();
        };
        this.player.audio.addEventListener('volumechange', volumeChangeHandler);
        this.handlers.push(() => {
            this.player.audio.removeEventListener(
                'volumechange',
                volumeChangeHandler
            );
        });
    }

    private initButtonEvents() {
        this.dom.playBtn.addEventListener('click', () =>
            this.bottomPlayer.togglePlay()
        );
        this.dom.nextBtn.addEventListener('click', () => {
            if (tracksQueue.getCurrentTrackId() == null) {
                return;
            }
            this.tracksQueue.nextTrack('nextBtn');
        });
        this.dom.prevBtn.addEventListener('click', () => {
            if (tracksQueue.getCurrentTrackId() == null) {
                return;
            }
            this.tracksQueue.previousTrack();
        });
        this.dom.resizeBtn.addEventListener('click', () =>
            this.bottomPlayer.toggleState()
        );
        this.dom.volumeBtn.addEventListener('click', () => {
                this.bottomPlayer.toggleVolume()
            }
        );
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
        this.handlers.forEach((removeHandler) => removeHandler());
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

export default new BottomPlayer();
