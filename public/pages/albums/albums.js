import '../../components/album-card/album-card.js';
import '../../components/album/album.js';
import './albums.precompiled.js';

export function renderAlbums() {
    const template = Handlebars.templates['albums.hbs'];

    const content = {
        loved: new Array(10).fill({
            img: 'https://upload.wikimedia.org/wikipedia/ru/8/8f/The_Number_Of_The_Beast.jpg',
            title: 'The number of the beast',
            artist: 'Iron Maiden',

            isLiked: true,
        }),

        recommendations: new Array(20)
            .fill({
                img: 'https://upload.wikimedia.org/wikipedia/ru/8/8f/The_Number_Of_The_Beast.jpg',
                title: 'The number of the beast',
                artist: 'Iron Maiden',
                description: 'Very good shit mzf',

                isPlaying: false,
                isLiked: false,
            })
            .map((song, index) => ({
                ind: index + 1,
                ...song,
            })),
    };

    return template(content);
}
