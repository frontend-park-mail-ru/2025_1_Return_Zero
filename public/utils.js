import { config } from './config.js';

/**
 * Makes a GET request to the server to retrieve a list of songs.
 * 
 * @param {function} callback - A callback function to be called when the
 * request is complete. The function will be called with a Response object as
 * its single argument.
 */
export function getSongs(callback) {
    fetch('/api/songs').then(callback);
}

/**
 * Makes a GET request to the server to retrieve a list of albums.
 * 
 * @param {function} callback - A callback function to be called when the
 * request is complete. The function will be called with a Response object as
 * its single argument.
 */
export function getAlbums(callback) {
    fetch('/api/albums').then(callback);
}

/**
 * Makes a GET request to the server to retrieve a list of artists.
 * 
 * @param {function} callback - A callback function to be called when the
 * request is complete. The function will be called with a Response object as
 * its single argument.
 */
export function getArtists(callback) {
    fetch('/api/artists').then(callback);
}

/**
 * Goes to the page represented by the menu element by adding the rendered page
 * content to the page container.
 * 
 * @param {HTMLElement} menuElement - The menu element that represents the page
 * to go to.
 * @param {HTMLElement} pageContainer - The container element that the rendered
 * page content will be appended to.
 * @param {Object} appState - The application state object that holds references
 * to active page links and menu elements.
 */
export function goToPage(menuElement, pageContainer, appState) {
    pageContainer.innerHTML = '';

    appState.activePageLink.classList.remove('active');
    menuElement.classList.add('active');
    appState.activePageLink = menuElement;

    const element = config.menu[menuElement.dataset.section].render();

    pageContainer.appendChild(element);
}
