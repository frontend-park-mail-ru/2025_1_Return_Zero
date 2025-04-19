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
import Router from 'libs/Router';

export class SettingsPage extends Component {
    protected static BASE_ELEMENT = 'form';
    // @ts-ignore
    static template = Handlebars.templates['settings.hbs'];

    username?: string;
    user?: DataTypes.User;
    avatar: State<string>;

    validationList: InputState[] = [];
    isSending = false;

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
        if (this.isSending) return;
        
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

    private async handleSubmit() {
        if (this.isSending) return;
        this.isSending = true;
        if (await this.handleAvatar()) {
            await this.handleOptions();
        };
        this.isSending = false;
    }

    private async handleAvatar() {
        const avatar_file = (
            this.element.querySelector('#avatar') as HTMLInputElement
        ).files[0];

        if (!avatar_file) return true;

        const formData = new FormData();
        formData.append('username', this.user.username);
        formData.append('avatar', avatar_file);

        try {
            const avatar_url = (
                await API.updateAvatar(this.user.username, formData)
            ).body.avatar_url;
            userState.setState({
                ...userState.getState(),
                avatar_url,
            });
            return true;
        } catch (e) {
            const msg_elm = this.element.querySelector(
                '.page--settings__bottom__message'
            );

            switch (true) {
                case e.message.includes('user not found'):
                    msg_elm.textContent = 'Пользователь не найден';
                    break;
                case e.message.includes('http: multipart handled by MultipartReader'):
                    msg_elm.textContent = 'Попробуйте позже';
                    break;
                case e.message.includes('failed to parse form'):
                    msg_elm.textContent = 'Попробуйте позже';
                    break;
                case e.message.includes('failed to get file from form'):
                    msg_elm.textContent = 'Невозможно получить аватар';
                    break;
                case e.message.includes('file size exceeds limit'):
                    msg_elm.textContent = 'Превышен допустимый вес файла';
                    break;
                case e.message.includes('only image files are allowed'):
                    msg_elm.textContent = 'Можно отправлять только';
                    break;
                case e.message.includes('failed to parse image'):
                    msg_elm.textContent = 'Ошибка обработки картинки';
                    break;
                case e.message.includes('unsupported image format'):
                    msg_elm.textContent = 'Поддерживаемые форматы изображений: .png, .jpg';
                    break;
                case e.message.includes('failed to upload avatar'):
                    msg_elm.textContent = 'Попробуйте позже';
                    break;
            }
        }

        return false;
    }

    private async handleOptions() {
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
                return true;
            } catch (e) {
                
                const msg_elm = this.element.querySelector(
                    '.page--settings__bottom__message'
                );
                
                switch (true) {
                    case e.message.includes('user not auth'):
                        msg_elm.textContent = 'Пользователь не зарегистрирован';
                        break;
                    case e.message.includes('failed to convert change user data'):
                        msg_elm.textContent = 'Попробуйте позже';
                        break;
                    case e.message.includes('invalid request body'):
                        msg_elm.textContent = 'Некорректная форма';
                        break;
                    case e.message.includes('validation failed'):
                        msg_elm.textContent = 'Действующий пароль не указан или неправильный';
                        break;
                    case e.message.includes('user not found'):
                        msg_elm.textContent = 'Пользователь не найден';
                        break;
                    case e.message.includes('user with this username already exists'):
                        msg_elm.textContent = 'Пользователь с таким логином уже существует';
                        break;
                    case e.message.includes('user with this email already exists'):
                        msg_elm.textContent = 'Пользователь с таким email уже существует';
                        break;
                    case e.message.includes('wrong password'):
                        msg_elm.textContent = 'Неправильный пароль';
                        break;
                    case e.message.includes('password required'):
                        msg_elm.textContent = 'Необходим действующий пароль';
                        break;
                }
            }
        })();

        return false;
    }

    private handleDelete() {
        if (!this.validationList.every((input) => input.isValid())) return;
        if (!confirm('Вы уверены что хотите удалить аккаунт?')) return;

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
                Router.pushUrl('/', {});
            } catch (e) {
                const msg_elm = this.element.querySelector(
                    '.page--settings__bottom__message'
                );
                switch (true) {
                    case e.message.includes('wrong password'):
                    case e.message.includes('validation failed'):
                        msg_elm.textContent = 'Действующий пароль указан не верно';
                        break;
                    default:
                        msg_elm.textContent = 'Возникла ошибка, попробуйте позже';
                };
                console.error('Failed to delete user:', e.message);
            }
        })();
    }
}
