import './settings.scss';
import './forms.scss';
import '../pages.scss';
import './settings.precompiled.js';

import '../../components/musics';
import '../../components/tracks';
import '../../components/artists';

import { Component } from '../../libs/Component';
import { State } from '../../libs/State';

import { API } from 'utils/api';
import { DataTypes, ParamTypes } from '../../utils/api_types';
import { userState } from '../../utils/states';

import { InputState, Input } from '../../components/auth/inputTypes.js';

export class SettingsPage extends Component {
    protected static BASE_ELEMENT = 'form';
    // @ts-ignore
    static template = Handlebars.templates['settings.hbs'];

    username?: string;
    user?: DataTypes.User;
    avatar: State<string>;

    init() {
        this.element.classList.add('page', 'page--settings');
        this.username = userState.getState()?.username;

        this.avatar = this.createState(null);

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
                this.user.email = userState.getState().email;

                this.element.insertAdjacentHTML(
                    'beforeend',
                    SettingsPage.template({
                        user: this.user,
                    })
                );

                this.avatar.setState(this.user.avatar_url);

                this.element
                    .querySelector('#avatar')
                    .addEventListener('change', this.handleAvatar.bind(this));
                this.element
                    .querySelector('.page--settings__bottom__button-save')
                    .addEventListener('click', this.handleSubmit.bind(this));
                this.element
                    .querySelector('.page--settings__bottom__button-reject')
                    .addEventListener('click', this.handleDelete.bind(this));
            } catch (e) {
                console.error(e);
            }
        })();
    }

    protected render(state: State<any>, prev: any, cur: any): void {
        switch (state) {
            case this.avatar:
                (
                    this.element.querySelector(
                        '.page--settings__top__avatar img'
                    ) as HTMLImageElement
                ).src = this.avatar.getState();
        }
    }

    private handleAvatar() {
        const avatar = (
            this.element.querySelector('#avatar') as HTMLInputElement
        ).files[0];
        this.avatar.setState(URL.createObjectURL(avatar));
    }

    private handleSubmit() {
        const avatar_file = (this.element.querySelector('#avatar') as HTMLInputElement).files[0];
        if (avatar_file) {
            const formData = new FormData();
            formData.append('username', this.user.username);
            formData.append(
                'avatar',
                avatar_file
            );
    
            (async () => {
                try {
                    await API.updateAvatar(this.user.username, formData);
                } catch (e) {
                    console.error('Failed to update avatar:', e.message);
                }
            })();
        }

        const data: ParamTypes.UserUpdate = {
            username: this.user.username,
            email: this.user.email,
            password:
                (
                    this.element.querySelector(
                        'input[name="password"]'
                    ) as HTMLInputElement
                ).value || undefined,
            new_username:
                (
                    this.element.querySelector(
                        'input[name="new-username"]'
                    ) as HTMLInputElement
                ).value || undefined,
            new_email:
                (
                    this.element.querySelector(
                        'input[name="new-email"]'
                    ) as HTMLInputElement
                ).value || undefined,
            new_password:
                (
                    this.element.querySelector(
                        'input[name="new-password"]'
                    ) as HTMLInputElement
                ).value || undefined,
            is_public_playlists:
                (
                    this.element.querySelector(
                        'input[name="public-playlists"]:checked'
                    ) as HTMLInputElement
                ).value === 'true',
            is_public_favorite_tracks:
                (
                    this.element.querySelector(
                        'input[name="public-tracks"]:checked'
                    ) as HTMLInputElement
                ).value === 'true',
            is_public_favorite_artists:
                (
                    this.element.querySelector(
                        'input[name="public-artists"]:checked'
                    ) as HTMLInputElement
                ).value === 'true',
            is_public_minutes_listened:
                (
                    this.element.querySelector(
                        'input[name="public-minutes-listened"]:checked'
                    ) as HTMLInputElement
                ).value === 'true',
            is_public_tracks_listened:
                (
                    this.element.querySelector(
                        'input[name="public-tracks-listened"]:checked'
                    ) as HTMLInputElement
                ).value === 'true',
            is_public_artists_listened:
                (
                    this.element.querySelector(
                        'input[name="public-artists-listened"]:checked'
                    ) as HTMLInputElement
                ).value === 'true',
        };

        (async () => {
            try {
                const new_user = (
                    await API.updateUser(this.user.username, data)
                ).body;
                userState.setState(new_user);
            } catch (e) {
                console.error('Failed to update user:', e.message);
            }
        })();
    }

    private handleDelete() {
        console.error('DELETE ACCOUNT');
    }
}
