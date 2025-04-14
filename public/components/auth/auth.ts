import './auth.scss';
import './auth.precompiled.js';

import { API } from 'utils/api';
import { AuthSendingData } from 'utils/api_types.js';

import { userState } from 'utils/states';
import Router from 'libs/Router.ts';
import { Component } from '../../libs/Component.ts';

import { Input, InputState, signupContent, loginContent } from './inputTypes';
import { renderGlobalError } from './authFunctions';

type AuthFormData = {
    inputs: Input[];
    submitText: string;
    header: string;
};

type AuthType = 'login' | 'register';

export class AuthForm extends Component {
    protected static BASE_ELEMENT = 'form';
    // @ts-ignore
    static template = Handlebars.templates['auth.hbs'];

    private authType: AuthType;

    protected init(initState: AuthType) {
        this.authType = initState;
        this.element.id = 'auth-form';
        this.element.classList.add('auth-form');
    }

    protected build() {
        this.element.innerHTML = '';

        const content = this.getContent();

        this.element.insertAdjacentHTML(
            'beforeend',
            AuthForm.template(content),
        );

        const changeAuth = this.element.querySelector('#changeAuth');
        let redirectingForm = 'login';
        if (this.authType == 'login') { 
            changeAuth.textContent = 'Нет аккаунта? регистрация';
            redirectingForm = 'register';
        }
        if (this.authType == 'register')  {
            changeAuth.textContent = 'Уже зарегистрированы? войти';
        }

        changeAuth.addEventListener('click', () => {
            Router.pushUrl(`${Router.getPath()}#${redirectingForm}`, {});
        });

        this.element.addEventListener('mousedown', (e) => {
            if ((e.target as HTMLElement).id === 'auth-form') {
                Router.pushUrl(Router.getPath(), {});
            }
        });

        const inputList: InputState[] = [];
        content.inputs.forEach((input) => {
            if (!input) return;
            const element: InputState = new InputState(
                this.element.querySelector(
                    `[name="${input.name}"]`
                ),
                this.element.querySelector(
                    `[name="${input.name}-error"]`
                ),
                input.name,
                this.authType,
                //@ts-ignore
                this.element
            );
            inputList.push(element);
        });

        this.element.addEventListener('submit', (event) => {
            event.preventDefault();

            let hasError = false;
            const sendingData: AuthSendingData = {};
            inputList.forEach((inputState) => {
                if (!inputState.isValid()) {
                    hasError = true;
                }
                sendingData[inputState.input.name as keyof AuthSendingData] =
                    inputState.input.value;
            });

            if (hasError) {
                return;
            }

            if (
                sendingData.identifier &&
                sendingData.identifier.includes('@')
            ) {
                sendingData.email = sendingData.identifier;
                delete sendingData.identifier;
            }
            if (
                sendingData.identifier &&
                !sendingData.identifier.includes('@')
            ) {
                sendingData.username = sendingData.identifier;
                delete sendingData.identifier;
            }

            renderGlobalError('');
            this.sendData(sendingData);
        });
    }

    private getContent(): AuthFormData {
        switch (this.authType) {
            case 'login' as AuthType:
                return loginContent as AuthFormData;
            case 'register' as AuthType:
                return signupContent as AuthFormData;
        }
    }

    private sendData(data: AuthSendingData): void {
        (async () => {
            try {
                if (this.authType === 'register') {
                    try {
                        const response = await API.postSignup(data);
                        userState.setState(response.body);
                        Router.pushUrl(Router.getPath(), {});
                    } catch (error) {
                        renderGlobalError('Пользователь с таким username/email уже существует');
                    }
                }
                if (this.authType === 'login') {
                    try {
                        const response = await API.postLogin(data);
                        userState.setState(response.body);
                        Router.pushUrl(Router.getPath(), {});
                    } catch (error) {
                        renderGlobalError('Неверное имя/email или пароль');
                    }
                }
            } catch (error) {
                renderGlobalError('Ошибка сети, попробуйте позже');
            }
        })();
    }
}
