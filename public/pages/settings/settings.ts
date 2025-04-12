import './settings.scss';
import './forms.scss'
import '../pages.scss';
import './settings.precompiled.js';

import '../../components/musics'
import '../../components/tracks'
import '../../components/artists'

import { Component } from '../../libs/Component';
import { State } from '../../libs/State';

import { API } from 'utils/api';
import { DataTypes, ParamTypes } from '../../utils/api_types';
import { userState } from '../../utils/states';

export class SettingsPage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['settings.hbs']

    username: string;
    user: DataTypes.User;

    init() {
        this.element.classList.add('page', 'page--settings');
        this.username = userState.getState().username;
    }

    protected build() {
        this.element.innerHTML = '';

        (async () => {
            try {
                this.user = (await API.getUser(this.username)).body;
                this.user.email = userState.getState().email;
            } catch (e) {
                console.error(e);
            }

            this.element.insertAdjacentHTML('beforeend', SettingsPage.template({
                user: this.user
            }));

            this.element.querySelector('.page--settings__bottom__button-save').addEventListener('click', this.handleSubmit.bind(this));
            this.element.querySelector('.page--settings__bottom__button-reject').addEventListener('click', this.handleDelete.bind(this));
        })()
    }

    protected render(state: State<any>, prev: any, cur: any): void {
        
    }

    private handleSubmit() {
        const data: ParamTypes.UserUpdate = {
            username: this.user.username,
            email: this.user.email,
            password: (this.element.querySelector('input[name="password"]') as HTMLInputElement).value,
            new_email: (this.element.querySelector('input[name="new-email"]') as HTMLInputElement).value,
            new_username: (this.element.querySelector('input[name="new-username"]') as HTMLInputElement).value,
            new_password: (this.element.querySelector('input[name="new-password"]') as HTMLInputElement).value,
            is_public_playlists: (this.element.querySelector('input[name="public-playlists"]:checked') as HTMLInputElement).value === 'true',
            is_public_favorite_tracks: (this.element.querySelector('input[name="public-tracks"]:checked') as HTMLInputElement).value === 'true',
            is_public_favorite_artists: (this.element.querySelector('input[name="public-artists"]:checked') as HTMLInputElement).value === 'true',
            is_public_minutes_listened: (this.element.querySelector('input[name="public-minutes-listened"]:checked') as HTMLInputElement).value === 'true',
            is_public_tracks_listened: (this.element.querySelector('input[name="public-tracks-listened"]:checked') as HTMLInputElement).value === 'true',
            is_public_artists_listened: (this.element.querySelector('input[name="public-artists-listened"]:checked') as HTMLInputElement).value === 'true'
        };

        (async () => {
            try {
                await API.updateUser(this.user.username, data);
            } catch (e) {
                console.error(e);
            }
        })()
    }

    private handleDelete() {
        console.error("DELETE ACCOUNT");
    }
}
