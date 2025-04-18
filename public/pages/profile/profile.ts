import './profile.scss';
import '../pages.scss';
import './profile.precompiled.js';

import 'components/playlists_section/playlists_section';
import '../../components/tracks';
import '../../components/artists';

import { Component } from '../../libs/Component';
import { State } from '../../libs/State';

import { API } from 'utils/api';
import { routes } from 'utils/routes';
import { DataTypes } from 'utils/api_types';
import { userState } from 'utils/states';

export class ProfilePage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['profile.hbs'];

    username: string;
    user: DataTypes.User;

    init(username?: string) {
        this.element.classList.add('page', 'page--profile');
        this.username = username || userState.getState()?.username;

        this.username ||
            this.createCallback(userState, () => {
                this.username = userState.getState()?.username;
                this.build();
            });
    }

    protected build() {
        this.element.innerHTML = '';

        if (!this.username) return;

        (async () => {
            try {
                this.user = (await API.getUser(this.username)).body;
                this.user.statistics.minutes_listened === -1 &&
                    (this.user.statistics.minutes_listened = undefined);
                this.user.statistics.tracks_listened === -1 &&
                    (this.user.statistics.tracks_listened = undefined);
                this.user.statistics.artists_listened === -1 &&
                    (this.user.statistics.artists_listened = undefined);
            } catch (e) {
                console.error(e);
            }

            console.log(this.user);
            const playlists = (await API.getAlbums()).body;
            const tracks = (await API.getTracks()).body;
            const artists = (await API.getArtists()).body;

            this.element.insertAdjacentHTML(
                'beforeend',
                ProfilePage.template({
                    user: this.user,
                    playlists,
                    tracks,
                    artists,
                })
            );

            this.element.querySelector('.profile__info__actions__copy-link')?.addEventListener('click', () => {
                const link = new URL(routes.profileRoute.build({
                    username: this.user.username,
                }), window.location.origin).href;
                navigator.clipboard.writeText(link).then(() => {
                    alert('Link copied to clipboard!');
                }, () => {
                    alert('Failed to copy link to clipboard...');
                });
            });
        })();
    }

    protected render(state: State<any>, prev: any, cur: any): void {}
}
