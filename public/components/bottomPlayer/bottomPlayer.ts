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
import DragProgressBar from "components/player/draggProgress";

import { Component } from '../../libs/Component.ts';

//test
const tracks = [
    {
        src: '/static/audio/audio.mp3',
        name: 'Miside main OST',
        artist: 'aihasto',
        image: '/static/img/251912_7_sq.jpg',
        duration: 190
    },
    {
        src: '/static/audio/audio2.mp3',  
        name: 'The Real Slim Shady',
        artist: 'eminem',
        image: '/static/img/eminem.jpg',
        duration: 285
    },
    {
        src: '/static/audio/audio3.mp3',
        name: 'Numb',
        artist: 'Linkin Park',
        image: '/static/img/linkin-park.jpg',
        duration: 186

    },
    {
        src: '/static/audio/audio4.mp3',
        name: 'Somebody That I Used To Know',
        artist: 'Gotye',
        image: '/static/img/gotye.jpg',
        duration: 245
    }
];

export class BottomPlayer extends Component {
    player: Player;
    tracksQueue: TracksQueue;

    playerHTML: HTMLElement;
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
        this.tracksQueue = tracksQueue;

        this.tracksQueue.setPlayerCallback((track: MusicUnit) => {
            this.switchingTrack(track)
        });
        
        this.playerHTML = this.element;
        this.initHTMLElements();
        this.testAudioQueue();
    }

    testAudioQueue() {
        //test
        this.songImg.src = tracks[0].image;
        this.songName.innerHTML = tracks[0].name;
        this.songArtist.innerHTML = tracks[0].artist;
        this.tracksQueue.addTrack(
            tracks
        );
    }

    initHTMLElements() {
        this.playBtn = this.playerHTML.querySelector('#play');
        this.nextBtn = this.playerHTML.querySelector('#next');
        this.prevBtn = this.playerHTML.querySelector('#prev');
        this.shuffleBtn = this.playerHTML.querySelector('#shuffle');
        this.repeatBtn = this.playerHTML.querySelector('#repeat');  

        this.songImg = this.playerHTML.querySelector('#song-img');
        this.songName = this.playerHTML.querySelector('#song-name');
        this.songArtist = this.playerHTML.querySelector('#artist-name');

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
        this.nextBtn.addEventListener('click', () => this.tracksQueue.nextTrack('nextBtn'));
        this.prevBtn.addEventListener('click', () => this.tracksQueue.previousTrack());

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
                this.currentSpan.innerHTML = convertDuration(this.player.audio.currentTime);
            }
        );
        this.player.audio.addEventListener('volumechange', () => {
            this.volumeDragging.updateProgress();
        });

        this.initImgEventListeners();
    }

    initImgEventListeners() {
        this.nextBtn.addEventListener('mouseover', () => {
            this.nextBtn.src = '/static/img/player-next-hover.svg';
        });
        this.nextBtn.addEventListener('mouseout', () => {
            this.nextBtn.src = '/static/img/player-next.svg';
        });

        this.prevBtn.addEventListener('mouseover', () => {
            this.prevBtn.src = '/static/img/player-prev-hover.svg';
        });
        this.prevBtn.addEventListener('mouseout', () => {
            this.prevBtn.src = '/static/img/player-prev.svg';
        });

        this.shuffleBtn.addEventListener('mouseover', () => {
            if (this.tracksQueue.shuffled) {
                return;
            }

            this.shuffleBtn.src = '/static/img/player-shuffle-hover.svg';
        });
        this.shuffleBtn.addEventListener('mouseout', () => {
            if (this.tracksQueue.shuffled) {
                return;
            }

            this.shuffleBtn.src = '/static/img/player-shuffle.svg';
        });
        this.shuffleBtn.addEventListener('click', () => {
            if (this.tracksQueue.shuffled) {
                this.tracksQueue.unshuffle();
            } else {
                this.tracksQueue.shuffle();
            }

            this.shuffleBtn.src = tracksQueue.shuffled
                ? '/static/img/player-shuffle-active.svg' 
                : '/static/img/player-shuffle.svg';
        });

        this.repeatBtn.addEventListener('mouseover', () => {
            if (this.tracksQueue.repeated) {
                return;
            }

            this.repeatBtn.src = '/static/img/player-repeat-hover.svg';
        });
        this.repeatBtn.addEventListener('mouseout', () => {
            if (this.tracksQueue.repeated) {
                return;
            }

            this.repeatBtn.src = '/static/img/player-repeat.svg';
        });
        this.repeatBtn.addEventListener('click', () => {
            if (this.tracksQueue.repeated) {
                this.tracksQueue.unrepeat();
            } else {
                this.tracksQueue.repeat();
            }

            this.repeatBtn.src = tracksQueue.repeated
                ? '/static/img/player-repeat-active.svg' 
                : '/static/img/player-repeat.svg';
        });
    }

    setDuration(duration: number) {
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

    switchingTrack(track: MusicUnit) {
        //unsafe
        this.songImg.src = track.image;
        this.songName.innerHTML = track.name;
        this.songArtist.innerHTML = track.artist;

        this.setDuration(track.duration);
        this.player.togglePlay();
    }
}
