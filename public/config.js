import { renderSongs, renderAlbums, renderArtists, renderLogin, renderSignup } from './renders.js';

export const config = {
    menu: {
        songs: {
            href: '/songs',
            text: 'Songs',
            render: renderSongs,
        },
        albums: {
            href: '/albums',
            text: 'Albums',
            render: renderAlbums,
        },
        artists: {
            href: '/artists',
            text: 'Artists',
            render: renderArtists,
        },
        login: {
            href: '/login',
            text: 'Авторизация',
            render: renderLogin,
        },
        signup: {
            href: '/signup',
            text: 'Регистрация',
            render: renderSignup,
        },
    },
};
