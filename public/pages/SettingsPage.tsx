import { Component } from "libs/rzf/Component";

import { ButtonDanger, ButtonSuccess } from "components/elements/Button";
import { DialogConfirm } from "components/elements/Dialog";
import { Preloader } from "components/preloader/Preloader";

import Dispatcher from "libs/flux/Dispatcher";
import { USER_STORAGE } from "utils/flux/storages";
import { ACTIONS } from "utils/flux/actions";

import { ParamTypes } from "utils/api_types";
import { API } from "utils/api";

import { Validator } from "libs/rzv/Validator";
import { getSettingsFormValidator } from "utils/validators"; 
import { debounce, one_alive_async } from "utils/funcs";

import 'components/forms/forms.scss';
import './pages.scss';

export class SettingsPage extends Component {
    state: {
        user?: AppTypes.User,
        user_loading: boolean,
        error?: string,

        avatar_url?: string,
        avatar_file?: File,
        avatar_error?: string,
        
        show_password: boolean,
        show_new_password: boolean,
        confirm_delete: boolean,
    } = {
        user_loading: true,
        show_password: false,
        show_new_password: false,
        confirm_delete: false,
    }

    validator: Validator

    constructor(props: Record<string, any>) {
        super(props);
    }

    componentDidMount() {
        USER_STORAGE.subscribe(this.onAction);
        
        if (USER_STORAGE.getUser()) {
            this.setState({ user_loading: true });
            API.getUserSettings(USER_STORAGE.getUser().username).then((res) => {
                this.validator = getSettingsFormValidator(res.body);
                this.setState({ user: res.body, avatar_url: res.body.avatar_url })
            }).catch((reason: Error) => console.error(reason.message))
             .finally(() => this.setState({ user_loading: false }));
        }
    }
    
    componentWillUnmount(): void {
        USER_STORAGE.unsubscribe(this.onAction);
        URL.revokeObjectURL(this.state.avatar_url);
    }
    
    onAction = async (action: any) => {
        URL.revokeObjectURL(this.state.avatar_url);
        switch (true) {
            case action instanceof ACTIONS.USER_LOGIN:
                this.setState({ user_loading: true });
                API.getUserSettings(USER_STORAGE.getUser().username).then((res) => {
                    this.validator = getSettingsFormValidator(res.body);
                    this.setState({ user: res.body, avatar_url: res.body.avatar_url })
                }).catch((reason: Error) => console.error(reason.message)).finally(() => this.setState({ user_loading: false}));
                break;
            case action instanceof ACTIONS.USER_CHANGE:
                this.validator = getSettingsFormValidator(action.payload);
                this.setState({ user: action.payload, avatar_url: action.payload.avatar_url });
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

    onChangeAvatar = (event: Event) => {
        const file = (event.target as HTMLInputElement).files![0];
        URL.revokeObjectURL(this.state.avatar_url);
        this.setState({
            avatar_url: URL.createObjectURL((event.target as HTMLInputElement).files![0]),
            avatar_file: (event.target as HTMLInputElement).files![0],
            avatar_error: undefined,
            error: undefined
        })
        
        if (file.size > 5 * 1024 * 1024) {
            this.setState({
                avatar_error: 'Файл слишком большой',
                error: undefined
            })
            return
        }
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            this.setState({
                avatar_error: 'Не верный формат изображения',
                error: undefined
            })
            return ;
        }
    }

    onSubmit = async (event: SubmitEvent) => {event.preventDefault();}

    onSave = debounce(async (event: MouseEvent) => {
        const validator = this.validator;
        if (this.state.avatar_file) {
            if (this.state.avatar_error)
                return;

            try {
                const formData = new FormData();
                formData.append('avatar', this.state.avatar_file);
                const result = (await API.postAvatar(formData)).body;
                Dispatcher.dispatch(new ACTIONS.USER_CHANGE({
                    ...USER_STORAGE.getUser(),
                    avatar_url: result.avatar_url
                }));
            } catch (e) {
                this.setState({
                    error: 'Не верный формат изображения'
                })
                Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({ type: 'error', message: 'Не удалось сохранить изменения'}));
                return ;
            } 
        }

        if (!validator.validateAll({'submit': 'save'})) {
            this.setState({
                error: 'Заполните все поля'
            })
            return;
        }

        try {
            const data: ParamTypes.PutUser = Object.entries(validator.result).reduce((acc, [key, value]) => {
                if (!value.value) return acc;
                if (key.startsWith('is_')) acc.privacy[key] = value.value === 'true';
                else acc[key] = value.value;
                return acc;
            }, { privacy: {} } as any);
            const result = (await API.putUser(data)).body;
            Dispatcher.dispatch(new ACTIONS.USER_CHANGE(result));
        } catch (e) {
            switch (e.status) {
                case 401:
                    this.setState({ error: 'Не правильный пароль' })
                    break;
                default:
                    this.setState({ error: 'Что-то пошло не так' })
            }
            Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({ type: 'error', message: 'Не удалось сохранить изменения'}));
            return;
        }

        Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({ type: 'success', message: 'Новые настройки сохранены!'}));
    })

    onDelete = debounce(async (event: MouseEvent) => {
        if (!this.validator.validateAll({'submit': 'delete'})) {
            this.setState({
                error: 'Заполните все поля'
            })
            return;
        }

        try {
            const data = {
                username: this.state.user!.username,
                email: this.state.user!.email,
                password: this.validator.result.password.value
            };
            const result = (await API.deleteUser(data)).body;
            Dispatcher.dispatch(new ACTIONS.USER_LOGOUT(null));
        } catch (e) {
            console.error(e.message);
            this.setState({
                error: 'Что-то пошло не так'
            })
        }
    })

    render() {
        const user = this.state.user;
        if (this.state.user_loading) {
            return [<div className="page page--404">
                <Preloader />
            </div>];
        }
        if (!user) return [<div className="page page--404">Вы не авторизованы</div>];
        const result = this.validator.result;
        return [
            <form className="page page--settings" onSubmit={this.onSubmit}>
                <div className="page--settings__info">
                    <div className="page--settings__info__avatar">
                        <div className="form-input-container--image">
                            <div className="form-input-container--image__image" style={{backgroundImage: `url(${this.state.avatar_url})`}} />
                            <label className="form-input-container--image__button" for="avatar">
                                <img src="/static/img/pencil.svg" />
                            </label>
                            <input className="form-input-container--image__input" type="file" id="avatar" accept="image/*" onChange={this.onChangeAvatar} />
                            <p className="form-input-container--image__error">{this.state.avatar_error}</p>
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
                    <div className="page--settings__main__security">
                        <h1 className="page--settings__main__security__title">Безопасность</h1>
                        <div className="form-input-container">
                            <label className="form-input-container__label" for="password">Действующий пароль</label>
                            <div className="form-input-container__password">
                                <input className="form-input-container__input" name="password" value={result.password.unprocessed} onInput={this.onInput} type={!this.state.show_password ? "password" : "text"} id="password" placeholder="действующий пароль" />
                                <img className="form-input-container__password__show" src={!this.state.show_password ? "/static/img/hidden.svg" : "/static/img/shown.svg"} alt={!this.state.show_password ? "+" : "-"} onClick={() => this.setState({ show_password: !this.state.show_password })} />
                            </div>
                            <p className="form-input-container__error">{ result["password"].check === 'required' && result["password"].error}</p>
                        </div>
                        <div className="form-input-container">
                            <label className="form-input-container__label" for="new-password">Новый пароль</label>
                            <div className="form-input-container__password">
                                <input className="form-input-container__input" name="new_password" value={result.new_password.unprocessed} onInput={this.onInput} type={!this.state.show_new_password ? "password" : "text"} id="new-password" placeholder="новый пароль" />
                                <img className="form-input-container__password__show" src={!this.state.show_new_password ? "/static/img/hidden.svg" : "/static/img/shown.svg"} alt={!this.state.show_new_password ? "+" : "-"} onClick={() => this.setState({ show_new_password: !this.state.show_new_password })} />
                            </div>
                            <p className="form-input-container__error">{result["new_password"].error}</p>
                        </div>
                    </div>
                    <div className="form-input-container page--settings__main__privacy">
                        <h1 className="page--settings__main__security__title">Приватность</h1>
                        <div>
                            {[
                                {label: 'Плейлисты', name: 'is_public_playlists'},
                                {label: 'Минут прослушано', name: 'is_public_minutes_listened'},
                                {label: 'Любимые треки', name: 'is_public_favorite_tracks'},
                                {label: 'Треков прослушано', name: 'is_public_tracks_listened'},
                                {label: 'Любимые исполнители', name: 'is_public_favorite_artists'},
                                {label: 'Артистов прослушано', name: 'is_public_artists_listened'},
                            ].map(({label, name}) => {
                                return <div className="form-input-container page--settings__main__privacy__item">
                                    <label className="form-input-container__label">{label}</label>
                                    <div className="form-input-container__radio">
                                        <label className="form-input-container__radio__label">
                                            <input className="form-input-container__radio__input" type="radio" name={name} onInput={this.onInput} value="false" {...(result[name].unprocessed === 'false' ? { checked:true } : {})} />
                                            Приватно
                                        </label>
                                        <label className="form-input-container__radio__label">
                                            <input className="form-input-container__radio__input" type="radio" name={name} onInput={this.onInput} value="true" {...(result[name].unprocessed === 'true' ? { checked:true } : {})} />
                                            Публично
                                        </label>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
                <div className="page--settings__submit">
                    <ButtonDanger onClick={() => this.setState({ confirm_delete: true })}>Удалить аккаунт</ButtonDanger>
                    <p className="page--settings__submit__error form-input-container__error">{this.state.error}</p>
                    <ButtonSuccess onClick={this.onSave}>Сохранить</ButtonSuccess>
                </div>
                {this.state.confirm_delete && <DialogConfirm message="Вы точно хотите удалить свой аккаунт?" onClose={() => this.setState({confirm_delete: false})} onConfirm={this.onDelete} />}
            </form>
        ]
    }
}