import './artist-card.scss';
import './artist-card.precompiled.js';

// @ts-ignore
Handlebars.registerPartial(
    'artist-card',
    // @ts-ignore
    Handlebars.templates['artist-card.hbs']
);
