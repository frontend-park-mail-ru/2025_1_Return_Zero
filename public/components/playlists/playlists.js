import './playlists.precompiled.js';

/**
 * Renders the playlist panel.
 *
 * @returns {string} HTML string representing the playlist panel.
 */
export function renderPlaylists() {
    const template = Handlebars.templates['playlists.hbs'];
    const content = {
    };

    return template(content);
}
