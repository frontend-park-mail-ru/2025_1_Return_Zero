import './songs.precompiled.js';
import '../../components/music-card/music-card.js';
import '../../components/song/song.js';
import '../../components/collections/collections.js';

import { getSongs } from '../../utils.js';

export function renderSongs(callback) {
    const template = Handlebars.templates['songs.hbs'];

    getSongs((response) => {
        if (response.ok) {
            response.json().then((songs) => {
                songs = songs.map((song) => ({
                    ...song,
                    ind: song.id,
                    img: song.image,
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
