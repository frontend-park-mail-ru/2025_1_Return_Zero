import './main.precompiled.js'
import '../card/card.js'

export function renderMain() {
    const template = Handlebars.templates['main.hbs'];
    const content = {
        recent: new Array(10).fill({
            text: 'The number of the beast',
            img: 'https://upload.wikimedia.org/wikipedia/ru/8/8f/The_Number_Of_The_Beast.jpg',
            href: ''
        }),
        loved: new Array(10).fill({
            text: 'The number of the beast',
            img: 'https://upload.wikimedia.org/wikipedia/ru/8/8f/The_Number_Of_The_Beast.jpg',
            href: ''
        }),
        recommendations: new Array(10).fill({
            img: 'https://upload.wikimedia.org/wikipedia/ru/8/8f/The_Number_Of_The_Beast.jpg',

            title: 'The number of the beast',
            artist: 'Iron Maiden',
            album: 'The number of the beast',

            duration: '4:00'
        }),
    };
    
    return template(content);
}