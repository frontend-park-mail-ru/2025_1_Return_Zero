import { Component } from "libs/rzf/Component";
import router, { Link } from "libs/rzf/Router";

import { LOGIN_FORM_VALIDATOR, REGISTRATION_FORM_VALIDATOR } from "utils/validators";

import { Button, ButtonDanger } from "components/elements/Button";
import { Popup } from "components/elements/Popup";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";

import { API } from "utils/api";

import "./forms.scss";
import "./AuthForms.scss";


export class LoginForm extends Component {
    constructor(props: Record<string, any>) {
        super(props);

        this.state = {
            pas_hidden: true,
            error: null
        }
    }

    onClose(e: MouseEvent) {
        if (e.target instanceof HTMLElement && e.target.classList.contains("popup")) {
            router.replace(location.pathname, {});
        }
    }

    onInput(e: Event) {
        LOGIN_FORM_VALIDATOR.validate((e.target as HTMLInputElement).name, (e.target as HTMLInputElement).value);
        this.setState({
            error: null
        })
    }

    async onSubmit(e: MouseEvent) {
        e.preventDefault();

        if (!LOGIN_FORM_VALIDATOR.validateAll()) {
            this.setState({
                'error': 'Перепроверьте введенные данные'
            })
            return;
        };

        try {
            const vr = LOGIN_FORM_VALIDATOR.result;
            const payload: any = {
                password: vr.password.value
            }
            if (vr.identifier.value.includes('@')) payload.email = vr.identifier.value;
            else payload.username = vr.identifier.value;

            const reply = (await API.postLogin(payload)).body;
            Dispatcher.dispatch(new ACTIONS.USER_LOGIN(reply));
            router.push(location.pathname, {});
        } catch (e) {
            this.setState({
                'error': e.message
            })
            console.error(e)
        }
    }

    render() {
        const vr = LOGIN_FORM_VALIDATOR.result;
        return [
            <Popup className="popup--auth" onClick={this.onClose.bind(this)}>
                <form className="form form--auth" onSubmit={this.onSubmit.bind(this)}>
                    <h2 className="form__title">Авторизация</h2>
                    <div className="form-input-container">
                        <label className="form-input-container__label">Введите логин/email</label>
                        <input className="form-input-container__input" onInput={this.onInput.bind(this)} value={vr.identifier.unprocessed} type="text" name="identifier" placeholder="логин" />
                    </div>
                    <div className="form-input-container">
                        <label className="form-input-container__label">Введите пароль</label>
                        <div className="form-input-container__password">
                            <input className="form-input-container__input" onInput={this.onInput.bind(this)} value={vr.password.unprocessed} type={this.state.pas_hidden ? "password" : "text"} name="password" placeholder="пароль" />
                            <img className="form-input-container__password__show" src={this.state.pas_hidden ? "/static/img/hidden.svg" : "/static/img/shown.svg"} alt={this.state.pas_hidden ? "+" : "-"} onClick={() => this.setState({ pas_hidden: !this.state.pas_hidden })} />
                        </div>
                    </div>

                    <div className="form-input-container form-bottom-container">
                        {this.state.error && <p className="form-input-container__error">{this.state.error}</p>}
                        <Button className="form__apply">Войти</Button>
                        <Link to='#register' className="form__link">Нет аккаунта? Зарегистрироваться</Link>
                    </div>
                </form>
            </Popup>
        ];
    }
}


export class SignupForm extends Component {
    constructor(props: Record<string, any>) {
        super(props);
        this.state = {
            pas_hidden: true,
            repas_hidden: true,
            error: null
        };
    }

    onClose(e: MouseEvent) {
        if (e.target instanceof HTMLElement && e.target.classList.contains("popup")) {
            router.replace(location.pathname, {});
        }
    }

    onInput(e: Event) {
        REGISTRATION_FORM_VALIDATOR.validate((e.target as HTMLInputElement).name, (e.target as HTMLInputElement).value);
        this.setState({
            error: null
        })
    }

    async onSubmit(e: SubmitEvent) {
        e.preventDefault();

        if (!REGISTRATION_FORM_VALIDATOR.validateAll()) {
            console.log(REGISTRATION_FORM_VALIDATOR)
            this.setState({
                'error': 'Перепроверьте введенные данные'
            })
            return;
        };

        try {
            const payload: any = {
                username: REGISTRATION_FORM_VALIDATOR.result.username.value,
                email: REGISTRATION_FORM_VALIDATOR.result.email.value,
                password: REGISTRATION_FORM_VALIDATOR.result.password.value,
            };

            const reply = (await API.postSignup(payload)).body;
            Dispatcher.dispatch(new ACTIONS.USER_LOGIN(reply));
            router.push(location.pathname, {});
        } catch (e) {
            this.setState({
                'error': e.message
            })
            console.error(e)
        }
    }

    render() {
        const vr = REGISTRATION_FORM_VALIDATOR.result;
        return [
            <Popup className="popup--auth" onClick={this.onClose.bind(this)}>
                <form className="form form--auth" onSubmit={this.onSubmit.bind(this)}>
                    <h2 className="form__title">Регистрация</h2>
                    <div className="form-input-container">
                        <label className="form-input-container__label">Введите логин</label>
                        <input className="form-input-container__input" onInput={this.onInput.bind(this)} value={vr.username.unprocessed} type="text" name="username" placeholder="логин" />
                        {vr.username?.error && <p className="form-input-container__error">{vr.username.error}</p>}
                    </div>
                    <div className="form-input-container">
                        <label className="form-input-container__label">Введите email</label>
                        <input className="form-input-container__input" onInput={this.onInput.bind(this)} value={vr.email.unprocessed} type="email" name="email" placeholder="email" />
                        {vr.email?.error && <p className="form-input-container__error">{vr.email.error}</p>}
                    </div>
                    <div className="form-input-container">
                        <label className="form-input-container__label">Введите пароль</label>
                        <div className="form-input-container__password">
                            <input className="form-input-container__input" onInput={this.onInput.bind(this)} value={vr.password.unprocessed} type={this.state.pas_hidden ? "password" : "text"} name="password" placeholder="пароль" />
                            <img className="form-input-container__password__show" src={this.state.pas_hidden ? "/static/img/hidden.svg" : "/static/img/shown.svg"} alt={this.state.pas_hidden ? "+" : "-"} onClick={() => this.setState({ pas_hidden: !this.state.pas_hidden })} />
                        </div>
                        {vr.password?.error && <p className="form-input-container__error">{vr.password.error}</p>}
                    </div>
                    <div className="form-input-container">
                        <label className="form-input-container__label">Повторите пароль</label>
                        <div className="form-input-container__password">
                            <input className="form-input-container__input" onInput={this.onInput.bind(this)} value={vr.repeatPassword.unprocessed} type={this.state.repas_hidden ? "password" : "text"} name="repeatPassword" placeholder="пароль" />
                            <img className="form-input-container__password__show" src={this.state.repas_hidden ? "/static/img/hidden.svg" : "/static/img/shown.svg"} alt={this.state.repas_hidden ? "+" : "-"} onClick={() => this.setState({ repas_hidden: !this.state.repas_hidden })} />
                        </div>
                        {vr.repeatPassword?.error && <p className="form-input-container__error">{vr.repeatPassword.error}</p>}
                    </div>

                    <div className="form-input-container form-bottom-container">
                        {this.state.error && <p className="form-input-container__error">{this.state.error}</p>}
                        <Button className="form__apply">Зарегистрироваться</Button>
                        <Link to='#login' className="form__link">Уже есть аккаунт? Войти</Link>
                    </div>
                </form>
            </Popup>
        ];
    }
}

export class LogoutForm extends Component {
    onClose(e: MouseEvent) {
        if (e.target instanceof HTMLElement && e.target.classList.contains("popup")) {
            router.replace(location.pathname, {});
        }
    }
    onSubmit() {
        try {
            API.postLogout();
            Dispatcher.dispatch(new ACTIONS.USER_LOGOUT(null));
            router.push(location.pathname, {});
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        return [
            <Popup className="popup--auth" onClick={this.onClose.bind(this)}>
                <form className="form form--auth" onSubmit={this.onSubmit.bind(this)}>
                    <h2 className="form__title">Вы уверены, что хотите выйти?</h2>
                    <ButtonDanger className="form__apply">Выйти</ButtonDanger>
                </form>
            </Popup>
        ];
    }
}
