import { Component } from "libs/rzf/Component";

import { ButtonDanger, ButtonSuccess } from "components/elements/Button";

import { USER_STORAGE } from "utils/flux/storages";
import { ACTIONS } from "utils/flux/actions";
import Dispatcher from "libs/flux/Dispatcher";

import { ParamTypes } from "utils/api_types";
import { API } from "utils/api";

import { Validator } from "libs/rzv/Validator";
import { getSettingsFormValidator } from "utils/validators"; 

import 'components/forms/forms.scss';
import './pages.scss';

export class SettingsPage extends Component {
    state: {
        user?: AppTypes.User,
        error?: string,

        show_password: boolean,
        show_new_password: boolean
    } = {
        show_password: false,
        show_new_password: false
    }

    validator: Validator

    constructor(props: Record<string, any>) {
        super(props);
    }

    componentDidMount() {
        USER_STORAGE.subscribe(this.onAction);
        
        if (USER_STORAGE.getUser()) {
            API.getUserSettings(USER_STORAGE.getUser().username).then((res) => {
                this.validator = getSettingsFormValidator(res.body);
                this.setState({ user: res.body })
            }).catch((reason: Error) => console.error(reason.message));
        }
    }
    
    componentWillUnmount(): void {
        USER_STORAGE.unSubscribe(this.onAction);
    }
    
    onAction = async (action: any) => {
        switch (true) {
            case action instanceof ACTIONS.USER_LOGIN:
                API.getUserSettings(USER_STORAGE.getUser().username).then((res) => {
                    this.validator = getSettingsFormValidator(res.body);
                    this.setState({ user: res.body })
                }).catch((reason: Error) => console.error(reason.message));
                break;
            case action instanceof ACTIONS.USER_CHANGE:
                this.validator = getSettingsFormValidator(action.payload);
                console.log(this.validator)
                this.setState({ user: action.payload });
                break;
            case action instanceof ACTIONS.USER_LOGOUT:
                this.setState({ user: undefined });
                break;
        }
    }

    onInput = (event: Event) => {
        this.validator.validate((event.target as HTMLInputElement).name, (event.target as HTMLInputElement).value);
        if ((event.target as HTMLInputElement).name === 'new_password') {
            this.validator.validate('password');
        }
        
        this.setState({
            error: undefined
        })
    };

    onSubmit = async (event: SubmitEvent) => {event.preventDefault();}

    onSave = async (event: MouseEvent) => {
        if (!this.validator.validateAll({'submit': 'save'})) {
            this.setState({
                error: 'Заполните все поля'
            })
            return;
        }

        try {
            const data: ParamTypes.PutUser = Object.entries(this.validator.result).reduce((acc, [key, value]) => {
                if (!value.value) return acc;
                if (key.startsWith('is_')) acc.privacy[key] = value.value === 'true';
                else acc[key] = value.value;
                return acc;
            }, { privacy: {} } as any);
            const result = (await API.putUser(data)).body;
            Dispatcher.dispatch(new ACTIONS.USER_CHANGE(result));
        } catch (e) {
            this.setState({
                error: e.message
            })
            console.error(e.message);
        }
    }

    onDelete = async (event: MouseEvent) => {
        if (!this.validator.validateAll({'submit': 'delete'})) {
            this.setState({
                error: 'Заполните все поля'
            })
            return;
        }
    }

    render() {
        const user = this.state.user;
        if (!user) return [<div className="page page--404">Вы не авторизованы</div>];
        const result = this.validator.result;
        return [
            <form className="page page--settings" onSubmit={this.onSubmit}>
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
                            <input className="form-input-container__input" name="new_username" value={result.new_username.unprocessed} onInput={this.onInput} type="text" id="username" placeholder="новый логин" />
                            <p className="form-input-container__error">{result["new_username"].error}</p>
                        </div>
                        <div className="form-input-container">
                            <label className="form-input-container__label" for="email">Email</label>
                            <input className="form-input-container__input" name="new_email" value={result.new_email.unprocessed} onInput={this.onInput} type="email" id="email" placeholder="новый email" />
                            <p className="form-input-container__error">{result["new_email"].error}</p>
                        </div>
                    </div>
                    <div class="page--settings__main__security">
                        <h1 class="page--settings__main__security__title">Безопасность</h1>
                        <div class="form-input-container">
                            <label class="form-input-container__label" for="password">Действующий пароль</label>
                            <div class="form-input-container__password">
                                <input class="form-input-container__input" name="password" value={result.password.unprocessed} onInput={this.onInput} type={!this.state.show_password ? "password" : "text"} id="password" placeholder="действующий пароль" />
                                <img className="form-input-container__password__show" src={!this.state.show_password ? "/static/img/hidden.svg" : "/static/img/shown.svg"} alt={!this.state.show_password ? "+" : "-"} onClick={() => this.setState({ show_password: !this.state.show_password })} />
                            </div>
                            <p class="form-input-container__error">{ result["password"].check === 'required' && result["password"].error}</p>
                        </div>
                        <div class="form-input-container">
                            <label class="form-input-container__label" for="new-password">Новый пароль</label>
                            <div class="form-input-container__password">
                                <input class="form-input-container__input" name="new_password" value={result.new_password.unprocessed} onInput={this.onInput} type={!this.state.show_new_password ? "password" : "text"} id="new-password" placeholder="новый пароль" />
                                <img className="form-input-container__password__show" src={!this.state.show_new_password ? "/static/img/hidden.svg" : "/static/img/shown.svg"} alt={!this.state.show_new_password ? "+" : "-"} onClick={() => this.setState({ show_new_password: !this.state.show_new_password })} />
                            </div>
                            <p class="form-input-container__error">{result["new_password"].error}</p>
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
                                            <input class="form-input-container__radio__input" type="radio" name={name} onInput={this.onInput} value="false" {...(result[name].unprocessed === 'false' ? { checked:true } : {})} />
                                            Приватно
                                        </label>
                                        <label class="form-input-container__radio__label">
                                            <input class="form-input-container__radio__input" type="radio" name={name} onInput={this.onInput} value="true" {...(result[name].unprocessed === 'true' ? { checked:true } : {})} />
                                            Публично
                                        </label>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
                <div className="page--settings__submit">
                    <ButtonDanger onClick={this.onDelete}>Удалить аккаунт</ButtonDanger>
                    <p className="page--settings__submit__error form-input-container__error">{this.state.error}</p>
                    <ButtonSuccess onClick={this.onSave}>Сохранить</ButtonSuccess>
                </div>
            </form>
        ]
    }
}