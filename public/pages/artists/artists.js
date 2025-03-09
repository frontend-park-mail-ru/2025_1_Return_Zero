import './artists.precompiled.js';
import '../../components/collections/collections.js';
import '../../components/artist-card/artist-card.js';

import { getArtists } from '../../utils.js';

export function renderArtists(callback) {
    const template = Handlebars.templates['artists.hbs'];

    getArtists((response) => {
        if (response.ok) {
            response.json().then((artists) => {
                artists = artists.map((artist) => ({
                    ...artist,
                    img: artist.image,
                    name: artist.title,
                }))
                
                const content = {
                    loved: artists,
                    recommendations: artists,
                };

                callback(template(content));
            });
        } else {
            callback(template({}));
        }
    });
}
