import './albums.css';
import './albums.precompiled.js';
import '../../components/album-card/album-card.js';
import '../../components/album/album.js';
import '../../components/collections/collections.js';

import { Component } from '../../libs/Component.ts';
import { API } from 'utils/api';
import { userState } from '../../states.ts';

export class AlbumsPage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['albums.hbs'];

    constructor() {
        super();
    }

    protected init() {
        this.element.id = 'albums-page';
    }

    protected build() {
        this.element.innerHTML = '';

        (async () => {
            try {
                const albums = await API.getAlbums();
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
