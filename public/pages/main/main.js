import './main.precompiled.js';
import '../../components/music-card/music-card.js';
import '../../components/song/song.js';

export function renderMain() {
    const template = Handlebars.templates['main.hbs'];
    const content = {
        recent: new Array(10).fill({
            title: 'The number of the beast',
            artist: 'Iron Maiden',
            img: 'https://upload.wikimedia.org/wikipedia/ru/8/8f/The_Number_Of_The_Beast.jpg',
            href: '',
        }),
        loved: new Array(10).fill({
            title: 'The number of the beast',
            artist: 'Iron Maiden',
            img: 'https://upload.wikimedia.org/wikipedia/ru/8/8f/The_Number_Of_The_Beast.jpg',
            href: '',
        }),
        recommendations: new Array(20)
            .fill({
                img: 'https://upload.wikimedia.org/wikipedia/ru/8/8f/The_Number_Of_The_Beast.jpg',

                title: 'The number of the beast',
                artist: 'Iron Maiden',
                album: 'The number of the beast',

                duration: '4:00',
                isLiked: false,
            })
            .map((song, index) => ({
                ...song,
                ind: index + 1,
            })),
    };

    content.recommendations[1].title = 'Another';
    content.recommendations[1].artist = 'Another';
    content.recommendations[1].album = 'Another';
    content.recommendations[1].isLiked = true;

    return template(content);
}
