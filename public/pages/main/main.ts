import './main.css';
import './main.precompiled.js';
import '../../components/music-card/music-card.js';
import '../../components/track/track.js';
import '../../components/collections/collections.js';

import { Component } from '../../libs/Component.ts';
import { API } from 'utils/api';

export class MainPage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['main.hbs'];

    constructor() {
        super();
    }

    protected init() {
        this.element.id = 'main-page';
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
