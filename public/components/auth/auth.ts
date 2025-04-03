import './auth.css';
import './auth.precompiled.js';

import { API } from 'utils/api';
import { Component } from '../../libs/Component.ts';

import { Input, InputState, signupContent, loginContent } from './inputTypes';
import { formClickListener, renderGlobalError } from './authFunctions';
import { AuthSendingData } from 'utils/api_types.js';
import Router from 'libs/Router';

type AuthFormData = {
    inputs: Input[],
    submitText: string,
    header: string
}

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
        this.build();
    }

    protected build() {
        this.element.innerHTML = '';
        
        const content = this.getContent(); 

        this.element.insertAdjacentHTML('beforeend', 
            AuthForm.template(content)
        );
        this.element.addEventListener('mousedown', 
            formClickListener
        );

        const inputList: InputState[] = [];
        content.inputs.forEach((input) => {
            if(!input) return;
            const element: InputState = new InputState(
                // @ts-ignore
                this.element, input, 
                this.authType === 'login' ? true : false
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
                sendingData[inputState.input.name as keyof AuthSendingData] = inputState.inputHTML.value;
            });
            
            if (hasError) {
                return;
            }
    
            if (sendingData.identifier && sendingData.identifier.includes('@')) {
                sendingData.email = sendingData.identifier;
                delete sendingData.identifier;
            } 
            if (sendingData.identifier && !sendingData.identifier.includes('@')) {
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
                    const response = await API.postSignup(data);
        
                    if (response.ok) {
                        Router.pushUrl('/', {});
                    } else {
                        renderGlobalError('Пользователь с таким логином/email уже существует');
                    }
                }
                if (this.authType === 'login') {
                    const response = await API.postLogin(data);
            
                    if (response.ok) {
                        Router.pushUrl('/', {});
                    } else {
                        renderGlobalError('Неправильные логин/email или пароль');
                    }
                }
            } catch (error) {
                renderGlobalError('Ошибка сети, попробуйте позже');
            }
        })();
    }
}

