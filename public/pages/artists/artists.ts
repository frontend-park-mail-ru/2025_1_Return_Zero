import './artists.precompiled.js';

import '../../components/artist-card/artist-card.js';
import '../../components/collections/collections.js';

import '../pages.scss';

import { Component } from '../../libs/Component.ts';
import { API } from 'utils/api';
import { userState } from '../../states.ts';

export class ArtistsPage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['artists.hbs'];

    constructor() {
        super();
    }

    protected init() {
        this.element.classList.add('page', 'page--artists');
    }

    protected build() {
        this.element.innerHTML = '';

        (async () => {
            try {
                const artists = (await API.getArtists()).body;
                
                const content = {
                    loved: artists,
                    recommendations: artists,
                    user: userState.getState(),
                };

                this.element.insertAdjacentHTML(
                    'beforeend',
                    ArtistsPage.template(content)
                );
            } catch (e) {
                console.log(e);
            }
        })();
    }
}
