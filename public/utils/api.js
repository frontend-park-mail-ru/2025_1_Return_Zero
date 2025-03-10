const baseUrl = '';

/**
 * Makes a GET request to the server to retrieve a list of songs.
 *
 * @param {function} callback - A callback function to be called when the
 * request is complete. The function will be called with a Response object as
 * its single argument.
 */
export function getSongs(callback) {
    fetch(baseUrl + '/tracks?limit=20').then(callback);
}

/**
 * Makes a GET request to the server to retrieve a list of albums.
 *
 * @param {function} callback - A callback function to be called when the
 * request is complete. The function will be called with a Response object as
 * its single argument.
 */
export function getAlbums(callback) {
    fetch(baseUrl + '/albums').then(callback);
}

/**
 * Makes a GET request to the server to retrieve a list of artists.
 *
 * @param {function} callback - A callback function to be called when the
 * request is complete. The function will be called with a Response object as
 * its single argument.
 */
export function getArtists(callback) {
    fetch(baseUrl + '/artists').then(callback);
}

/**
 * Makes a POST request to the server to send new user data.
 *
 * @param {Object} userData - An object containing username, email and password.
 * @param {function} callback - A callback function to be called when the
 * request is complete. The function will be called with a Response object as
 * its single argument.
 */
export function postSignup(userData, callback) {
    fetch(baseUrl + '/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
    }).then(callback);
}

/**
 * Makes a POST request to the server to send new user data.
 *
 * @param {Object} userData - An object containing identifier and password.
 * @param {function} callback - A callback function to be called when the
 * request is complete. The function will be called with a Response object as
 * its single argument.
 */
export function postLogin(userData, callback) {
    fetch(baseUrl + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
    }).then(callback);
}

/**
 * Makes a POST request to the server to log out the current user.
 *
 * @param {function} callback - A callback function to be called when the
 * request is complete. The function will be called with a Response object as
 * its single argument.
 */
export function postLogout(callback) {
    fetch(baseUrl + '/logout', {
        method: 'POST',
        credentials: 'include',
    }).then(callback);
}

/**
 * Makes a GET request to check the current authenticated user.
 *
 * @param {function} callback - A callback function to be called when the
 * request is complete. The function will be called with a Response object as
 * its single argument.
 */
export function getCurrentUser(callback) {
    fetch(baseUrl + '/user', {
        method: 'GET',
        credentials: 'include',
    }).then(callback);
}
