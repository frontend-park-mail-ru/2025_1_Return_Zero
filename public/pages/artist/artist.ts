import './artist.scss';
import '../pages.scss';
import './artist.precompiled.js';

import '../../components/tracks'
import '../../components/musics'

import { Component } from '../../libs/Component';
import { State } from '../../libs/State';

import { API } from 'utils/api';

export class ArtistPage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['artist.hbs']

    id: number;

    init(id: number) {
        this.id = id;
        this.element.classList.add('page', 'page--artist');
    }

    protected build() {
        this.element.innerHTML = '';

        (async () => {
            const stats = {
                listeners: 0
            }
            
            const artist = (await API.getArtist(this.id)).body;
            const albums = (await API.getArtistAlbums(this.id)).body;
            const tracks = (await API.getArtistTracks(this.id)).body;
            
            this.element.insertAdjacentHTML('beforeend', ArtistPage.template({
                artist,
                albums,
                tracks,
                stats
            }));
        })()
    }

    protected render(state: State<any>, prev: any, cur: any): void {
    }
}