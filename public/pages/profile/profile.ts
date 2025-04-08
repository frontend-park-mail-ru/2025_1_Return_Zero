import './profile.scss';
import '../pages.scss';
import './profile.precompiled.js';

import '../../components/playlists/playlists'
import '../../components/tracks'
import '../../components/artists'

import { Component } from '../../libs/Component';
import { State } from '../../libs/State';
import Router from '../../libs/Router';

import { userState } from '../../states';
import { routes, reverseRoute } from '../../routes';

import { API } from 'utils/api';

export class ProfilePage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['profile.hbs']

    init() {
        this.element.classList.add('page', 'page--profile');
    }

    protected build() {
        this.element.innerHTML = ''
        if (!userState.getState()) {
            Router.pushUrl(
                reverseRoute(routes.pageRoute, ['']) + reverseRoute(routes.authRoute, ['login']),
                {}
            );
            return
        };

        (async () => {
            const stats = {
                minutes: 0,
                tracks: 0,
                artists: 0
            }
            const playlists = (await API.getAlbums()).body;
            const tracks = (await API.getTracks()).body;
            const artists = (await API.getArtists()).body;

            this.element.insertAdjacentHTML('beforeend', ProfilePage.template({
                user: userState.getState(),
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