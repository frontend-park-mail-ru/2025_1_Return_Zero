import './artists.precompiled.js';
import '../../components/collections/collections.js';
import '../../components/artist-card/artist-card.js';

import { userAuthChecker } from '../../components/auth/auth.js';

export function renderArtists() {
    const template = Handlebars.templates['artists.hbs'];

    const content = {
        loved: new Array(10).fill({
            img: 'https://upload.wikimedia.org/wikipedia/ru/8/8f/The_Number_Of_The_Beast.jpg',
            name: 'Iron Maiden',
            isFollowed: true,
        }),
        recommendations: new Array(14).fill({
            img: 'https://upload.wikimedia.org/wikipedia/ru/8/8f/The_Number_Of_The_Beast.jpg',
            name: 'Iron Maiden',
        }),
    };
    
    // changing header if user is not authenticated
    userAuthChecker();

    return template(content);
}
