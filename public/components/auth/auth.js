import './auth.precompiled.js'

import { postSignup, postLogin, getCurrentUser } from '../../utils.js';

/**
 * Validates user input based on requirements.
 * 
 * @param {string} text - The input text to validate.
 * @param {string} type - The type of input being validated ("username", "password", "passwordRepeat", etc.).
 * @param {string} [matchingValue] - The value to match against (used for password confirmation).
 * 
 * @returns {string} An error message if validation fails, otherwise "success".
 */
function validateInput(text, type, matchingValue) {
    const validLetters = new Set([
        ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    ]);

    const validLoginChars = new Set([
        ...validLetters, 
        '_', 
        ...'0123456789',
    ]);

    const validEmailChars = new Set([
        ...validLoginChars,
        ...'@#!.',
    ])

    const globalValidLoginCharsChecker = (text) => {
        if (typeof text !== 'string') {
            return false;
        }

        return [...text].every(char => validLoginChars.has(char));
    };

    const globalValidEmailCharsChecker = (text) => {
        if (typeof text !== 'string') {
            return false;
        }

        return [...text].every(char => validEmailChars.has(char));
    }

    const globalLetterChecker = (text) => {
        if (typeof text !== 'string') {
            return false;
        }

        return [...text].some(char => validLetters.has(char));
    };

    const requirements = {
        password: {
            minLength: 4,
            maxLength: 25,
            containsLetter: globalLetterChecker,
            containsValidChars: globalValidLoginCharsChecker,
        },
        
        passwordRepeat: {
            matches: (text) => {
                return text === matchingValue; 
            },
        },

        username: {
            minLength: 3,
            maxLength: 20,
            containsLetter: globalLetterChecker,
            containsValidChars: globalValidLoginCharsChecker,
        },

        email: {
            minLength: 5,
            maxLength: 30,
            containsValidChars: globalValidEmailCharsChecker,
        },

        identifier: {
            minLength: 3,
            maxLength: 20,
            containsValidChars: globalValidEmailCharsChecker,
        },
    };

    switch (type) {
        case 'username':
            const usernameRequirements = requirements.username;
            if (text.length < usernameRequirements.minLength || text.length > usernameRequirements.maxLength) {
                return `Логин должно быть от ${usernameRequirements.minLength} до ${usernameRequirements.maxLength} символов`;
            }
            if (!usernameRequirements.containsValidChars(text)) {
                return 'Логин может содержать только латинские буквы, цифры и подчеркивания';
            }
            if (!usernameRequirements.containsLetter(text)) {
                return 'Логин должен содержать хотя бы одну букву';
            }
            break;

        case 'password':
            const passwordRequirements = requirements.password;
            if (text.length < passwordRequirements.minLength || text.length > passwordRequirements.maxLength) {
                return `Пароль должен быть от ${passwordRequirements.minLength} до ${passwordRequirements.maxLength} символов`;
            } 
            if (!passwordRequirements.containsValidChars(text)) {
                return 'Пароль может содержать только латинские буквы, цифры и подчеркивания';
            }
            if (!passwordRequirements.containsLetter(text)) {
                return 'Пароль должен содержать хотя бы одну букву';
            }
            break;

        case 'email':
            const emailRequirements = requirements.email;
            if (text.length < emailRequirements.minLength || text.length > emailRequirements.maxLength) {
                return `Email должен быть от ${emailRequirements.minLength} до ${emailRequirements.maxLength} символов`;
            }
            if (!emailRequirements.containsValidChars(text)) {
                return 'Введите корректный email';
            }
            break;

        case 'identifier':
            const identifierRequirements = requirements.identifier;
            if (text.length < identifierRequirements.minLength || text.length > identifierRequirements.maxLength) {
                return `Логин/email должен быть от ${identifierRequirements.minLength} до ${identifierRequirements.maxLength} символов`;
            }
            if (!identifierRequirements.containsValidChars(text)) {
                return 'Логин/email может содержать только латинские буквы, цифры и подчеркивания';
            }
            break;
        
        case 'passwordRepeat':
            const passwordRepeatRequirements = requirements.passwordRepeat;
            if (!passwordRepeatRequirements.matches(text)) {
                return 'Пароли не совпадают';
            }
            break;

        default:
            return 'Неизвестный параметр';
    }

    return 'success';
}

export function userAuthChecker() {
    const headerContainer = document.getElementById('header-container');
    if (document.querySelector('.header__auth')) {
        return;
    }

    getCurrentUser((response) => {
        if (response.ok) {
            console.log("OK");
        } else {
            // removing user sections
            const authUserSections = document.querySelectorAll('section#loved, section#recent');
            authUserSections.forEach(section => section.remove());

            const playlistsPanel = document.getElementById('playlists-list');
            while (playlistsPanel && playlistsPanel.children.length > 1) {
                playlistsPanel.removeChild(playlistsPanel.children[1]);
            }
    
            // removing profile picture and adding there auth buttons
            const profileHeader = document.querySelector('.header__profile');
            if (profileHeader) {
                profileHeader.remove();
            }
            
            if (!document.querySelector('.header__auth')) {
                const loginButton = document.createElement('button');
                loginButton.classList.add('header__login');
                loginButton.textContent = 'Войти';

                const signupButton = document.createElement('button');
                signupButton.classList.add('header__signup');
                signupButton.textContent = 'Зарегистрироваться';

                const authButtonsContainer = document.createElement('div');
                authButtonsContainer.classList.add('header__auth');

                authButtonsContainer.appendChild(loginButton);
                authButtonsContainer.appendChild(signupButton);

                headerContainer.appendChild(authButtonsContainer);

                loginButton.addEventListener('click', (e) => {
                    e.target.classList.add('active');

                    const root = document.getElementById('root');
                    root.appendChild(loginForm());
                });

                signupButton.addEventListener('click', (e) => {
                    e.target.classList.add('active');

                    const root = document.getElementById('root');
                    root.appendChild(signupForm());
                });
            }
        }   
    });
}

/**
 * Validates user inputs based on a validation list.
 * 
 * @param {HTMLFormElement} form - The form element containing the inputs.
 * @param {Array<{ name: string, type: string }>} validationList - The list of input fields to validate.
 * @param {Object} sendingData - The object where validated input values will be stored.
 * 
 * @returns {{ message: string, errorInputName: string }} The validation result with a success message or an error message and errorInput name.
 */
function validate(form, validationList, sendingData) {
    let message;
    let errorInputName;
    validationList.forEach(({ name, type }) => {
        const input = form.querySelector(`[name="${name}"]`);
        
        // Checking if input's types wasn't changed. We trust html types validation 
        if (!input) {
            message = `Input with name "${name}" not found`;
            errorInputName = name;
            return;
        }

        if (input.type !== type) {
            message = `Input type mismatch for "${name}". Expected "${type}", but found "${input.type}"`;
            errorInputName = name;
            return;
        }

        // Validating
        const validationResult = validateInput(
            input.value.trim(), name, input.name === 'passwordRepeat' 
            ? input.form.password?.value.trim() : undefined
        );
        if (validationResult !== 'success') {
            message = validationResult
            errorInputName = name;
            return;
        }

        // Adding to sending data
        if (name in sendingData) {
            sendingData[name] = input.value;
        }
    });

    if (!message) {
        message = 'success';
    } 
    return { message, errorInputName };
}

/**
 * Makes the login form.
 * 
 * @returns {HTMLDivElement} A div element containing the login form.
 */
export function loginForm() {
    const template = Handlebars.templates['auth.hbs'];
    const formData = {
        inputs: [
            { type: 'text', text: 'Введите логин/email:', name: 'identifier', errorName: 'identifier-error', placeholder: 'логин/email' },
            { type: 'password', text: 'Введите пароль:', name: 'password', errorName: 'password-error', placeholder: 'пароль' },
        ],
        submitText: 'Войти',
        header: 'Авторизация',
    };

    const form = document.createElement('form');
    form.classList.add('auth-form');
    form.innerHTML = template(formData);
    setTimeout(() => {
        form.addEventListener("mousedown", formClickListener);
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

        const { message, errorInputName } = validate(form, validationList, sendingData);
        
        if (sendingData['identifier'].includes('@')) {
            sendingData.email = sendingData['identifier'];
        } else {
            sendingData.username = sendingData['identifier'];
        }
        delete sendingData.identifier;

        // Clear previous messages
        form.querySelectorAll('p.error-message').forEach(msg => msg.textContent = '');
        form.querySelectorAll('p.success-message').forEach(msg => msg.textContent = '');

        if (message === 'success') {
            postLogin(sendingData, (response) => {
                if (response.ok) {
                    location.reload();
                } else {
                    const errorMessage = document.querySelector(`[name="global-error"]`);
                    errorMessage.textContent = 'Неправильные логин/email или пароль';
                    errorMessage.className = 'error-message';
                }
            });
        } else {
            const errorMessage = document.querySelector(`[name="global-error"]`);
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
            { type: 'text', text: 'Введите логин:', name: 'username', errorName: 'username-error', placeholder: 'логин' },
            { type: 'email', text: 'Введите email:', name: 'email',  errorName: 'email-error', placeholder: 'email' },
            { type: 'password', text: 'Введите пароль:', name: 'password',  errorName: 'password-error', placeholder: 'пароль' },
            { type: 'password', text: 'Повторите пароль:', name: 'passwordRepeat',  errorName: 'passwordRepeat-error', placeholder: 'пароль' },
        ],
        submitText: 'Зарегистрироваться',
        header: 'Регистрация',
    };

    const form = document.createElement('form');
    form.classList.add('auth-form');
    form.innerHTML = template(formData);
    setTimeout(() => {
        form.addEventListener("mousedown", formClickListener);
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

        const { message, errorInputName } = validate(form, validationList, sendingData);
        
        // Clear previous messages
        form.querySelectorAll('p.error-message').forEach(msg => msg.textContent = '');
        form.querySelectorAll('p.success-message').forEach(msg => msg.textContent = '');
        
        if (message === 'success') {
            postSignup(sendingData, (response) => {
                if (response.ok) {
                    location.reload();
                } else {
                    const errorMessage = document.querySelector(`[name="global-error"]`);
                    errorMessage.textContent = 'Пользователь с таким логин/email уже существует';
                    errorMessage.className = 'error-message';
                }
            });
        } else {
            const inputElement = form.querySelector(`[name="${errorInputName}"]`);
            if (inputElement) {
                const validationMessage = document.querySelector(`[name="${errorInputName}-error"]`);
                validationMessage.textContent = message;
            }
        }
    });

    return form;
}

function formClickListener(event) {
    const authWindow = document.getElementById("auth");
    
    if (authWindow && !authWindow.contains(event.target)) {
        const root = document.getElementById('root');
        const authForm = event.currentTarget;
        
        authForm.removeEventListener("mousedown", formClickListener);
        root.removeChild(event.currentTarget);
        document.querySelectorAll(".header__login.active, .header__signup.active").forEach(button => {
            button.classList.remove("active");
        });
    }
}

