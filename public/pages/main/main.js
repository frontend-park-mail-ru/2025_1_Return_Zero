import './main.css';
import './main.precompiled.js';
import '../../components/music-card/music-card.js';
import '../../components/song/song.js';
import '../../components/collections/collections.js';

import { getSongs } from '../../utils/api.js';

/**
 * Renders the main page.
 *
 * @param {function} callback - A callback function to be called when the
 * request is complete. The function will be called with a string argument
 * representing the rendered HTML.
 */
export function renderMain(callback) {
    const template = Handlebars.templates['main.hbs'];

    getSongs((response) => {
        if (response.ok) {
            response.json().then((songs) => {
                songs = songs.map((song) => ({
                    ...song,
                    ind: song.id,
                    img: song.image,
                    hrefAlbum: `#`,
                    hrefArtist: `#`,
                }));

                const content = {
                    loved: songs,
                    recent: songs,
                    recommendations: songs,
                };

                callback(template(content));
            });
        } else {
            callback(template({}));
        }
    });
}
