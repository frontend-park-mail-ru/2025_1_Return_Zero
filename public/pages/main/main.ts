import './main.precompiled.js';
import '../../components/music-card/music-card.js';
import '../../components/track/track.js';
import '../../components/collections/collections.js';

import '../pages.scss';

import { Component } from '../../libs/Component.ts';
import { API } from 'utils/api';
import { userState } from '../../states.ts';
import { Track } from 'utils/api_types';

export class MainPage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['main.hbs'];

    constructor() {
        super();
    }

    protected init() {
        this.element.classList.add('page');
    }

    protected build() {
        this.element.innerHTML = '';

        (async () => {
            try {
                const tracks = (await API.getTracks()).body;

                const content = {
                    loved: tracks,
                    recent: tracks,
                    recommendations: tracks,
                    user: userState.getState(),
                };

                this.element.insertAdjacentHTML(
                    'beforeend',
                    MainPage.template(content)
                );
            } catch (e) {
                console.log(e);
            }
        })();
    }
}
