import { loginForm, signupForm } from "../components/auth/auth.js";

import { getCurrentUser } from "./api.js";

/**
 * Checks the current user's authentication status.
 *
 * This function first checks if the header already contains authentication buttons.
 * If not, it makes a request to get the current user. If the user is authenticated,
 * it updates the header with the user's profile information. If the user is not
 * authenticated, it removes any user-specific sections and adds login and signup
 * buttons to the header.
 */
export function userAuthChecker() {
    const headerContainer = document.getElementById('header-container');
    if (document.querySelector('.header__auth')) {
        return;
    }

    getCurrentUser((response) => {
        if (response.ok) {
            // adding user name in header
            const profile__dropdown =
                document.querySelector('.profile__dropdown');
            response.json().then((user) => {
                profile__dropdown.querySelector('.profile__user').textContent =
                    user.username;
            });
        } else {
            // removing user sections
            const authUserSections = document.querySelectorAll(
                'section#loved, section#recent'
            );
            authUserSections.forEach((section) => section.remove());

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