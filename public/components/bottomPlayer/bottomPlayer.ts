import '../../../public/audio/audio.mp3';
import './bottomPlayer.precompiled.js';
import './bottomPlayer.scss';

import player, { Player } from "components/player/player";
import { convertDuration } from "utils/durationConverter";
import DragProgressBar from "components/player/draggProgress";

import { Component } from '../../libs/Component.ts';

export class BottomPlayer extends Component {
    player: Player;

    playerHTML: HTMLElement;
    playBtn: HTMLImageElement;

    playProgress: HTMLElement;
    progressBar: HTMLElement;
    progressCircle: HTMLElement;    

    volumeProgress: HTMLElement;
    volumeBar: HTMLElement;
    volumeCircle: HTMLElement;

    currentSpan: HTMLElement;
    endSpan: HTMLElement;

    playDragging: DragProgressBar;
    volumeDragging: DragProgressBar;

    protected static BASE_ELEMENT = 'div';
    // @ts-ignore
    static template = Handlebars.templates['bottomPlayer.hbs'];
    

    protected init() {
        this.element.classList.add('player');
        this.element.id = 'player';
    }

    protected build() {
        this.element.innerHTML = '';
        // @ts-ignore
        this.element.insertAdjacentHTML(
            'beforeend',
            BottomPlayer.template({})
        );

        this.player = player;
        this.player.setTrack('/static/audio/audio.mp3');
        this.player.setDuration(190);
        this.playerHTML = this.element;
        this.initHTMLElements();
    }

    initHTMLElements() {
        this.playBtn = this.playerHTML.querySelector('#play');

        this.playProgress = this.playerHTML.querySelector('#play-progress');
        this.progressBar = this.playProgress.querySelector('.rectangle-prev');
        this.progressCircle = this.playProgress.querySelector('.circle');

        this.volumeProgress = this.playerHTML.querySelector('#volume-progress');
        this.volumeBar = this.volumeProgress.querySelector('.rectangle-prev');
        this.volumeCircle = this.volumeProgress.querySelector('.circle');

        this.currentSpan = this.playerHTML.querySelector('#current-span');
        this.endSpan = this.playerHTML.querySelector('#end-span');
        this.endSpan.innerHTML = convertDuration(this.player.duration);
        
        this.playDragging = new DragProgressBar(
            this.player, this.playProgress, this.progressBar, this.progressCircle, 
            'play'
        ); 

        this.volumeDragging = new DragProgressBar(
            this.player, this.volumeProgress, this.volumeBar, this.volumeCircle,
            'volume'
        );

        this.initEventListeners();
    }
    

    initEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());

        this.playProgress.addEventListener('click', (e) => this.playDragging.handleProgressClick(e));
        this.playProgress.addEventListener('mousedown', (e) => this.playDragging.startDragging(e));
        document.addEventListener('mousemove', (e) => this.playDragging.handleDrag(e));
        document.addEventListener('mouseup', (e) => {
            this.playDragging.stopDragging(e)
        });

        this.volumeProgress.addEventListener('click', (e) => this.volumeDragging.handleProgressClick(e));
        this.volumeProgress.addEventListener('mousedown', (e) => this.volumeDragging.startDragging(e));
        document.addEventListener('mousemove', (e) => this.volumeDragging.handleDrag(e));
        document.addEventListener('mouseup', (e) => {
            this.volumeDragging.stopDragging(e)
        });

        this.player.audio.addEventListener(
            'timeupdate', 
            () => {
                this.playDragging.updateProgress()
                this.volumeDragging.updateProgress()
                this.currentSpan.innerHTML = convertDuration(this.player.audio.currentTime);
            }
        );
    }

    setDuration() {
        const duration = this.player.audio.duration || 0;
        this.endSpan.innerHTML = convertDuration(duration);
    }

    setCurrentDuration() {
        const duration = this.player.audio.currentTime || 0;
        this.currentSpan.innerHTML = convertDuration(duration);
    }

    togglePlay() {
        this.player.togglePlay();

        if (this.player.audio.paused) {
            this.playBtn.src = "/static/img/player-play.svg";
        } else {
            this.playBtn.src = "/static/img/player-pause.svg";
        }
    }
}
