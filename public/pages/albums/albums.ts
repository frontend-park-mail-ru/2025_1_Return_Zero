import './albums.precompiled.js';

import '../../components/albums';
import '../../components/collections/collections.js';

import '../pages.scss';

import { Component } from '../../libs/Component.ts';
import { API } from 'utils/api';
import { userState } from '../../utils/states';

export class AlbumsPage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['albums.hbs'];

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
                const albums = (await API.getAlbums()).body;

                const content = {
                    loved: albums,
                    recent: albums,
                    recommendations: albums,
                    user: userState.getState(),
                };

                this.element.insertAdjacentHTML(
                    'beforeend',
                    AlbumsPage.template(content)
                );
            } catch (e) {
                console.log(e);
            }
        })();
    }
}
