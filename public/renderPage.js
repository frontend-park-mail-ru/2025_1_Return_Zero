import { renderHeader } from './components/header/header.js';
import { renderPlaylists } from './components/playlists/playlists.js';

import { renderMain } from './pages/main/main.js';
import { renderSongs } from './pages/songs/songs.js';
import { renderArtists } from './pages/artists/artists.js';
import { renderAlbums } from './pages/albums/albums.js';

import { userAuthChecker } from './components/auth/auth.js';
import { updateHeader } from './components/header/header.js';

import { postLogout } from './utils.js';

import { config } from './config.js';


/**
 * Renders the page.
 *
 * The function first renders the header and the playlists, and then listens
 * for clicks on the links in the header. When a link is clicked, the function
 * removes the currently active section, removes the active class from the
 * currently active link, adds the active class to the clicked link, and
 * renders the section corresponding to the clicked link.
 *
 * If the user is logged in, the function also renders the user's login name
 * and a logout link in the header. When the logout link is clicked, the
 * function sends a POST request to the server to log out the user, and then
 * renders the page again.
 */
export function renderPage() {
    let active = 'main';

    const root = document.getElementById('root');
    root.innerHTML = '';

    root.insertAdjacentHTML('beforeend', renderHeader(config.nav));
    setTimeout(() => {
        root.querySelector('#header .header__nav').addEventListener(
            'click',
            (e) => {
                const target = e.target.closest('a');
                if (target) {
                    e.preventDefault();
        
                    const active_nav = root.querySelector('#header .header__nav .active');
                    if (active_nav) {
                        active_nav.classList.remove('active');
                    }
        
                    target.parentNode.classList.add('active');
        
                    const active_node = document.getElementById(active);
                    if (active_node) {
                        root.removeChild(active_node);
                    }
        
                    const section = target.dataset.section;
                    active = section;
                    switch (section) {
                        case 'main':
                            renderMain((html) => {
                                root.insertAdjacentHTML('beforeend', html);
                                userAuthChecker();
                                updateHeader();
                            });
                            break;
                        case 'songs': 
                            renderSongs((html) => {
                                root.insertAdjacentHTML('beforeend', html);
                                userAuthChecker();
                                updateHeader();
                            })
                            break;
                        case 'artists':
                            renderArtists((html) => {
                                root.insertAdjacentHTML('beforeend', html);
                                userAuthChecker();
                                updateHeader();
                            })
                            break;
                        case 'albums':
                            renderAlbums((html) => {
                                root.insertAdjacentHTML('beforeend', html);
                                userAuthChecker();
                                updateHeader();
                            })
                            break;
                    }
                }
            }
        );
        
        root.querySelector('.profile__dropdown').addEventListener('click', (e) => {
            if (e.target.tagName == 'A') {
                e.preventDefault();

                const action = e.target.dataset.action;
                switch (action) {
                    case 'logout':
                        postLogout((resp) => {
                            if (resp.ok) {
                                renderPage();
                            }
                        })
                        break;
                }
            }
        });

        root.querySelector('.header__nav')
            .querySelector(`[data-section="${active}"]`)
            .click();
    });

    root.insertAdjacentHTML('beforeend', renderPlaylists());
}