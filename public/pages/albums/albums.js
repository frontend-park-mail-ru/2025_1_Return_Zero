import './albums.precompiled.js';
import '../../components/album-card/album-card.js';
import '../../components/album/album.js';
import '../../components/collections/collections.js';

import { getAlbums } from '../../utils.js';

/**
 * Renders the albums page.
 *
 * @param {function} callback - A callback function to be called when the
 * request is complete. The function will be called with a string argument
 * representing the rendered HTML.
 */
export function renderAlbums(callback) {
    const template = Handlebars.templates['albums.hbs'];

    getAlbums((response) => {
        if (response.ok) {
            response.json().then((albums) => {
                albums = albums.map((album) => ({
                    ...album,
                    ind: album.id,
                    img: album.image,
                    hrefAlbum: `#`,
                    hrefArtist: `#`,
                }));
                
                const content = {
                    loved: albums,
                    recent: albums,
                    recommendations: albums,
                };

                callback(template(content));
            });
        } else {
            callback(template({}));
        }
    });
}
