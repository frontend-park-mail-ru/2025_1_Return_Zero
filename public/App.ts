import Router from 'libs/Router';

import { RootComponent } from './libs/Component.ts';
import { MainLayout } from './layouts/MainLayout.ts';

import { addToQueueListener } from 'components/player/queueExportFunctions';
import player from "components/player/player";
import tracksQueue, { MusicUnit } from 'components/player/tracksQueue';

import { S } from 'libs/handlebars-v4.7.8';

export default class App extends RootComponent {
    protected init() {
        console.log('App init');

        this.initEventListeners();
    }

    protected build() {
        this.element.appendChild(new MainLayout().element);
    }

    private initEventListeners() {
        this.element.addEventListener('click', (e) => {
            const target = e.target;

            if (target instanceof HTMLAnchorElement) {
                e.preventDefault();
                if (target.style.cursor == 'not-allowed') {  // just for now
                    return;
                }
                console.error(`[App] Navigating to ${target.href}`);
                Router.pushUrl((target as HTMLAnchorElement).href, {});
            }
            if (target instanceof HTMLImageElement && target.id === 'track') {
                addToQueueListener(target);
            }
        });

        setInterval(() => {
            const tracks = Array.from(this.element.querySelectorAll('#track'));
            const currentTrack: MusicUnit = tracksQueue.getCurrentTrack();

            for (const track of tracks) {
                if (track.getAttribute('data-id') === currentTrack.id.toString()) {
                    track.classList.add('track-active');
                } else {
                    track.classList.remove('track-active');
                }
            }
        }, 300);
    }
}
