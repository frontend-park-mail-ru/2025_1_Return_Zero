import './playlists.precompiled.js'

export function renderPlaylists() {
    const template = Handlebars.templates['playlists.hbs'];
    
    const playlists = new Array(50).fill(
        {img: 'https://upload.wikimedia.org/wikipedia/ru/8/8f/The_Number_Of_The_Beast.jpg', href: ''},
        0, 50
    )
    const content = {
        playlists
    };

    return template(content);
}