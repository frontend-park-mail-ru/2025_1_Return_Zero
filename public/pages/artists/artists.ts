import './artists.css';
import './artists.precompiled.js';
import '../../components/artist-card/artist-card.js';
import '../../components/collections/collections.js';

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
        this.element.id = 'artists-page';
    }

    protected build() {
        this.element.innerHTML = '';

        (async () => {
            try {
                const artists = await API.getArtists();
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
