import Router from 'libs/Router';

import { RootComponent } from './libs/Component.ts';
import { MainLayout } from './layouts/MainLayout.ts';

import { addToQueueListener } from 'components/player/queueExportFunctions';
import player from 'components/player/player';
import tracksQueue from 'components/player/tracksQueue';
import bottomPlayer from 'components/bottomPlayer/bottomPlayer';

export default class App extends RootComponent {
    protected init() {
        this.initEventListeners();
    }

    protected build() {
        this.element.appendChild(new MainLayout().element);
    }

    private initEventListeners() {
        this.element.addEventListener('click', (e) => {
            const target = e.target;

            if (target instanceof HTMLElement && !target.classList.contains('profile__dropdown') 
                && !target.classList.contains('profile__img')) {
                const dropDown = this.element.querySelector('.profile__dropdown') as HTMLElement;
                if (dropDown) {
                    dropDown.style.display = 'none';
                }
            }

            // if (target instanceof HTMLElement && !target.classList.contains('dropdown__content') 
            //     && !target.classList.contains('copy-profile-url')) {
            //     const dropDown = this.element.querySelector('.dropdown__content') as HTMLElement;
            //     if (dropDown) {
            //         dropDown.style.display = 'none';
            //     }
            // }

            if (target instanceof HTMLAnchorElement) {
                e.preventDefault();
                if (target.style.cursor == 'not-allowed') {
                    // just for now
                    return;
                }
                Router.pushUrl((target as HTMLAnchorElement).href, {});
            }

            if (
                target instanceof HTMLElement &&
                target.closest('div').dataset.type === 'track'
            ) {
                const track = target.closest('div');
                const currentTrack: string | null =
                    tracksQueue.getCurrentTrackId();

                if (
                    currentTrack &&
                    track.getAttribute('data-track-id') == currentTrack
                ) {
                    player.togglePlay();
                } else {
                    addToQueueListener(track);
                }
            }
        });

        setInterval(() => {
            if (tracksQueue.getCurrentTrack()) {
                const bottomPlayer: HTMLElement = this.element.querySelector('#player');
                const page: HTMLElement = this.element.querySelector('.page');
                if (bottomPlayer && bottomPlayer.style.display != 'flex') {
                    bottomPlayer.style.display = 'flex';
                    page.style.paddingBottom = '5.675rem';
                }
            }

            const tracks = Array.from(
                this.element.querySelectorAll('[data-type="track"]')
            );
            const currentTrack: string | null = tracksQueue.getCurrentTrackId();
        
            for (const track of tracks) {
                const trackImg: HTMLImageElement =
                    track.querySelector('.track__img') ??
                    track.querySelector('.music-card__img');
                const trackPlay: HTMLImageElement =
                    track.querySelector('.track__play') ??
                    track.querySelector('.music-card__play');
                
                if (
                    currentTrack &&
                    track.getAttribute('data-track-id') == currentTrack
                ) {
                    trackImg.classList.add('track-active');
                    trackPlay.classList.add('track-icon-active');

                    if (player.audio.paused) {
                        trackPlay.src = '/static/img/player-play.svg';
                    } else {
                        trackPlay.src = '/static/img/player-pause.svg';
                    }
                    bottomPlayer.setPlayButtonState();
                } else {
                    trackImg.classList.remove('track-active');
                    trackPlay.classList.remove('track-icon-active');
                    trackPlay.src = '/static/img/player-play.svg';
                }
            }
        }, 300);
    }
}
