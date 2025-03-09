import './playlists.precompiled.js';

export function renderPlaylists() {
    const template = Handlebars.templates['playlists.hbs'];
    const content = {
    };

    return template(content);
}
