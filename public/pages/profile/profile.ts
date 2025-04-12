import './profile.scss';
import '../pages.scss';
import './profile.precompiled.js';

import '../../components/musics'
import '../../components/tracks'
import '../../components/artists'

import { Component } from '../../libs/Component';
import { State } from '../../libs/State';

import { API } from 'utils/api';
import { DataTypes } from 'utils/api_types.js';

export class ProfilePage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['profile.hbs']

    username: string;
    user: DataTypes.User;

    init(username: string) {
        this.username = username;
        this.element.classList.add('page', 'page--profile');
    }

    protected build() {
        this.element.innerHTML = '';

        (async () => {
            try {
                this.user = (await API.getUser(this.username)).body;
            } catch (e) {
                console.error(e);
            }
            
            const stats = {
                minutes: 0,
                tracks: 0,
                artists: 0
            }
            const playlists = (await API.getAlbums()).body;
            const tracks = (await API.getTracks()).body;
            const artists = (await API.getArtists()).body;

            this.element.insertAdjacentHTML('beforeend', ProfilePage.template({
                user: this.user,
                stats,
                playlists,
                tracks,
                artists
            }));
        })()
    }

    protected render(state: State<any>, prev: any, cur: any): void {
        
    }
}