import { renderHeader } from './components/header/header.js';
import { renderPlaylists } from './components/playlists/playlists.js';

import { renderMain } from './pages/main/main.js';
import { renderSongs } from './pages/songs/songs.js';
import { renderArtists } from './pages/artists/artists.js';
import { renderAlbums } from './pages/albums/albums.js';

import { config } from './config.js';

import { userAuthChecker } from './components/auth/auth.js';

export function renderPage() {
    let active = 'main';

    const root = document.getElementById('root');

    root.insertAdjacentHTML('beforeend', renderHeader(config.nav));
    setTimeout(() => {
        root.querySelector('#header .header__nav').addEventListener(
            'click',
            (e) => {
                if (e.target.tagName === 'A') {
                    e.preventDefault(); 

                    const active_nav = root
                        .querySelector('#header .header__nav')
                        .querySelector('.active');
                    if (active_nav) {
                        active_nav.classList.remove('active');
                    }
                    e.target.parentNode.classList.add('active');

                    const active_node = document.getElementById(active);
                    if (active_node) {
                        root.removeChild(active_node);
                    }

                    const section = e.target.dataset.section;
                    active = section;
                    switch (section) {
                        case 'main':
                            renderMain((html) => {
                                root.insertAdjacentHTML('beforeend', html);
                                userAuthChecker();
                            });
                            break;
                        case 'songs': 
                            renderSongs((html) => {
                                root.insertAdjacentHTML('beforeend', html);
                                userAuthChecker();
                            })
                            break;
                        case 'artists':
                            renderArtists((html) => {
                                root.insertAdjacentHTML('beforeend', html);
                                userAuthChecker();
                            })
                            break;
                        case 'albums':
                            renderAlbums((html) => {
                                root.insertAdjacentHTML('beforeend', html);
                                userAuthChecker();
                            })
                            break;
                    }
                }
            }
        );
        root.querySelector('.header__nav')
            .querySelector(`[data-section="${active}"]`)
            .click();
    });

    root.insertAdjacentHTML('beforeend', renderPlaylists());
}

