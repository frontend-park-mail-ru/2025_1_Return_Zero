import * as rzv from "libs/rzv/rzv";

const USER_MIL = 3;
const USER_MAL = 20;
const USER_SYM = 'a-zA-Z0-9_';

const PAS_MIL = 4;
const PAS_MAL = 25;
const PASS_SYMB = 'a-zA-Z0-9_';
const PAS_NUM = '0-9';
const PAS_LET = 'a-zA-Z';

export const LOGIN_FORM_VALIDATOR = new rzv.Validator({
    'identifier': rzv.string().required().or([
        d => d.email('Некорректный email'),
        d => d.min(USER_MIL).max(USER_MAL).consistOf(USER_SYM)
    ], 'Invalid identifier'),
    'password': rzv.string().required().min(PAS_MIL).max(PAS_MAL).consistOf(PASS_SYMB)
        .containsOneOf(PAS_NUM).containsOneOf(PAS_LET)
});

export const REGISTRATION_FORM_VALIDATOR = new rzv.Validator({
    'username': rzv.string().required().min(USER_MIL).max(USER_MAL).consistOf(USER_SYM),
    'email': rzv.string().required().email(),
    'password': rzv.string().required().min(PAS_MIL).max(PAS_MAL).consistOf(PASS_SYMB)
        .containsOneOf(PAS_NUM).containsOneOf(PAS_LET),
    'repeatPassword': rzv.string().required().oneof([rzv.ref('password')], 'Пароли не совпадают')
});

export function getSettingsFormValidator(user: AppTypes.User) {
    return new rzv.Validator({
        'new_username': rzv.string().optional().min(USER_MIL).max(USER_MAL).consistOf(USER_SYM),
        'new_email': rzv.string().optional().email(),

        'password': rzv.string().ifThen(
            rzv.isOr(rzv.isNotEmpty(rzv.ref('new_password')), rzv.isRefOneOf(rzv.ref('submit'), ['delete'])), 
            (d) => d.required()
        ).optional().min(PAS_MIL).max(PAS_MAL).consistOf(PASS_SYMB).containsOneOf(PAS_NUM).containsOneOf(PAS_LET),
        'new_password': rzv.string().optional().min(PAS_MIL).max(PAS_MAL).consistOf(PASS_SYMB)
            .containsOneOf(PAS_NUM).containsOneOf(PAS_LET),

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