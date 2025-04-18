import './artist.scss';
import '../pages.scss';
import './artist.precompiled.js';

import '../../components/tracks';
import '../../components/albums';

import { Component } from '../../libs/Component';
import { State } from '../../libs/State';

import { API } from 'utils/api';
import { routes } from 'utils/routes';

export class ArtistPage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['artist.hbs'];

    id: number;

    init(id: number) {
        this.id = id;
        this.element.classList.add('page', 'page--artist');
    }

    protected build() {
        this.element.innerHTML = '';

        (async () => {
            const artist = (await API.getArtist(this.id)).body;
            const albums = (await API.getArtistAlbums(this.id)).body;
            const tracks = (await API.getArtistTracks(this.id)).body;

            this.element.insertAdjacentHTML(
                'beforeend',
                ArtistPage.template({
                    artist,
                    albums,
                    tracks,
                    popular_albums_href: routes.artistsRoute.build({
                        type: 'popular-albums',
                        artist_id: this.id,
                    }),
                    popular_tracks_href: routes.artistsRoute.build({
                        type: 'popular-tracks',
                        artist_id: this.id,
                    }),
                })
            );
        })();
    }

    protected render(state: State<any>, prev: any, cur: any): void {}
}
