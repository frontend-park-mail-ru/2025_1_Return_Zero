import { config } from './config.js';
import { goToPage, getSongs, getAlbums, getArtists } from './utils.js';

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
