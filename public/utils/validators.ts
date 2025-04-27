import * as rzv from "libs/rzv/rzv";

const USER_MIL = 3;
const USER_MIL_MES = 'Логин должен содержать от 3 символов'
const USER_MAL = 20;
const USER_MAL_MES = 'Логин должен содержать не более 20 символов'
const USER_SYM = 'a-zA-Z0-9_';
const USER_SYM_MES = 'Логин может содержать только латинские буквы, цифры и символы подчеркивания'

const EMAIL_MES = 'Введите корректный email'

const PAS_MIL = 4;
const PAS_MIL_MES = 'Пароль должен содержать от 4 символов'
const PAS_MAL = 25;
const PAS_MAL_MES = 'Пароль должен содержать не более 25 символов'
const PAS_SYMB = 'a-zA-Z0-9_';
const PAS_SYMB_MES = 'Пароль может содержать только латинские буквы, цифры и символы подчеркивания'

const REQ_MES = 'Обязательное поле';

export const LOGIN_FORM_VALIDATOR = new rzv.Validator({
    'identifier': rzv.string().required().or([
        d => d.email(EMAIL_MES),
        d => d.min(USER_MIL, USER_MIL_MES).max(USER_MAL, USER_MAL_MES).consistOf(USER_SYM, USER_SYM_MES)
    ], 'Invalid identifier'),
    'password': rzv.string().required(REQ_MES).min(PAS_MIL, PAS_MIL_MES).max(PAS_MAL, PAS_MAL_MES).consistOf(PAS_SYMB, PAS_SYMB_MES)
});

export const REGISTRATION_FORM_VALIDATOR = new rzv.Validator({
    'username': rzv.string().required(REQ_MES).min(USER_MIL, USER_MIL_MES).max(USER_MAL, USER_MAL_MES).consistOf(USER_SYM, USER_SYM_MES),
    'email': rzv.string().required(REQ_MES).email(EMAIL_MES),
    'password': rzv.string().required(REQ_MES).with('repeatPassword').min(PAS_MIL, PAS_MIL_MES).max(PAS_MAL, PAS_MAL_MES).consistOf(PAS_SYMB, PAS_SYMB_MES),
    'repeatPassword': rzv.string().required(REQ_MES).oneof([rzv.ref('password')], 'Пароли не совпадают')
});

export function getSettingsFormValidator(user: AppTypes.User) {
    return new rzv.Validator({
        'new_username': rzv.string().optional().min(USER_MIL, USER_MIL_MES).max(USER_MAL, USER_MAL_MES).consistOf(USER_SYM, USER_SYM_MES),
        'new_email': rzv.string().optional().email(EMAIL_MES),

        'password': rzv.string().ifThen(
            rzv.isOr(rzv.isNotEmpty(rzv.ref('new_password')), rzv.isRefOneOf(rzv.ref('submit'), ['delete'])), 
            (d) => d.required(REQ_MES)
        ).optional().min(PAS_MIL, PAS_MIL_MES).max(PAS_MAL, PAS_MAL_MES).consistOf(PAS_SYMB, PAS_SYMB_MES),
        'new_password': rzv.string().optional().min(PAS_MIL, PAS_MIL_MES).max(PAS_MAL, PAS_MAL_MES).consistOf(PAS_SYMB, PAS_SYMB_MES),

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