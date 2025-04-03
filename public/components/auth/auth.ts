import './auth.css';
import './auth.precompiled.js';

import { API } from 'utils/api';
import { Component } from 'libs/Component';

import { Input, InputState } from './inputTypes';
import { popUpListener } from './popUpListener';
import { AuthSendingData } from 'utils/api_types.js';

type AuthFormData = {
    inputs: Input[],
    submitText: string,
    header: string
}

function renderGlobalError(text: string): void {
    const errorMessage: HTMLParagraphElement | null = document.querySelector(
        `[name="global-error"]`
    );
    if (!errorMessage) {
        return;
    }

    errorMessage.textContent = text;
    errorMessage.className = 'error-message';
}

export class LoginForm extends Component {
    // @ts-ignore
    static template = Handlebars.templates['auth.hbs'];

    constructor() {
        super();
    }

    protected init() {
        this.element.id = 'login-form';
    }

    protected build() {
        this.element.innerHTML = '';

        const content: AuthFormData = {
            inputs: [
                {
                    type: 'text',
                    text: 'Введите логин/email:',
                    name: 'identifier',
                    errorName: 'identifier-error',
                    placeholder: 'логин/email',
                },
                {
                    type: 'password',
                    text: 'Введите пароль:',
                    name: 'password',
                    errorName: 'password-error',
                    placeholder: 'пароль',
                },
            ],
            submitText: 'Войти',
            header: 'Авторизация',
        };

        this.element.insertAdjacentHTML('beforeend', LoginForm.template(content));

        const form = this.element.querySelector('form')
        
        form.addEventListener('mousedown', popUpListener.formClickListener);
        
        const inputList: InputState[] = [];
        content.inputs.forEach((input) => {
            if(!input) return;
            const element: InputState = new InputState(form, input, true);
            inputList.push(element);
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            let hasError = false;
            const sendingData: AuthSendingData = {};
            inputList.forEach((inputState) => {
                if (!inputState.isValid()) {
                    hasError = true;
                }
                sendingData[inputState.input.name as keyof AuthSendingData] = inputState.inputHTML.value;
            });
            
            if (hasError) {
                return;
            }
    
            if (sendingData.identifier && sendingData.identifier.includes('@')) {
                sendingData.email = sendingData.identifier;
            } else {
                sendingData.username = sendingData.identifier;
            }
    
            renderGlobalError('');
            (async () => {
                try {
                    const response = await API.postLogin(sendingData);
            
                    if (response.ok) {
                        location.reload();
                    } else {
                        renderGlobalError('Неправильные логин/email или пароль');
                    }
                } catch (error) {
                    console.error('Ошибка при входе:', error);
                    renderGlobalError('Ошибка сети, попробуйте позже');
                }
            })();
        });
    }
}

export class SignupForm extends Component {
    // @ts-ignore
    static template = Handlebars.templates['auth.hbs'];

    constructor() {
        super();
    }

    protected init() {
        this.element.id = 'signup-form';
    }

    protected build() {
        this.element.innerHTML = '';

        const content: AuthFormData = {
            inputs: [
                {
                    type: 'text',
                    text: 'Введите логин:',
                    name: 'username',
                    errorName: 'username-error',
                    placeholder: 'логин',
                },
                {
                    type: 'email',
                    text: 'Введите email:',
                    name: 'email',
                    errorName: 'email-error',
                    placeholder: 'email',
                },
                {
                    type: 'password',
                    text: 'Введите пароль:',
                    name: 'password',
                    errorName: 'password-error',
                    placeholder: 'пароль',
                },
                {
                    type: 'password',
                    text: 'Повторите пароль:',
                    name: 'passwordRepeat',
                    errorName: 'passwordRepeat-error',
                    placeholder: 'пароль',
                },
            ],
            submitText: 'Зарегистрироваться',
            header: 'Регистрация',
        };

        this.element.insertAdjacentHTML('beforeend', SignupForm.template(content));

        const form = this.element.querySelector('form')
        
        form.addEventListener('mousedown', popUpListener.formClickListener);
        
        const inputList: InputState[] = [];
        content.inputs.forEach((input) => {
            if(!input) return;
            const element: InputState = new InputState(form, input, false);
            inputList.push(element);
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            let hasError = false;
            const sendingData: AuthSendingData = {};
            inputList.forEach((inputState) => {
                if (!inputState.isValid()) {
                    hasError = true;
                }
                sendingData[inputState.input.name as keyof AuthSendingData] = inputState.inputHTML.value;
            });
            
            if (hasError) {
                return;
            }
    
            renderGlobalError('');
            (async () => {
                try {
                    const response = await API.postSignup(sendingData);
            
                    if (response.ok) {
                        location.reload();
                    } else {
                        renderGlobalError('Пользователь с таким логин/email уже существует');
                    }
                } catch (error) {
                    console.error('Ошибка при регистрации:', error);
                    renderGlobalError('Ошибка сети, попробуйте позже');
                }
            })();
        });
    }
}

