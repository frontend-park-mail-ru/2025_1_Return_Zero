import './tracks.css';
import './tracks.precompiled.js';
import '../../components/music-card/music-card.js';
import '../../components/track/track.js';
import '../../components/collections/collections.js';

import { Component } from '../../libs/Component.ts';
import { API } from 'utils/api';
import { userState } from '../../states.ts';

export class TracksPage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['tracks.hbs'];

    constructor() {
        super();
    }

    protected init() {
        this.element.id = 'tracks-page';
    }

    protected build() {
        this.element.innerHTML = '';

        (async () => {
            try {
                const tracks = await API.getTracks();
                const content = {
                    loved: tracks,
                    recent: tracks,
                    recommendations: tracks,
                    user: userState.getState(),
                };

                this.element.insertAdjacentHTML(
                    'beforeend',
                    TracksPage.template(content)
                );
            } catch (e) {
                console.log(e);
            }
        })();
    }
}
