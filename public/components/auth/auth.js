import './auth.css';
import './auth.precompiled.js';

import { postSignup, postLogin } from '../../utils/api.js';
import { renderPage } from '../../renderPage.js';
import { updateHeader } from '../header/header.js';

import { validate } from '../../utils/validation.js';

/**
 * Makes the login form.
 *
 * @returns {HTMLDivElement} A div element containing the login form.
 */
export function loginForm() {
    const template = Handlebars.templates['auth.hbs'];
    const formData = {
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

    const form = document.createElement('form');
    form.classList.add('auth-form');
    form.innerHTML = template(formData);
    setTimeout(() => {
        form.addEventListener('mousedown', formClickListener);
    }, 0);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const validationList = [
            { name: 'identifier', type: 'text' },
            { name: 'password', type: 'password' },
        ];

        const sendingData = {
            identifier: '',
            password: '',
        };

        const { message, errorInputName } = validate(
            form,
            validationList,
            sendingData
        );

        if (sendingData['identifier'].includes('@')) {
            sendingData.email = sendingData['identifier'];
        } else {
            sendingData.username = sendingData['identifier'];
        }
        delete sendingData.identifier;

        // Clear previous messages
        form.querySelectorAll('p.error-message').forEach(
            (msg) => (msg.textContent = '')
        );
        form.querySelectorAll('p.success-message').forEach(
            (msg) => (msg.textContent = '')
        );

        if (message === 'success') {
            postLogin(sendingData, (response) => {
                if (response.ok) {
                    renderPage();
                    updateHeader();
                    return;
                } else {
                    const errorMessage = document.querySelector(
                        `[name="global-error"]`
                    );
                    errorMessage.textContent =
                        'Неправильные логин/email или пароль';
                    errorMessage.className = 'error-message';
                }
            });
        } else {
            const errorMessage = document.querySelector(
                `[name="global-error"]`
            );
            errorMessage.textContent = 'Неправильные логин/email или пароль';
            errorMessage.className = 'error-message';
        }
    });

    return form;
}

/**
 * Makes the signup form.
 *
 * @returns {HTMLDivElement} A div element containing the signup form.
 */
export function signupForm() {
    const template = Handlebars.templates['auth.hbs'];
    const formData = {
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

    const form = document.createElement('form');
    form.classList.add('auth-form');
    form.innerHTML = template(formData);
    setTimeout(() => {
        form.addEventListener('mousedown', formClickListener);
    }, 0);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const validationList = [
            { name: 'passwordRepeat', type: 'password' },
            { name: 'password', type: 'password' },
            { name: 'email', type: 'email' },
            { name: 'username', type: 'text' },
        ];

        const sendingData = {
            username: '',
            email: '',
            password: '',
        };

        const { message, errorInputName } = validate(
            form,
            validationList,
            sendingData
        );

        // Clear previous messages
        form.querySelectorAll('p.error-message').forEach(
            (msg) => (msg.textContent = '')
        );
        form.querySelectorAll('p.success-message').forEach(
            (msg) => (msg.textContent = '')
        );

        if (message === 'success') {
            postSignup(sendingData, (response) => {
                if (response.ok) {
                    renderPage();
                    updateHeader();
                    return;
                } else {
                    const errorMessage = document.querySelector(
                        `[name="global-error"]`
                    );
                    errorMessage.textContent =
                        'Пользователь с таким логин/email уже существует';
                    errorMessage.className = 'error-message';
                }
            });
        } else {
            const inputElement = form.querySelector(
                `[name="${errorInputName}"]`
            );
            if (inputElement) {
                const validationMessage = document.querySelector(
                    `[name="${errorInputName}-error"]`
                );
                validationMessage.textContent = message;
            }
        }
    });

    return form;
}

/**
 * Removes the authentication form from the DOM when it is clicked outside of it.
 * @param {Event} event - The event triggered by the click.
 */
function formClickListener(event) {
    const authWindow = document.getElementById('auth');

    if (authWindow && !authWindow.contains(event.target)) {
        const root = document.getElementById('root');
        const authForm = event.currentTarget;

        authForm.removeEventListener('mousedown', formClickListener);
        root.removeChild(event.currentTarget);
        document
            .querySelectorAll('.header__login.active, .header__signup.active')
            .forEach((button) => {
                button.classList.remove('active');
            });
    }
}
