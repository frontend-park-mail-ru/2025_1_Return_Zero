import './main.precompiled.js';

import 'components/musics';
import 'components/tracks';

import '../pages.scss';

import { Component } from 'libs/Component.ts';
import { API } from 'utils/api';
import { userState } from 'utils/states';

export class MainPage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['main.hbs'];

    protected init() {
        this.element.classList.add('page');

        this.createCallback(userState, () => this.build());
    }

    protected build() {
        (async () => {
            let tracks;
            try {
                tracks = (await API.getTracks()).body;
            } catch (e) {
                console.error(e.message);
            }
            const loved = tracks;
            const recommendations = tracks;

            let recent;
            try {
                recent =
                    userState.getState()?.username &&
                    (await API.getHistoryTracks(userState.getState().username))
                        .body;
            } catch (e) {
                console.error(e.message);
            }

            this.element.innerHTML = '';
            this.element.insertAdjacentHTML(
                'beforeend',
                MainPage.template({
                    recent,
                    loved,
                    recommendations,
                })
            );

            const recentSection = this.element.querySelector('[data-request="recent"]');
            if (recentSection) {
                const href = recentSection.querySelector('.section__all');
                if (href) { 
                    recentSection.removeChild(href);
                }
            }
        })();
    }
}
