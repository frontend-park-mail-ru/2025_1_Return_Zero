import { config } from './config.js';
import { goToPage, getSongs, getAlbums, getArtists } from './utils.js';

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
 * Creates user inputs.
 * 
 * @returns {HTMLInputElement} A user input element.
 */
function createInput(type, text, name, classList, required) {
    const validInputTypes = new Set([
        "text", "email", "password", "number", "tel", "url", "search",
        "date", "datetime-local", "month", "week", "time", "color", "file"
    ]);

    if (!validInputTypes.has(type) || typeof text !== "string" || typeof name !== "string") {
        return NaN;
    }

    const input = document.createElement('input');
    input.type = type;
    input.placeholder = text;
    input.name = name;
    classList.forEach((classname) => {
        if (typeof classname === "string") {
            input.classList.add(classname);
        }
    });
    input.required = required;

    return input;
};

/**
 * Validates user inputs.
 * 
 * @returns {string} Error message or success depending on meeting the requirements.
 */
function validate(text, type, matchingValue) {
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
            matches: (text) => {
                return text === matchingValue || matchingValue === undefined; 
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
            if (!passwordRequirements.matches(text)) {
                return 'Пароли не совпадают';
            }
            break;

        case 'email':
            break;

        default:
            break;
    }

    return 'success';
}

/**
 * Renders the login form inside a div element.
 * 
 * @returns {HTMLDivElement} A div element containing the login form.
 */
export function renderLogin() {
    const form = document.createElement('form');

    const formInputs = {
        identifier: createInput('text', 'Введите username или email', 'username', [], true),
        password: createInput('password', 'Введите пароль', 'password', [], true),
    };

    Object.entries(formInputs).forEach(([key, inputElement]) => {
        if (inputElement) {
            form.appendChild(inputElement);
        } else {
            console.log(`In renderSignup: Failed to create input element for ${key}`);
        }
    });

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Войти';
    form.appendChild(submitBtn);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const validationList = [
            { name: 'username', type: 'text' },
            { name: 'password', type: 'password' },
        ];

        let isValid = true;
        validationList.forEach(({ name, type }) => {
            const input = form.querySelector(`[name="${name}"]`);
            
            // Checking if input's types wasn't changed. We trust html types validation 
            if (!input) {
                console.log(`Input with name "${name}" not found`);
                isValid = false;
                return;
            }

            if (input.type !== type) {
                console.log(`Input type mismatch for "${name}". Expected "${type}", but found "${input.type}"`);
                isValid = false;
                return;
            }

            // Validating
            const validationResult = validate(input.value, name, input.name === 'password' ? input.value : undefined);
            if (validationResult !== 'success') {
                alert(validationResult);
                isValid = false;
            }
        });

        if (isValid) {
            console.log('Form is valid');
        } else {
            console.log('Form is invalid');
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
    const form = document.createElement('form');

    const formInputs = {
        username: createInput('text', 'Введите username', 'username', [], true),
        email: createInput('email', 'Введите email', 'email', [], true),
        password: createInput('password', 'Введите пароль', 'password', [], true),
        passwordRepeat: createInput('password', 'Повторите пароль', 'passwordRepeat', [], true),
    };

    Object.entries(formInputs).forEach(([key, inputElement]) => {
        if (inputElement) {
            form.appendChild(inputElement);
        } else {
            console.log(`In renderSignup: Failed to create input element for ${key}`);
        }
    });

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Зарегистрироваться';
    form.appendChild(submitBtn);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const validationList = [
            { name: 'username', type: 'text' },
            { name: 'email', type: 'email' },
            { name: 'password', type: 'password' },
            { name: 'passwordRepeat', type: 'password' },
        ];

        let isValid = true;
        validationList.forEach(({ name, type }) => {
            const input = form.querySelector(`[name="${name}"]`);
            
            // Checking if input's types wasn't changed. We trust html types validation 
            if (!input) {
                console.log(`Input with name "${name}" not found`);
                isValid = false;
                return;
            }

            if (input.type !== type) {
                console.log(`Input type mismatch for "${name}". Expected "${type}", but found "${input.type}"`);
                isValid = false;
                return;
            }

            // Validating
            const validationResult = validate(input.value, name, input.name === 'password' ? input.form.passwordRepeat?.value : undefined);
            if (validationResult !== 'success') {
                alert(validationResult);
                isValid = false;
            }
        });

        if (isValid) {
            console.log('Form is valid');
        } else {
            console.log('Form is invalid');
        }
    });

    return form;
}
