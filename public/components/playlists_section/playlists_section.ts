import './playlists_section.scss';
import './playlists_section.precompiled.js';
import '../playlist-card/playlist-card';

// @ts-ignore
Handlebars.registerPartial(
    'playlists-section',
    // @ts-ignore
    Handlebars.templates['playlists_section.hbs']
);
