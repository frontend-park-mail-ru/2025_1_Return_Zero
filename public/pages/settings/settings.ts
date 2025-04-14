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

import { InputState } from 'components/auth/inputTypes';

export class SettingsPage extends Component {
    protected static BASE_ELEMENT = 'form';
    // @ts-ignore
    static template = Handlebars.templates['settings.hbs'];

    username?: string;
    user?: DataTypes.User;
    avatar: State<string>;

    validationList: InputState[] = [];

    init() {
        this.element.classList.add('page', 'page--settings');
        this.element.addEventListener('submit', (e) => {
            e.preventDefault();
        });
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

                this.validationList = Array.from(
                    this.element.querySelectorAll(
                        'input[data-validation="username"], input[data-validation="email"], input[data-validation="password"]'
                    )
                ).map(
                    (input) =>
                        new InputState(
                            input as HTMLInputElement,
                            input.nextElementSibling as HTMLParagraphElement,
                            (input as HTMLInputElement).dataset.validation,
                            'settings'
                        )
                );

                this.avatar.setState(this.user.avatar_url);

                this.element
                    .querySelector('#avatar')
                    .addEventListener('change', (e) =>
                        this.avatar.setState(
                            URL.createObjectURL(
                                (e.target as HTMLInputElement).files[0]
                            )
                        )
                    );
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

    private handleSubmit() {
        this.handleAvatar();
        this.handleOptions();
    }

    private handleAvatar() {
        const avatar_file = (
            this.element.querySelector('#avatar') as HTMLInputElement
        ).files[0];

        if (!avatar_file) return;

        const formData = new FormData();
        formData.append('username', this.user.username);
        formData.append('avatar', avatar_file);

        (async () => {
            try {
                // @ts-ignore
                const avatar_url = (
                    await API.updateAvatar(this.user.username, formData)
                ).body.avatar_url;
                userState.setState({
                    ...userState.getState(),
                    // @ts-ignore
                    avatar_url,
                });
            } catch (e) {
                const msg_elm = this.element.querySelector(
                    '.page--settings__bottom__message'
                );
                msg_elm.textContent = 'Failed to update avatar: ' + e.message;
                console.error('Failed to update avatar:', e.message);
            }
        })();
    }

    private handleOptions() {
        if (!this.validationList.every((input) => input.isValid()))
            return false;

        const data: ParamTypes.UserUpdate = {
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
            privacy: {
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
            },
        };

        (async () => {
            try {
                const new_user = (
                    await API.updateUser(this.user.username, data)
                ).body;
                userState.setState(new_user);
            } catch (e) {
                const msg_elm = this.element.querySelector(
                    '.page--settings__bottom__message'
                );
                msg_elm.textContent = 'Failed to update user: ' + e.message;
                console.error('Failed to update user:', e.message);
            }
        })();
    }

    private handleDelete() {
        if (!this.validationList.every((input) => input.isValid())) return;

        const data: ParamTypes.UserDelete = {
            username: userState.getState().username,
            email: userState.getState().email,
            password: (
                this.element.querySelector(
                    'input[name="password"]'
                ) as HTMLInputElement
            ).value,
        };

        (async () => {
            try {
                await API.deleteUser(this.user.username, data);
                userState.setState(null);
            } catch (e) {
                const msg_elm = this.element.querySelector(
                    '.page--settings__bottom__message'
                );
                msg_elm.textContent = 'Failed to delete user: ' + e.message;
                console.error('Failed to delete user:', e.message);
            }
        })();
    }
}
