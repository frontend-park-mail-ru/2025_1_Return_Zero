import './artists.precompiled.js';

import '../../components/artists';

import '../pages.scss';

import { Component } from '../../libs/Component.ts';
import { API } from 'utils/api';
import { userState } from '../../utils/states';

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
