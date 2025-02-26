import { config } from './config.js';
import { goToPage, getSongs, getAlbums, getArtists, postSignup, postLogin } from './utils.js';

/**
 * Creates a menu in the specified container and sets up navigation between pages.
 * 
 * @param {HTMLElement} menuContainer - The container element where the menu items will be appended.
 * @param {HTMLElement} pageContainer - The main container where the page content will be displayed.
 * @param {Object} appState - The application state object that holds references to active page links and menu elements.
 */
export function createMenu(menuContainer, pageContainer, appState) {
    Object.entries(config.menu).forEach(([key, { href, text }], index) => {
        const menuElement = document.createElement('a');
        menuElement.href = href;
        menuElement.innerText = text;
        menuElement.dataset.section = key;

        if (index === 0) {
            menuElement.classList.add('active');
            appState.activePageLink = menuElement;
        }

        appState.menuElements[key] = menuElement;
        menuContainer.appendChild(menuElement);
    });

    menuContainer.addEventListener('click', (event) => {
        if (
            event.target.tagName.toLocaleLowerCase() === 'a' ||
            event.target instanceof HTMLAnchorElement
        ) {
            event.preventDefault();

            goToPage(event.target, pageContainer, appState);
        }
    });

    goToPage(menuContainer.firstElementChild, pageContainer, appState);
}

/**
 * Renders a list of songs, retrieved from the server, inside a div element.
 * 
 * @returns {HTMLDivElement} A div element containing a list of songs.
 */
export function renderSongs() {
    const songs = document.createElement('div');

    getSongs((response) => {
        if (response.ok) {
            response.json().then((data) => {
                data.data.forEach((song) => {
                    const songElement = document.createElement('div');
                    songElement.className = 'song';
                    songElement.innerHTML = `
                        <img class="song-img" src="${song.img}" alt="err">
                        <div class="song-info">
                            <span class="song-title">${song.title}</span>
                            <span class="song-artist">${song.artist}</span>
                        </div>
                        <span class="song-duration">${song.duration}</span>
                    `;
                    songs.appendChild(songElement);
                });
            });
        }
    });

    return songs;
}

/**
 * Renders a list of albums, retrieved from the server, inside a div element.
 * 
 * @returns {HTMLDivElement} A div element containing a list of albums.
 */
export function renderAlbums() {
    const albums = document.createElement('div');

    getAlbums((response) => {
        if (response.ok) {
            response.json().then((data) => {
                data.data.forEach((album) => {
                    const albumElement = document.createElement('div');
                    albumElement.className = 'album';
                    albumElement.innerHTML = `
                        <img class="album-img" src="${album.img}" alt="err">
                        <span class="album-title">${album.title}</span>
                        <span class="album-artist">${album.artist}</span>
                    `;
                    albums.appendChild(albumElement);
                });
            });
        }
    });

    return albums;
}

/**
 * Renders a list of artists, retrieved from the server, inside a div element.
 * 
 * @returns {HTMLDivElement} A div element containing a list of artists.
 */
export function renderArtists() {
    const artists = document.createElement('div');

    getArtists((response) => {
        if (response.ok) {
            response.json().then((data) => {
                data.data.forEach((artist) => {
                    const artistElement = document.createElement('div');
                    artistElement.className = 'artist';
                    artistElement.innerHTML = `
                        <span class="artist-title">${artist}</span>
                    `;
                    artists.appendChild(artistElement);
                });
            });
        }
    });

    return artists;
}

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
    const globalValidCharsChecker = (text) => {
        if (typeof text !== 'string') {
            return false;
        }

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (!((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || (char >= '0' && char <= '9') || char === '_')) {
                return false;
            }
        }

        return true;
    };

    const globalLetterChecker = (text) => {
        if (typeof text !== 'string') {
            return false;
        }

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
                return true;
            }
        }

        return false;
    };

    const requirements = {
        password: {
            minLength: 4,
            maxLength: 25,
            containsLetter: globalLetterChecker,
            containsValidChars: globalValidCharsChecker,
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
            containsValidChars: globalValidCharsChecker,
        },
    };

    switch (type) {
        case 'username':
            const usernameRequirements = requirements.username;
            if (text.length < usernameRequirements.minLength || text.length > usernameRequirements.maxLength) {
                return `Имя пользователя должно быть от ${usernameRequirements.minLength} до ${usernameRequirements.maxLength} символов`;
            }
            if (!usernameRequirements.containsValidChars(text)) {
                return 'Имя пользователя может содержать только латинские буквы, цифры и подчеркивания';
            }
            if (!usernameRequirements.containsLetter(text)) {
                return 'Имя пользователя должно содержать хотя бы одну букву';
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
            break;

        case 'identifier':
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
 * Renders the login form inside a div element.
 * 
 * @returns {HTMLDivElement} A div element containing the login form.
 */
export function renderLogin() {
    const template = Handlebars.templates['Auth.hbs'];
    const formData = {
        inputs: [
            { type: 'text', placeholder: 'Введите username или email', name: 'identifier', errorName: 'identifier-error' },
            { type: 'password', placeholder: 'Введите пароль', name: 'password', errorName: 'password-error' },
        ],
        submitText: 'Войти',
    };

    const form = document.createElement('form');
    form.classList.add('auth-form');
    form.innerHTML = template(formData);

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

        // Clear previous messages
        form.querySelectorAll('p.error-message').forEach(msg => msg.textContent = '');
        form.querySelectorAll('p.success-message').forEach(msg => msg.textContent = '');

        if (message === 'success') {
            postLogin(sendingData, (response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        if (data.status === 'ok') {
                            const successMessage = document.querySelector(`[name="global-error"]`);
                            successMessage.textContent = `Привет, ${data.username}!`;
                            successMessage.className = 'success-message';
                        } else {
                            const errorMessage = document.querySelector(`[name="global-error"]`);
                            errorMessage.textContent = data.message;
                            errorMessage.className = 'error-message';
                        }
                    });
                }
            });
        } else {
            const inputElement = form.querySelector(`[name="${errorInputName}"]`);
            if (inputElement) {
                let validationMessage = inputElement.nextElementSibling;
                if (!validationMessage || validationMessage.tagName !== 'P') {
                    validationMessage = document.querySelector(`[name="${errorInputName}-error"]`);
                }
                validationMessage.textContent = message;
            }
        }
    });

    return form;
}

/**
 * Renders the signup form inside a div element.
 * 
 * @returns {HTMLDivElement} A div element containing the signup form.
 */
export function renderSignup() {
    const template = Handlebars.templates['Auth.hbs']; 
    const formData = {
        inputs: [
            { type: 'text', placeholder: 'Введите username', name: 'username', errorName: 'username-error' },
            { type: 'email', placeholder: 'Введите email', name: 'email',  errorName: 'email-error' },
            { type: 'password', placeholder: 'Введите пароль', name: 'password',  errorName: 'password-error' },
            { type: 'password', placeholder: 'Повторите пароль', name: 'passwordRepeat',  errorName: 'passwordRepeat-error' },
        ],
        submitText: 'Зарегистрироваться',
    };

    const form = document.createElement('form');
    form.classList.add('auth-form');
    form.innerHTML = template(formData);

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
                    response.json().then((data) => {
                        if (data.status === 'ok') {
                            const successMessage = document.querySelector(`[name="global-error"]`);
                            successMessage.textContent = 'Успешно зарегистрирован!';
                            successMessage.className = 'success-message';
                        }
                    });
                } else {
                    response.json().then((data) => {
                        const errorMessage = document.querySelector(`[name="global-error"]`);
                        errorMessage.textContent = data.message;
                        errorMessage.className = 'error-message';
                    });
                }
            });
        } else {
            const inputElement = form.querySelector(`[name="${errorInputName}"]`);
            if (inputElement) {
                let validationMessage = inputElement.nextElementSibling;
                if (!validationMessage || validationMessage.tagName !== 'P') {
                    validationMessage = document.querySelector(`[name="${errorInputName}-error"]`);
                }
                validationMessage.textContent = message;
            }
        }
    });

    return form;
}
