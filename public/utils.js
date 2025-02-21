import { config } from './config.js';

export function getSongs(callback) {
    fetch('/api/songs').then(callback);
}

export function getAlbums(callback) {
    fetch('/api/albums').then(callback);
}

export function getArtists(callback) {
    fetch('/api/artists').then(callback);
}

export function goToPage(menuElement, pageContainer, appState) {
    pageContainer.innerHTML = '';

    appState.activePageLink.classList.remove('active');
    menuElement.classList.add('active');
    appState.activePageLink = menuElement;

    const element = config.menu[menuElement.dataset.section].render();

    pageContainer.appendChild(element);
}
