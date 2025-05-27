import * as rzv from "libs/rzv/rzv";

const USER_MIL = 3;
const USER_MIL_MES = 'Логин должен содержать от 3 символов'
const USER_MAL = 20;
const USER_MAL_MES = 'Логин должен содержать не более 20 символов'
const USER_SYM = 'a-zA-Z0-9_';
const USER_SYM_MES = 'Логин может содержать только латинские буквы, цифры и _'

const EMAIL_MES = 'Введите корректный email'

const PAS_MIL = 4;
const PAS_MIL_MES = 'Пароль должен содержать от 4 символов'
const PAS_MAL = 25;
const PAS_MAL_MES = 'Пароль должен содержать не более 25 символов'
const PAS_SYM = 'a-zA-Z0-9_';
const PAS_SYM_MES = 'Пароль может содержать только латинские буквы, цифры и символы подчеркивания'

const PLAYLIST_MIL = 3;
const PLAYLIST_MIL_MES = 'Название плейлиста должно содержать от 3 символов'
const PLAYLIST_MAL = 20;
const PLAYLIST_MAL_MES = 'Название плейлиста должно содержать не более 20 символов'
const PLAYLIST_SYM = 'a-zA-Zа-яА-Я0-9_ ';
const PLAYLIST_SYM_MES = 'Запрещённые символы в названии'

const IMG_MES = 'Разрешенные форматы изображений: jpg, jpeg, png, gif'
const IMG_MAS = 5;
const IMG_MAS_MES = 'Максимальный размер загружаемого файла не более 5 МБ'
const REQ_MES = 'Обязательное поле';

export const LOGIN_FORM_VALIDATOR = new rzv.Validator({
    'identifier': rzv.string().required().or([
        d => d.email(EMAIL_MES),
        d => d.min(USER_MIL, USER_MIL_MES).max(USER_MAL, USER_MAL_MES).consistOf(USER_SYM, USER_SYM_MES)
    ], 'Invalid identifier'),
    'password': rzv.string().required(REQ_MES).min(PAS_MIL, PAS_MIL_MES).max(PAS_MAL, PAS_MAL_MES).consistOf(PAS_SYM, PAS_SYM_MES)
});

export const REGISTRATION_FORM_VALIDATOR = new rzv.Validator({
    'username': rzv.string().required(REQ_MES).min(USER_MIL, USER_MIL_MES).max(USER_MAL, USER_MAL_MES).consistOf(USER_SYM, USER_SYM_MES),
    'email': rzv.string().required(REQ_MES).email(EMAIL_MES),
    'password': rzv.string().required(REQ_MES).with('repeatPassword').min(PAS_MIL, PAS_MIL_MES).max(PAS_MAL, PAS_MAL_MES).consistOf(PAS_SYM, PAS_SYM_MES),
    'repeatPassword': rzv.string().required(REQ_MES).oneof([rzv.ref('password')], 'Пароли не совпадают')
});

export const PLAYLIST_CREATE_VALIDATOR = new rzv.Validator({
    'title': rzv.string().required(REQ_MES).min(PLAYLIST_MIL, PLAYLIST_MIL_MES).max(PLAYLIST_MAL, PLAYLIST_MAL_MES).consistOf(PLAYLIST_SYM, PLAYLIST_SYM_MES),
    'thumbnail': rzv.file().required(REQ_MES).img(IMG_MES).max(IMG_MAS, IMG_MAS_MES).addUrl(),
})

export function getPlaylistEditValidator(playlist: AppTypes.Playlist) {
    return new rzv.Validator({
        'title': rzv.string().required(REQ_MES).min(PLAYLIST_MIL, PLAYLIST_MIL_MES).max(PLAYLIST_MAL, PLAYLIST_MAL_MES).consistOf(PLAYLIST_SYM, PLAYLIST_SYM_MES),
        'thumbnail': rzv.file().optional().img(IMG_MES).max(IMG_MAS, IMG_MAS_MES).addUrl(),
    }, {
        'title': playlist.title,
    })
}

export function getSettingsFormValidator(user: AppTypes.User) {
    return new rzv.Validator({
        'new_username': rzv.string().optional().min(USER_MIL, USER_MIL_MES).max(USER_MAL, USER_MAL_MES).consistOf(USER_SYM, USER_SYM_MES),
        'new_email': rzv.string().optional().email(EMAIL_MES),

        'password': rzv.string().ifThen(
            rzv.isOr(rzv.isNotEmpty(rzv.ref('new_password')), rzv.isRefOneOf(rzv.ref('submit'), ['delete'])), 
            (d) => d.required(REQ_MES)
        ).optional().min(PAS_MIL, PAS_MIL_MES).max(PAS_MAL, PAS_MAL_MES).consistOf(PAS_SYM, PAS_SYM_MES),
        'new_password': rzv.string().optional().min(PAS_MIL, PAS_MIL_MES).max(PAS_MAL, PAS_MAL_MES).consistOf(PAS_SYM, PAS_SYM_MES),

        "is_public_playlists": rzv.string().required().oneof(['true', 'false']),
        "is_public_favorite_tracks": rzv.string().required().oneof(['true', 'false']),
        "is_public_favorite_artists": rzv.string().required().oneof(['true', 'false']),
        "is_public_minutes_listened": rzv.string().required().oneof(['true', 'false']),
        "is_public_tracks_listened": rzv.string().required().oneof(['true', 'false']),
        "is_public_artists_listened": rzv.string().required().oneof(['true', 'false']),
    }, {
        "is_public_playlists": user.privacy.is_public_playlists.toString(),
        "is_public_favorite_tracks": user.privacy.is_public_favorite_tracks.toString(),
        "is_public_favorite_artists": user.privacy.is_public_favorite_artists.toString(),
        "is_public_minutes_listened": user.privacy.is_public_minutes_listened.toString(),
        "is_public_tracks_listened": user.privacy.is_public_tracks_listened.toString(),
        "is_public_artists_listened": user.privacy.is_public_artists_listened.toString()
    });
}

export const ARTIST_CREATE_VALIDATOR = new rzv.Validator({
    'title': rzv.string().required(REQ_MES).max(40, 'Не более 40 символов').consistOf('a-zA-Zа-яА-Я0-9_ ', 'Разрешены только буквы, цифры и символы'),
    'thumbnail': rzv.file().required(REQ_MES).img(IMG_MES).max(IMG_MAS, IMG_MAS_MES).addUrl(),
})

export function getArtistEditValidator(artist: AppTypes.Artist) {
    return new rzv.Validator({
        'title': rzv.string().required(REQ_MES).max(40, 'Не более 40 символов').consistOf('a-zA-Zа-яА-Я0-9_ ', 'Разрешены только буквы, цифры и символы'),
        'thumbnail': rzv.file().optional().img(IMG_MES).max(IMG_MAS, IMG_MAS_MES).addUrl(),
    }, {
        'title': artist.title,
    })
}

export const ALBUM_CREATE_VALIDATOR = new rzv.Validator({
    'title': rzv.string().required(REQ_MES).max(40, 'Не более 40 символов').consistOf('a-zA-Zа-яА-Я0-9_ ', 'Разрешены только буквы, цифры и символы'),
    'thumbnail': rzv.file().required(REQ_MES).img(IMG_MES).max(IMG_MAS, IMG_MAS_MES).addUrl(),
    'type': rzv.string().required().oneof(['album', 'single', 'ep', 'compilation'])
})

export function getTrackCreateValidator() {
    return new rzv.Validator({
        'title': rzv.string().required(REQ_MES).max(40, 'Не более 40 символов').consistOf('a-zA-Zа-яА-Я0-9_ ', 'Разрешены только буквы, цифры и символы'),
        'track': rzv.file().required().mp3().addUrl(),
    })
}
