import { Component } from "libs/rzf/Component";

import { ButtonDanger, ButtonSuccess } from "components/elements/Button";

import { USER_STORAGE } from "utils/flux/storages";
import { ACTIONS } from "utils/flux/actions";
import { API } from "utils/api";

import 'components/forms/forms.scss';
import './pages.scss';

export class SettingsPage extends Component {
    state: {
        user?: AppTypes.User
    }

    userSubscribe: () => void

    componentDidMount() {
        this.userSubscribe = this.loadInfo.bind(this);
        USER_STORAGE.subscribe(this.userSubscribe);
        USER_STORAGE.getUser() && API.getUserSettings(USER_STORAGE.getUser().username).then((res) => this.setState({ user: res.body }));
    }

    componentWillUnmount(): void {
        USER_STORAGE.unSubscribe(this.userSubscribe);
    }

    async loadInfo(action: any) {
        switch (true) {
            case action instanceof ACTIONS.USER_LOGIN:
                this.setState({ user: (await API.getUserSettings(USER_STORAGE.getUser().username)).body });
                break;
            case action instanceof ACTIONS.USER_CHANGE:
                this.setState({ user: action.payload });
                break;
            case action instanceof ACTIONS.USER_LOGOUT:
                this.setState({ user: undefined });
                break;
        }
    }

    render() {
        const user = this.state.user;
        if (!user) return [<div className="page page--404">Вы не авторизованы</div>];
        return [
            <form className="page page--settings">
                <div className="page--settings__info">
                    <div className="page--settings__info__avatar">
                        <div className="form-input-container--image">
                            <img className="form-input-container--image__image" src={user.avatar_url} />
                            <label className="form-input-container--image__button" for="avatar">
                                <img src="/static/img/pencil.svg" />
                            </label>
                            <input className="form-input-container--image__input" type="file" id="avatar" accept="image/*" />
                            <p className="form-input-container--image__error"></p>
                        </div>
                    </div>
                    <div className="page--settings__info__data">
                        <span className="item">Логин:</span>
                        <span className="item">{user.username}</span>
                        <span className="item">Email:</span>
                        <span className="item">{user.email}</span>
                    </div>
                    <div className="page--settings__info__help">
                        <p>Картинка должна весить до 5 мб.<br />Желательно загружать квадратное изображение</p>
                        <p>Чтобы удалить аккаунт или сменить пароль — необходимо ввести свой действующий пароль</p>
                    </div>
                </div>
                <div className="page--settings__main">
                    <div className="page--settings__main__auth">
                        <h1 className="page--settings__main__auth__title">Учетные данные</h1>
                        <div className="form-input-container">
                            <label className="form-input-container__label" for="username">Логин</label>
                            <input className="form-input-container__input" name="new_username" type="text" id="username" placeholder="новый логин" />
                            <p className="form-input-container__error"></p>
                        </div>
                        <div className="form-input-container">
                            <label className="form-input-container__label" for="email">Email</label>
                            <input className="form-input-container__input" name="new_email" type="email" id="email" placeholder="новый email" />
                            <p className="form-input-container__error"></p>
                        </div>
                    </div>
                    <div class="page--settings__main__security">
                        <h1 class="page--settings__main__security__title">Безопасность</h1>
                        <div class="form-input-container">
                            <label class="form-input-container__label" for="password">Действующий пароль</label>
                            <input class="form-input-container__input" name="password" type="password" id="password" placeholder="действующий пароль" />
                            <p class="form-input-container__error"></p>
                        </div>
                        <div class="form-input-container">
                            <label class="form-input-container__label" for="new-password">Новый пароль</label>
                            <input class="form-input-container__input" name="new-password" type="password" id="new-password" placeholder="новый пароль" />
                            <p class="form-input-container__error"></p>
                        </div>
                    </div>
                    <div className="form-input-container page--settings__main__privacy">
                        <h1 class="page--settings__main__security__title">Приватность</h1>
                        <div>
                            {[
                                {label: 'Плейлисты', name: 'is_public_playlists'},
                                {label: 'Минут прослушано', name: 'is_public_minutes_listened'},
                                {label: 'Любимые треки', name: 'is_public_favorite_tracks'},
                                {label: 'Треков прослушано', name: 'is_public_tracks_listened'},
                                {label: 'Любимые исполнители', name: 'is_public_favorite_artists'},
                                {label: 'Артистов прослушано', name: 'is_public_artists_listened'},
                            ].map(({label, name}) => {
                                return <div class="form-input-container page--settings__main__privacy__item">
                                    <label class="form-input-container__label">{label}</label>
                                    <div class="form-input-container__radio">
                                        <label class="form-input-container__radio__label">
                                            {/* @ts-ignore */}
                                            <input class="form-input-container__radio__input" type="radio" name={name} value="false" {...(!user.privacy[name] ? { checked:true } : {})} />
                                            Приватно
                                        </label>
                                        <label class="form-input-container__radio__label">
                                            {/* @ts-ignore */}
                                            <input class="form-input-container__radio__input" type="radio" name={name} value="true" {...(user.privacy[name] ? { checked:true } : {})} />
                                            Публично
                                        </label>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
                <div className="page--settings__submit">
                    <ButtonDanger>Удалить аккаунт</ButtonDanger>
                    <p className="page--settings__submit__error form-input-container__error">aboba</p>
                    <ButtonSuccess>Сохранить</ButtonSuccess>
                </div>
            </form>
        ]
    }
}