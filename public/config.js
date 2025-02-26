// import { renderSongs, renderAlbums, renderArtists, renderLogin, renderSignup } from './renders.js';

export const config = {
    nav: {
        main: {
            href: '/',
            text: 'Главная',
            icon: '/static/img/icon-tracks.svg',
            // render: renderSongs,
        },
        songs: {
            href: '/songs',
            text: 'Треки',
            icon: '/static/img/icon-tracks.svg',
            // render: renderSongs,
        },
        artists: {
            href: '/artists',
            text: 'Артисты',
            icon: '/static/img/icon-artists.svg',
            // render: renderArtists,
        },
        albums: {
            href: '/albums',
            text: 'Альбомы',
            icon: '/static/img/icon-albums.svg',
            // render: renderAlbums,
        },
        // login: {
        //     href: '/login',
        //     text: 'Авторизация',
        //     render: renderLogin,
        // },
        // signup: {
        //     href: '/signup',
        //     text: 'Регистрация',
        //     render: renderSignup,
        // },
    },
};
